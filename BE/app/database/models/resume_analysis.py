from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ImprovementSuggestion(BaseModel):
    """Individual improvement suggestion for the resume"""
    category: str  # e.g., "formatting", "content", "keywords"
    suggestion: str
    priority: str  # "high", "medium", "low"


class AnalysisScores(BaseModel):
    """Scoring metrics for the resume analysis"""
    overall_score: float = Field(..., ge=0, le=100, description="Overall resume score out of 100")
    formatting_score: float = Field(..., ge=0, le=100)
    content_quality_score: float = Field(..., ge=0, le=100)
    keyword_optimization_score: float = Field(..., ge=0, le=100)
    ats_compatibility_score: float = Field(..., ge=0, le=100)


class JobContext(BaseModel):
    """Job details provided for targeted analysis"""
    job_title: Optional[str] = None
    job_description: Optional[str] = None


class ResumeAnalysis(Document):
    """
    Store complete resume analysis results for user's historical records
    Allows users to view previous CV analysis results
    """
    user_id: str  # Reference to User document ID
    
    # Resume file information
    file_name: str
    file_size: int  # Size in bytes
    file_type: str  # e.g., "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    
    # Job context (optional - if analyzing against specific job)
    job_context: Optional[JobContext] = None
    
    # Analysis results
    scores: AnalysisScores
    
    # Strengths identified
    strengths: List[str] = []
    
    # Weaknesses identified
    weaknesses: List[str] = []
    
    # Improvement suggestions
    improvement_suggestions: List[ImprovementSuggestion] = []
    
    # Raw AI response (optional - for debugging/future reference)
    raw_analysis: Optional[str] = None
    
    # Metadata
    analyzed_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "resume_analyses"
        indexes = [
            "user_id",  # Index for fast user-based queries
            "analyzed_at",  # Index for sorting by date
        ]

