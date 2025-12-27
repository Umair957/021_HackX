from beanie import Document, Link
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from app.database.models.common import Location


class JobType(str, Enum):
    FULL_TIME = "Full-time"
    PART_TIME = "Part-time"
    CONTRACT = "Contract"
    TEMPORARY = "Temporary"
    INTERN = "Internship"
    VOLUNTEER = "Volunteer"
    OTHER = "Other"

class JobStatus(str, Enum):
    OPEN = "open"
    CLOSED = "closed"
    DRAFT = "draft"

class Job(Document):
    company_id: str  # Link back to CompanyProfile
    recruiter_id: str # Link to the specific user who posted it
    
    title: str
    description: str # The raw JD
    
    location: Optional[Location] = None
    salary_range: Optional[str] = None
    type: JobType = JobType.FULL_TIME
    
    status: JobStatus = JobStatus.OPEN
    candidates_count: int = 0
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "jobs"