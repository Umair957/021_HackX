from beanie import Document
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

# ===========================
# ENUMS & SHARED HELPERS
# ===========================

class UserRole(str, Enum):
    ADMIN = "admin"
    CANDIDATE = "candidate"
    RECRUITER = "recruiter"

class OTPModel(BaseModel):
    code: str
    expires_at: datetime

# ===========================
# DATABASE MODEL (Beanie)
# ===========================

class User(Document):
    email: EmailStr 
    password: Optional[str] = None
    first_name: str
    last_name: str
    token: Optional[str] = None
    company: Optional[str] = None
    role: UserRole
    
    otp: OTPModel = Field(default_factory=lambda: OTPModel(code="", expires_at=datetime.utcnow()))
    
    is_verified: bool = False 
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
