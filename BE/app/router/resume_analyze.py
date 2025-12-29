from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
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


@router.post("/analyze-bulk", status_code=status.HTTP_200_OK)
async def analyze_bulk_resumes(
    files: List[UploadFile] = File(...),
    job_title: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    """
    Endpoint to upload and analyze multiple resume files in bulk.
    
    - Accepts up to 10 PDF, DOC, or DOCX files
    - Maximum file size per file: 5MB
    - Optional: job_title and job_description for targeted analysis
    - Returns individual analysis for each resume + consolidated summary
    - Consolidated summary ranks candidates by ATS score
    """
    
    # Validate number of files
    if len(files) > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 10 files allowed per bulk upload"
        )
    
    if len(files) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one file is required"
        )
    
    # Check if user is recruiter
    user_role = current_user.get("role")
    if user_role != "recruiter":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bulk analysis is only available for recruiters"
        )
    
    individual_results = []
    temp_files = []
    
    try:
        # Process each file
        for file in files:
            result = {"file_name": file.filename, "status": "processing"}
            
            try:
                # Validate file type
                if not validate_file_extension(file.filename):
                    result["status"] = "error"
                    result["error"] = f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
                    individual_results.append(result)
                    continue
                
                # Read file content to check size
                file_content = await file.read()
                file_size = len(file_content)
                
                # Validate file size
                if file_size > MAX_FILE_SIZE:
                    result["status"] = "error"
                    result["error"] = f"File exceeds 5MB limit ({file_size / (1024 * 1024):.2f}MB)"
                    individual_results.append(result)
                    continue
                
                # Reset file pointer
                await file.seek(0)
                
                # Save file temporarily
                temp_file_path = await save_upload_file_temp(file)
                temp_files.append(temp_file_path)
                
                # Analyze the resume
                analysis_result = await analyzer_service.analyze_resume(
                    file_path=temp_file_path,
                    user_id=current_user.get("user_id"),
                    file_name=file.filename,
                    file_size=file_size,
                    file_type=file.content_type,
                    job_title=job_title,
                    job_description=job_description
                )
                
                result["status"] = "success"
                result["file_size_kb"] = round(file_size / 1024, 2)
                result["analysis"] = analysis_result
                individual_results.append(result)
                
            except Exception as e:
                logger.error(f"Error analyzing {file.filename}: {str(e)}")
                result["status"] = "error"
                result["error"] = str(e)
                individual_results.append(result)
        
        # Generate consolidated summary
        successful_analyses = [r for r in individual_results if r["status"] == "success"]
        
        consolidated_summary = {
            "total_resumes": len(files),
            "successful_analyses": len(successful_analyses),
            "failed_analyses": len(files) - len(successful_analyses),
            "job_context": {
                "job_title": job_title,
                "has_job_description": bool(job_description)
            },
            "ranking": []
        }
        
        if successful_analyses:
            # Rank by ATS score
            ranked = sorted(
                successful_analyses,
                key=lambda x: x["analysis"]["ats_score"],
                reverse=True
            )
            
            for idx, resume in enumerate(ranked, 1):
                consolidated_summary["ranking"].append({
                    "rank": idx,
                    "file_name": resume["file_name"],
                    "overall_score": resume["analysis"]["score"],
                    "ats_score": resume["analysis"]["ats_score"],
                    "keyword_match": resume["analysis"]["keyword_match"],
                    "top_strength": resume["analysis"]["strengths"][0] if resume["analysis"]["strengths"] else None,
                    "main_concern": resume["analysis"]["weaknesses"][0] if resume["analysis"]["weaknesses"] else None,
                    "recommendation": _get_recommendation(resume["analysis"]["ats_score"])
                })
            
            # Calculate statistics
            ats_scores = [r["analysis"]["ats_score"] for r in successful_analyses]
            overall_scores = [r["analysis"]["score"] for r in successful_analyses]
            
            consolidated_summary["statistics"] = {
                "average_ats_score": round(sum(ats_scores) / len(ats_scores), 2),
                "average_overall_score": round(sum(overall_scores) / len(overall_scores), 2),
                "highest_ats_score": max(ats_scores),
                "lowest_ats_score": min(ats_scores),
                "strong_candidates": len([s for s in ats_scores if s >= 80]),
                "moderate_candidates": len([s for s in ats_scores if 60 <= s < 80]),
                "weak_candidates": len([s for s in ats_scores if s < 60])
            }
        
        return {
            "status": "success",
            "message": f"Analyzed {len(successful_analyses)} of {len(files)} resumes successfully",
            "consolidated_summary": consolidated_summary,
            "individual_results": individual_results
        }
    
    except HTTPException:
        raise
    
    except Exception as e:
        logger.error(f"Bulk analysis error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing bulk upload: {str(e)}"
        )
    
    finally:
        # Cleanup all temporary files
        for temp_file in temp_files:
            try:
                await analyzer_service.cleanup_temp_file(temp_file)
            except Exception as e:
                logger.warning(f"Failed to cleanup {temp_file}: {str(e)}")


