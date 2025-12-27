from beanie import Document, Link
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from app.database.models.common import Location

class CompanyDetails(BaseModel):
    name: str
    website: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None # "10-50"
    description: Optional[str] = None
    logo_url: Optional[str] = None

class TeamMember(BaseModel):
    user_id: str
    role: str = "member" # "admin" or "member"
    joined_at: datetime = Field(default_factory=datetime.utcnow)

# --- THE MAIN COMPANY DOCUMENT ---
class CompanyProfile(Document):
    owner_user_id: str  # Link back to User Auth ID
    
    details: CompanyDetails
    team_members: List[TeamMember] = []


    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "companyprofile"
