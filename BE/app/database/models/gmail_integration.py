from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field


class GmailIntegration(Document):
    """Gmail integration configuration for recruiters"""
    
    recruiter_id: str = Field(..., description="Recruiter user ID")
    email: str = Field(..., description="Connected Gmail address")
    
    # OAuth tokens (encrypted in production)
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_expiry: Optional[datetime] = None
    
    # Scanning configuration
    scan_schedule: str = Field(default="daily", description="Frequency: hourly, daily, weekly")
    scan_time: str = Field(default="09:00", description="Time for daily scans (HH:MM)")
    is_active: bool = Field(default=True, description="Whether scanning is enabled")
    
    # Job filtering
    job_ids: list[str] = Field(default_factory=list, description="Specific jobs to scan for (empty = all jobs)")
    keywords: list[str] = Field(default_factory=list, description="Additional keywords to filter emails")
    
    # Scanning state
    last_scan_at: Optional[datetime] = None
    last_scan_status: Optional[str] = None  # success, error
    last_scan_count: int = Field(default=0, description="Number of CVs processed in last scan")
    last_error: Optional[str] = None
    
    # Email notification settings
    send_notifications: bool = Field(default=True, description="Send email after analysis")
    notification_email: Optional[str] = None  # Override email for notifications
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "gmail_integrations"
        indexes = [
            "recruiter_id",
            "email",
            "is_active",
        ]
    
    class Config:
        json_schema_extra = {
            "example": {
                "recruiter_id": "507f1f77bcf86cd799439011",
                "email": "recruiter@example.com",
                "scan_schedule": "daily",
                "scan_time": "09:00",
                "is_active": True,
                "send_notifications": True
            }
        }
