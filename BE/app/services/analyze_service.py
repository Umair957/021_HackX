import os
from typing import Dict, List, Optional
from google import genai
from pathlib import Path
from fastapi import HTTPException, status
import json
from app.database.models.resume_analysis import (
    ResumeAnalysis, 
    AnalysisScores, 
    ImprovementSuggestion,
    JobContext
)
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

client = genai.Client(api_key=GEMINI_API_KEY)

class ResumeAnalyzerService:
    """Service for analyzing resumes using Google Gemini AI"""
    
    def __init__(self):
        # Store client reference
        self.client = client
    
    def create_analysis_prompt(self, job_title: Optional[str] = None, job_description: Optional[str] = None) -> str:
        """Create a detailed prompt for Gemini to analyze the resume"""
        
        # Base prompt
        prompt = "You are an expert resume analyzer and career coach. Analyze the provided resume file and provide a comprehensive evaluation.\n\n"
        
        # Add job-specific context if provided
        if job_title or job_description:
            prompt += "**TARGET JOB CONTEXT:**\n"
            if job_title:
                prompt += f"- Target Role: {job_title}\n"
            if job_description:
                prompt += f"- Job Description:\n{job_description}\n\n"
            prompt += "Please analyze the resume specifically against this job role and requirements. "
            prompt += "Focus on how well the candidate's experience, skills, and achievements align with the job requirements.\n\n"
        
        prompt += """Please analyze this resume and provide your response in the following JSON format:

{
  "score": <overall score from 0-100>,
  "ats_score": <ATS compatibility score from 0-100>,
  "readability_score": <readability score from 0-100>,
  "keyword_match": <keyword match percentage from 0-100>,
  "strengths": [
    "strength 1",
    "strength 2",
    "strength 3",
    "strength 4"
  ],
  "weaknesses": [
    "weakness 1",
    "weakness 2",
    "weakness 3",
    "weakness 4"
  ],
  "suggestions": [
    {
      "category": "category name",
      "issue": "specific issue",
      "fix": "actionable recommendation",
      "priority": "high|medium|low"
    }
  ]
}

Evaluation Criteria:
1. **Overall Score**: Comprehensive assessment of resume quality (0-100)"""
        
        if job_title or job_description:
            prompt += "\n   - Consider alignment with target job requirements"
        
        prompt += """
2. **ATS Score**: How well the resume will pass Applicant Tracking Systems"""
        
        if job_description:
            prompt += "\n   - Check for keywords from job description"
        
        prompt += """
3. **Readability Score**: How easy it is to read and scan
4. **Keyword Match**: Presence of relevant industry keywords"""
        
        if job_description:
            prompt += "\n   - Match keywords specifically from the provided job description"
        
        prompt += """

Please provide:
- At least 4 strengths (things done well)"""
        
        if job_title:
            prompt += f"\n  - Highlight strengths relevant to {job_title} role"
        
        prompt += """
- At least 4 weaknesses (areas for improvement)"""
        
        if job_description:
            prompt += "\n  - Point out missing skills or experiences from job requirements"
        
        prompt += """
- At least 5 specific, actionable suggestions with priority levels"""
        
        if job_description:
            prompt += "\n  - Prioritize suggestions that improve job description alignment"
        
        prompt += """
- Be specific and provide actionable feedback
- Focus on content, formatting, ATS compatibility, and impact

Return ONLY the JSON object, no additional text or markdown formatting.
"""
        return prompt
    
    async def analyze_resume(
        self, 
        file_path: str, 
        user_id: str,
        file_name: str,
        file_size: int,
        file_type: str,
        job_title: Optional[str] = None, 
        job_description: Optional[str] = None
    ) -> Dict:
        """
        Main method to analyze a resume file using Gemini AI and save results to database
        
        Args:
            file_path: Path to the resume file
            user_id: ID of the user who owns the resume
            file_name: Original filename
            file_size: File size in bytes
            file_type: MIME type of the file
            job_title: Optional target job title
            job_description: Optional job description for targeted analysis
            
        Returns:
            Dictionary containing analysis results
        """
        uploaded_file = None
        try:
            # 1. Validate file exists
            if not os.path.exists(file_path):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"File not found: {file_path}"
                )
            
            # 2. Upload file to Gemini
            logger.info(f"Uploading file to Gemini: {Path(file_path).name}")
            if job_title:
                logger.info(f"Target Job Title provided: {job_title[:30]}...")
            if job_description:
                logger.info(f"Job Description provided: {len(job_description)} characters")
            
            uploaded_file = self.client.files.upload(file=file_path)
            logger.info(f"File uploaded successfully to Gemini")
            
            # 3. Create analysis prompt with job context
            prompt = self.create_analysis_prompt(job_title, job_description)
            
            # 4. Send to Gemini for analysis with the uploaded file
            logger.info("Sending file to Gemini for analysis...")
            response = self.client.models.generate_content(
                model='gemini-2.0-flash-exp',
                contents=[
                    prompt,
                    uploaded_file
                ]
            )
            
            # 5. Parse the response
            result_text = response.text.strip()
            logger.info("Received response from Gemini")
            
            # Remove markdown code blocks if present
            if result_text.startswith("```json"):
                result_text = result_text[7:]
            if result_text.startswith("```"):
                result_text = result_text[3:]
            if result_text.endswith("```"):
                result_text = result_text[:-3]
            
            result_text = result_text.strip()
            
            # 6. Parse JSON response
            analysis_result = json.loads(result_text)
            
            # 7. Validate the structure
            required_keys = ["score", "ats_score", "readability_score", "keyword_match", 
                           "strengths", "weaknesses", "suggestions"]
            
            for key in required_keys:
                if key not in analysis_result:
                    raise ValueError(f"Missing required key: {key}")
            
            # 8. Save to database
            await self._save_to_database(
                user_id=user_id,
                file_name=file_name,
                file_size=file_size,
                file_type=file_type,
                job_title=job_title,
                job_description=job_description,
                analysis_result=analysis_result,
                raw_response=result_text
            )
            
            return analysis_result
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {str(e)}")
            logger.debug(f"Response text length: {len(result_text) if 'result_text' in locals() else 0}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to parse AI response: {str(e)}"
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error analyzing resume: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error analyzing resume: {str(e)}"
            )
        finally:
            # Clean up uploaded file from Gemini if it exists
            if uploaded_file:
                try:
                    self.client.files.delete(name=uploaded_file.name)
                    logger.info("Deleted uploaded file from Gemini")
                except Exception as e:
                    logger.warning(f"Failed to delete file from Gemini: {str(e)}")
    
    async def _save_to_database(
        self,
        user_id: str,
        file_name: str,
        file_size: int,
        file_type: str,
        job_title: Optional[str],
        job_description: Optional[str],
        analysis_result: Dict,
        raw_response: str
    ) -> None:
        """
        Save analysis results to MongoDB
        
        Args:
            user_id: ID of the user
            file_name: Original filename
            file_size: File size in bytes
            file_type: MIME type
            job_title: Optional job title
            job_description: Optional job description
            analysis_result: Parsed AI analysis result
            raw_response: Raw JSON string from AI
        """
        try:
            # Create JobContext if job details provided
            job_context = None
            if job_title or job_description:
                job_context = JobContext(
                    job_title=job_title,
                    job_description=job_description
                )
            
            # Create AnalysisScores
            scores = AnalysisScores(
                overall_score=float(analysis_result["score"]),
                formatting_score=float(analysis_result["readability_score"]),
                content_quality_score=float(analysis_result["score"]),  # Using overall score
                keyword_optimization_score=float(analysis_result["keyword_match"]),
                ats_compatibility_score=float(analysis_result["ats_score"])
            )
            
            # Convert suggestions to ImprovementSuggestion objects
            suggestions = [
                ImprovementSuggestion(
                    category=s.get("category", "general"),
                    suggestion=f"{s.get('issue', '')}: {s.get('fix', '')}",
                    priority=s.get("priority", "medium")
                )
                for s in analysis_result.get("suggestions", [])
            ]
            
            # Create ResumeAnalysis document
            resume_analysis = ResumeAnalysis(
                user_id=user_id,
                file_name=file_name,
                file_size=file_size,
                file_type=file_type,
                job_context=job_context,
                scores=scores,
                strengths=analysis_result.get("strengths", []),
                weaknesses=analysis_result.get("weaknesses", []),
                improvement_suggestions=suggestions,
                raw_analysis=raw_response
            )
            
            # Save to database
            await resume_analysis.insert()
            logger.info("Successfully saved analysis to database")
            
        except Exception as e:
            # Log error but don't fail the request
            logger.error(f"Error saving to database: {str(e)}")
            # We don't raise exception here because the analysis was successful
            # Database save is supplementary
    
    @staticmethod
    async def cleanup_temp_file(file_path: str) -> None:
        """Delete temporary file after analysis"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info("Temporary file cleaned up")
        except Exception as e:
            logger.warning(f"Failed to cleanup temp file: {str(e)}")
