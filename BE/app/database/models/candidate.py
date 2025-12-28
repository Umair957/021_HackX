from beanie import Document, Link
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date
from enum import Enum
from app.database.models.common import Location, SocialUrls, DateRange


class WorkExperience(BaseModel):
    id: Optional[str] = None
    title: str
    company: str
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    currently_working: bool = False
    dates: Optional[DateRange] = None  # Legacy field for compatibility
    description: Optional[str] = None
    achievements: List[str] = Field(default_factory=list)

class Education(BaseModel):
    id: Optional[str] = None
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    currently_studying: bool = False
    graduation_year: Optional[int] = None  # Legacy field for compatibility
    grade: Optional[str] = None
    gpa: Optional[float] = None
    description: Optional[str] = None

class Language(BaseModel):
    name: str
    level: str # e.g. "Native", "B2", "Professional"

class Certification(BaseModel):
    name: str
    issuer: str
    date: datetime

class Project(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)
    url: Optional[str] = None
    github_url: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    currently_working: bool = False
    dates: Optional[DateRange] = None  # Legacy field for compatibility

class Preferences(BaseModel):
    desired_titles: List[str] = Field(default_factory=list)
    desired_positions: List[str] = Field(default_factory=list)
    preferred_locations: List[str] = Field(default_factory=list)
    target_industries: List[str] = Field(default_factory=list)
    work_mode: Optional[str] = None  # "remote", "hybrid", "onsite"
    remote_preference: Optional[str] = None
    job_type: List[str] = Field(default_factory=list)  # Full-time, Part-time, Contract
    min_salary: Optional[int] = None
    expected_salary_min: Optional[int] = None
    max_salary: Optional[int] = None
    expected_salary_max: Optional[int] = None
    currency: str = "USD"
    available_from: Optional[date] = None
    relocation: bool = False
    willing_to_relocate: bool = False

# --- THE MAIN CANDIDATE DOCUMENT ---
class CandidateProfile(Document):
    user_id: str  # Link back to User Auth ID
    
    # Personal Info
    full_name: str
    email: Optional[str] = None
    headline: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[Location] = None
    summary: Optional[str] = None
    photo_url: Optional[str] = None
    urls: SocialUrls = Field(default_factory=SocialUrls)

    # Detailed Records
    work_experience: List[WorkExperience] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    
    # Skills
    technical_skills: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)
    languages: List[Language] = Field(default_factory=list)
    certifications: List[Certification] = Field(default_factory=list)

    # Portfolio
    projects: List[Project] = Field(default_factory=list)
    
    # AI Matching Data
    preferences: Optional[Preferences] = Field(default_factory=Preferences)

    # Profile completeness tracking
    profile_completeness: int = Field(default=0, ge=0, le=100)

    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "candidateprofile"
