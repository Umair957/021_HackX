from beanie import Document, Link
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# These are small reusable chunks of data

class Location(BaseModel):
    city: str
    country: Optional[str] = None

class SocialUrls(BaseModel):
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    twitter: Optional[str] = None

class DateRange(BaseModel):
    start_date: datetime
    end_date: Optional[datetime] = None # None means "Present"
    is_current: bool = False
