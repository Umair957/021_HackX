from datetime import datetime
from typing import List, Optional
from beanie import Document
from pydantic import Field


class TemplateSection(Document):
    """Template section configuration"""
    name: str
    type: str  # header, contact, summary, experience, education, skills, projects
    order: int
    visible: bool = True
    settings: dict = {}


class ResumeTemplate(Document):
    """Resume template model"""
    name: str
    description: str
    thumbnail_url: Optional[str] = None
    preview_url: Optional[str] = None
    category: str  # modern, classic, creative, minimal, professional
    
    # Styling
    primary_color: str = "#1e40af"
    secondary_color: str = "#64748b"
    font_family: str = "Inter, sans-serif"
    font_size: str = "14px"
    
    # Layout
    layout_type: str  # single-column, two-column, three-column
    spacing: str = "normal"  # compact, normal, relaxed
    
    # Sections configuration
    sections: List[dict] = Field(default_factory=list)
    
    # Metadata
    is_premium: bool = False
    is_ats_friendly: bool = True
    tags: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "resume_templates"
        indexes = ["category", "is_premium", "tags"]