def _get_recommendation(ats_score: int) -> str:
    """Generate hiring recommendation based on ATS score"""
    if ats_score >= 85:
        return "Highly Recommended - Strong match for the position"
    elif ats_score >= 75:
        return "Recommended - Good fit with minor improvements needed"
    elif ats_score >= 60:
        return "Consider with Caution - May require significant development"
    else:
        return "Not Recommended - Poor fit for the position"


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


@router.post("/apply-fix")
async def apply_fix_to_resume(
    cv_content: str = Form(...),
    fix_instruction: str = Form(...),
    category: str = Form(...),
    original_filename: str = Form(default="resume.txt"),
    file: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user)
):
    """
    Apply an AI suggestion to the resume content.
    Saves the modified resume while preserving the original file structure.
    Returns the modified CV content and file paths.
    """
    temp_file_path = None
    try:
        user_id = current_user.get("user_id")
        
        logger.info(f"Applying fix for user {user_id}, category: {category}")
        
        # Save uploaded file temporarily if provided
        if file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_id = str(uuid.uuid4())[:8]
            temp_filename = f"temp_{timestamp}_{unique_id}_{file.filename}"
            temp_file_path = TEMP_DIR / temp_filename
            
            with open(temp_file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            logger.info(f"Saved temporary original file: {temp_file_path}")
        
        # Use AI service to apply the fix
        modified_content = await analyzer_service.apply_fix_to_content(
            cv_content=cv_content,
            fix_instruction=fix_instruction,
            category=category
        )
        
        # Save the modified CV preserving original structure
        original_format_path, pdf_path = await analyzer_service.save_modified_cv_with_structure(
            modified_content=modified_content,
            original_filename=original_filename,
            original_file_path=str(temp_file_path) if temp_file_path else None,
            user_id=user_id,
            output_dir=TEMP_DIR
        )
        
        logger.info(f"Modified CV saved - Original: {original_format_path}, PDF: {pdf_path}")
        
        return {
            "status": "success",
            "message": "Fix applied successfully and saved",
            "data": {
                "modified_content": modified_content,
                "fix_applied": fix_instruction,
                "category": category,
                "files": {
                    "original_format": original_format_path,
                    "pdf": pdf_path
                }
            }
        }
    
    except Exception as e:
        logger.error(f"Error applying fix: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error applying fix: {str(e)}"
        )
    finally:
        # Cleanup temporary original file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
                logger.info("Cleaned up temporary original file")
            except Exception as e:
                logger.warning(f"Failed to cleanup temp file: {str(e)}")


@router.get("/download/{filename}")
async def download_modified_resume(
    filename: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Download a modified resume file (original format or PDF).
    """
    try:
        file_path = TEMP_DIR / filename
        
        if not file_path.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
        
        # Determine media type based on extension
        ext = file_path.suffix.lower()
        media_type_map = {
            '.pdf': 'application/pdf',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.doc': 'application/msword',
            '.txt': 'text/plain'
        }
        
        media_type = media_type_map.get(ext, 'application/octet-stream')
        
        logger.info(f"Serving file: {filename} to user {current_user.get('user_id')}")
        
        return FileResponse(
            path=str(file_path),
            media_type=media_type,
            filename=filename
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error downloading file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error downloading file: {str(e)}"
        )