from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    CANDIDATE = "candidate"
    RECRUITER = "recruiter"


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    role: UserRole
    company: Optional[str] = None  # <--- Make sure this exists!