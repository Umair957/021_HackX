from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import date


class PersonalInfo(BaseModel):
    """Personal information schema"""
    full_name: str = Field(..., min_length=1, max_length=100)
    email: Optional[str] = Field(None, pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")
    phone: Optional[str] = Field(None, max_length=20)
    location: Optional[str] = Field(None, max_length=100)
    title: Optional[str] = Field(None, max_length=100, description="Professional title/headline")
    bio: Optional[str] = Field(None, max_length=500, description="Short bio/summary")
    photo_url: Optional[str] = None


class SocialLinks(BaseModel):
    """Social media and professional links"""
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    twitter: Optional[str] = None
    website: Optional[str] = None


class Education(BaseModel):
    """Education entry"""
    id: Optional[str] = None
    institution: str = Field(..., min_length=1, max_length=200)
    degree: str = Field(..., min_length=1, max_length=100)
    field_of_study: Optional[str] = Field(None, max_length=100)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    currently_studying: bool = False
    grade: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = Field(None, max_length=1000)


class WorkExperience(BaseModel):
    """Work experience entry"""
    id: Optional[str] = None
    company: str = Field(..., min_length=1, max_length=200)
    position: str = Field(..., min_length=1, max_length=100)
    location: Optional[str] = Field(None, max_length=100)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    currently_working: bool = False
    description: Optional[str] = Field(None, max_length=2000)
    achievements: List[str] = Field(default_factory=list)


class Skills(BaseModel):
    """Skills organized by category"""
    technical: List[str] = Field(default_factory=list, description="Programming languages, frameworks, tools")
    soft: List[str] = Field(default_factory=list, description="Communication, leadership, problem-solving")
    tools: List[str] = Field(default_factory=list, description="Software, platforms, applications")


class Project(BaseModel):
    """Project entry"""
    id: Optional[str] = None
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    technologies: List[str] = Field(default_factory=list)
    url: Optional[str] = None
    github_url: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    currently_working: bool = False


class JobPreferences(BaseModel):
    """Job search preferences"""
    desired_positions: List[str] = Field(default_factory=list, description="Job titles interested in")
    preferred_locations: List[str] = Field(default_factory=list)
    remote_preference: Optional[str] = Field(None, description="remote, hybrid, onsite, flexible")
    job_type: List[str] = Field(default_factory=list, description="Full-time, Part-time, Contract")
    expected_salary_min: Optional[int] = None
    expected_salary_max: Optional[int] = None
    currency: Optional[str] = Field(default="USD", max_length=3)
    available_from: Optional[date] = None
    willing_to_relocate: bool = False


class ProfileUpdateRequest(BaseModel):
    """Request schema for profile updates"""
    personal_info: Optional[PersonalInfo] = None
    social_links: Optional[SocialLinks] = None
    education: Optional[List[Education]] = None
    work_experience: Optional[List[WorkExperience]] = None
    skills: Optional[Skills] = None
    projects: Optional[List[Project]] = None
    job_preferences: Optional[JobPreferences] = None


class ProfileResponse(BaseModel):
    """Response schema for profile data"""
    personal_info: Optional[PersonalInfo] = None
    social_links: Optional[SocialLinks] = None
    education: List[Education] = Field(default_factory=list)
    work_experience: List[WorkExperience] = Field(default_factory=list)
    skills: Optional[Skills] = None
    projects: List[Project] = Field(default_factory=list)
    job_preferences: Optional[JobPreferences] = None
    profile_completeness: int = Field(0, ge=0, le=100, description="Profile completion percentage")


class ProfileCompletenessResponse(BaseModel):
    """Response for profile completeness calculation"""
    completeness: int = Field(..., ge=0, le=100)
    missing_sections: List[str] = Field(default_factory=list)
    completed_sections: List[str] = Field(default_factory=list)
