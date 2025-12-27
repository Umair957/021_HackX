from beanie import Document, Link
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from app.database.models.common import Location, SocialUrls, DateRange


class WorkExperience(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    dates: DateRange
    description: Optional[str] = None # Raw text or markdown

class Education(BaseModel):
    institution: str
    degree: str
    field_of_study: str
    graduation_year: int
    gpa: Optional[float] = None

class Language(BaseModel):
    name: str
    level: str # e.g. "Native", "B2", "Professional"

class Certification(BaseModel):
    name: str
    issuer: str
    date: datetime

class Project(BaseModel):
    name: str
    description: Optional[str] = None
    technologies: List[str] = []
    url: Optional[str] = None
    dates: Optional[DateRange] = None

class Preferences(BaseModel):
    desired_titles: List[str] = []
    target_industries: List[str] = []
    work_mode: Optional[str] = None # "remote", "hybrid", "onsite"
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    currency: str = "PKR"
    relocation: bool = False

# --- THE MAIN CANDIDATE DOCUMENT ---
class CandidateProfile(Document):
    user_id: str  # Link back to User Auth ID
    
    # Personal Info
    full_name: str
    headline: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[Location] = None
    summary: Optional[str] = None
    urls: SocialUrls = Field(default_factory=SocialUrls)

    # Detailed Records
    work_experience: List[WorkExperience] = []
    education: List[Education] = []
    
    # Skills
    technical_skills: List[str] = []
    soft_skills: List[str] = []
    languages: List[Language] = []
    certifications: List[Certification] = []

    # Portfolio
    projects: List[Project] = []
    
    # AI Matching Data
    preferences: Optional[Preferences] = Field(default_factory=Preferences)

    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "candidateprofile"
