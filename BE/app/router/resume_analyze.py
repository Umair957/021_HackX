from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from app.core.security import get_current_user
from app.services.analyze_service import ResumeAnalyzerService
from app.database.models.resume_analysis import ResumeAnalysis
from app.utils.logger import get_logger
from typing import Optional, List
import os
import shutil
from pathlib import Path
import uuid
from datetime import datetime

router = APIRouter()
logger = get_logger(__name__)

# Initialize the AI service
analyzer_service = ResumeAnalyzerService()

# Define the temporary directory for storing uploaded files
TEMP_DIR = Path("temp_resumes")
TEMP_DIR.mkdir(exist_ok=True)

# Allowed file types and max file size (5MB)
ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB in bytes


def validate_file_extension(filename: str) -> bool:
    """Validate if the file extension is allowed."""
    file_ext = Path(filename).suffix.lower()
    return file_ext in ALLOWED_EXTENSIONS


async def save_upload_file_temp(upload_file: UploadFile) -> str:
    """
    Save uploaded file to temporary directory and return the file path.
    """
    # Generate unique filename to avoid conflicts
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    file_ext = Path(upload_file.filename).suffix
    temp_filename = f"resume_{timestamp}_{unique_id}{file_ext}"
    temp_filepath = TEMP_DIR / temp_filename
    
    try:
        # Save file to disk
        with temp_filepath.open("wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        
        return str(temp_filepath)
    
    except Exception as e:
        # Clean up if save fails
        if temp_filepath.exists():
            temp_filepath.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )


@router.post("/analyze", status_code=status.HTTP_200_OK)
async def analyze_resume(
    file: UploadFile = File(...),
    job_title: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    """
    Endpoint to upload and analyze a resume file.
    
    - Accepts PDF, DOC, or DOCX files
    - Maximum file size: 5MB
    - Optional: job_title and job_description for targeted analysis
    - Saves file temporarily for processing
    - Returns AI analysis results
    """
    
    # Validate file type
    if not validate_file_extension(file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Read file content to check size
    file_content = await file.read()
    file_size = len(file_content)
    
    # Validate file size
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum limit of 5MB. Your file is {file_size / (1024 * 1024):.2f}MB"
        )
    
    # Reset file pointer to beginning
    await file.seek(0)
    
    # Save file temporarily
    try:
        temp_file_path = await save_upload_file_temp(file)
        
        # Call Gemini AI service to analyze the resume
        analysis_result = await analyzer_service.analyze_resume(
            file_path=temp_file_path,
            user_id=current_user.get("user_id"),
            file_name=file.filename,
            file_size=file_size,
            file_type=file.content_type,
            job_title=job_title,
            job_description=job_description
        )
        
        # Cleanup: Delete the temporary file after analysis
        await analyzer_service.cleanup_temp_file(temp_file_path)
        
        return {
            "status": "success",
            "message": "Resume analyzed successfully",
            "file_info": {
                "filename": file.filename,
                "size_kb": round(file_size / 1024, 2),
                "job_title": job_title,
                "has_job_description": bool(job_description)
            },
            "analysis": analysis_result
        }
    
    except HTTPException:
        raise
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing file: {str(e)}"
        )


@router.delete("/cleanup/{filename}", status_code=status.HTTP_200_OK)
async def cleanup_temp_file(
    filename: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Endpoint to delete a temporary file after analysis is complete.
    """
    temp_filepath = TEMP_DIR / filename
    
    if not temp_filepath.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    try:
        temp_filepath.unlink()
        return {"status": "success", "message": "Temporary file deleted successfully"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete file: {str(e)}"
        )

@router.get("/history", status_code=status.HTTP_200_OK)
async def get_analysis_history(
    limit: int = 10,
    skip: int = 0,
    current_user: dict = Depends(get_current_user)
):
    """
    Get user's resume analysis history
    
    - Returns paginated list of previous analyses
    - Sorted by most recent first
    - limit: Maximum number of results to return (default: 10)
    - skip: Number of results to skip for pagination (default: 0)
    """
    try:
        user_id = current_user.get("user_id")
        
        # Query analyses for this user, sorted by date descending
        analyses = await ResumeAnalysis.find(
            ResumeAnalysis.user_id == user_id
        ).sort("-analyzed_at").skip(skip).limit(limit).to_list()
        
        # Get total count for pagination
        total_count = await ResumeAnalysis.find(
            ResumeAnalysis.user_id == user_id
        ).count()
        
        return {
            "status": "success",
            "total": total_count,
            "limit": limit,
            "skip": skip,
            "analyses": [
                {
                    "id": str(analysis.id),
                    "file_name": analysis.file_name,
                    "file_size": analysis.file_size,
                    "job_title": analysis.job_context.job_title if analysis.job_context else None,
                    "has_job_description": bool(analysis.job_context and analysis.job_context.job_description),
                    "scores": {
                        "overall": analysis.scores.overall_score,
                        "ats": analysis.scores.ats_compatibility_score,
                        "formatting": analysis.scores.formatting_score,
                        "keywords": analysis.scores.keyword_optimization_score
                    },
                    "analyzed_at": analysis.analyzed_at.isoformat(),
                }
                for analysis in analyses
            ]
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching analysis history: {str(e)}"
        )


@router.get("/history/{analysis_id}", status_code=status.HTTP_200_OK)
async def get_analysis_detail(
    analysis_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get detailed information about a specific resume analysis
    
    - Returns complete analysis results including suggestions, strengths, and weaknesses
    - Validates that the analysis belongs to the current user
    """
    try:
        user_id = current_user.get("user_id")
        
        # Fetch the analysis
        analysis = await ResumeAnalysis.get(analysis_id)
        
        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Analysis not found"
            )
        
        # Verify ownership
        if analysis.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        return {
            "status": "success",
            "analysis": {
                "id": str(analysis.id),
                "file_info": {
                    "name": analysis.file_name,
                    "size": analysis.file_size,
                    "type": analysis.file_type
                },
                "job_context": {
                    "job_title": analysis.job_context.job_title if analysis.job_context else None,
                    "job_description": analysis.job_context.job_description if analysis.job_context else None
                },
                "scores": {
                    "overall_score": analysis.scores.overall_score,
                    "ats_score": analysis.scores.ats_compatibility_score,
                    "formatting_score": analysis.scores.formatting_score,
                    "content_quality_score": analysis.scores.content_quality_score,
                    "keyword_optimization_score": analysis.scores.keyword_optimization_score
                },
                "strengths": analysis.strengths,
                "weaknesses": analysis.weaknesses,
                "improvement_suggestions": [
                    {
                        "category": suggestion.category,
                        "suggestion": suggestion.suggestion,
                        "priority": suggestion.priority
                    }
                    for suggestion in analysis.improvement_suggestions
                ],
                "analyzed_at": analysis.analyzed_at.isoformat()
            }
        }
    
    except HTTPException:
        raise
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching analysis details: {str(e)}"
        )