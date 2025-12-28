from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import secrets

from app.core.security import get_current_recruiter
from app.database.models.gmail_integration import GmailIntegration
from app.database.models.job import Job
from app.services.gmail_service import gmail_service
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()


class GmailConnectRequest(BaseModel):
    """Request to initiate Gmail OAuth connection"""
    pass


class GmailConfigUpdate(BaseModel):
    """Update Gmail scanning configuration"""
    scan_schedule: Optional[str] = Field(None, description="hourly, daily, weekly")
    scan_time: Optional[str] = Field(None, description="HH:MM format")
    is_active: Optional[bool] = None
    job_ids: Optional[List[str]] = None
    keywords: Optional[List[str]] = None
    send_notifications: Optional[bool] = None
    notification_email: Optional[str] = None


class ScanNowRequest(BaseModel):
    """Request to trigger manual scan"""
    job_ids: Optional[List[str]] = None


@router.get("/status")
async def get_gmail_status(recruiter_id: str = Depends(get_current_recruiter)):
    """Get Gmail integration status for current recruiter"""
    try:
        integration = await GmailIntegration.find_one(
            GmailIntegration.recruiter_id == recruiter_id
        )
        
        if not integration:
            return {
                "status": "success",
                "data": {
                    "connected": False,
                    "email": None,
                    "is_active": False
                }
            }
        
        return {
            "status": "success",
            "data": {
                "connected": True,
                "email": integration.email,
                "is_active": integration.is_active,
                "scan_schedule": integration.scan_schedule,
                "scan_time": integration.scan_time,
                "job_ids": integration.job_ids,
                "keywords": integration.keywords,
                "last_scan_at": integration.last_scan_at.isoformat() if integration.last_scan_at else None,
                "last_scan_status": integration.last_scan_status,
                "last_scan_count": integration.last_scan_count,
                "send_notifications": integration.send_notifications,
                "notification_email": integration.notification_email
            }
        }
    except Exception as e:
        logger.error(f"Error fetching Gmail status: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/connect")
async def initiate_gmail_connection(recruiter_id: str = Depends(get_current_recruiter)):
    """Initiate Gmail OAuth flow"""
    try:
        # Generate state token for security
        state = secrets.token_urlsafe(32)
        
        # Store state in session (you may want to use Redis for production)
        # For now, we'll encode recruiter_id in state
        state_with_recruiter = f"{state}:{recruiter_id}"
        
        # Get OAuth URL
        auth_url = gmail_service.get_oauth_url(state_with_recruiter)
        
        return {
            "status": "success",
            "data": {
                "auth_url": auth_url,
                "state": state_with_recruiter
            }
        }
    except Exception as e:
        logger.error(f"Error initiating Gmail connection: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/callback")
async def gmail_oauth_callback(code: str, state: str):
    """Handle OAuth callback from Google"""
    try:
        # Extract recruiter_id from state
        if ':' not in state:
            raise HTTPException(status_code=400, detail="Invalid state parameter")
        
        _, recruiter_id = state.rsplit(':', 1)
        
        # Exchange code for tokens
        token_data = gmail_service.exchange_code_for_tokens(code)
        
        # Check if integration already exists
        existing = await GmailIntegration.find_one(
            GmailIntegration.recruiter_id == recruiter_id
        )
        
        if existing:
            # Update existing integration
            existing.email = token_data["email"]
            existing.access_token = token_data["access_token"]
            existing.refresh_token = token_data["refresh_token"]
            existing.token_expiry = token_data["token_expiry"]
            existing.is_active = True
            existing.updated_at = datetime.utcnow()
            await existing.save()
            integration = existing
        else:
            # Create new integration
            integration = GmailIntegration(
                recruiter_id=recruiter_id,
                email=token_data["email"],
                access_token=token_data["access_token"],
                refresh_token=token_data["refresh_token"],
                token_expiry=token_data["token_expiry"],
                is_active=True
            )
            await integration.insert()
        
        logger.info(f"Gmail connected successfully for recruiter {recruiter_id}")
        
        return {
            "status": "success",
            "message": "Gmail connected successfully",
            "data": {
                "email": integration.email,
                "connected": True
            }
        }
    except Exception as e:
        logger.error(f"Error in OAuth callback: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/disconnect")
async def disconnect_gmail(recruiter_id: str = Depends(get_current_recruiter)):
    """Disconnect Gmail integration"""
    try:
        integration = await GmailIntegration.find_one(
            GmailIntegration.recruiter_id == recruiter_id
        )
        
        if not integration:
            raise HTTPException(status_code=404, detail="No Gmail integration found")
        
        # Delete the integration
        await integration.delete()
        
        return {
            "status": "success",
            "message": "Gmail disconnected successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error disconnecting Gmail: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/config")
async def update_gmail_config(
    config: GmailConfigUpdate,
    recruiter_id: str = Depends(get_current_recruiter)
):
    """Update Gmail scanning configuration"""
    try:
        integration = await GmailIntegration.find_one(
            GmailIntegration.recruiter_id == recruiter_id
        )
        
        if not integration:
            raise HTTPException(status_code=404, detail="No Gmail integration found")
        
        # Update fields
        update_data = config.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(integration, field, value)
        
        integration.updated_at = datetime.utcnow()
        await integration.save()
        
        return {
            "status": "success",
            "message": "Configuration updated successfully",
            "data": {
                "scan_schedule": integration.scan_schedule,
                "scan_time": integration.scan_time,
                "is_active": integration.is_active,
                "job_ids": integration.job_ids,
                "keywords": integration.keywords
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating config: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/scan-now")
async def trigger_manual_scan(
    background_tasks: BackgroundTasks,
    request: ScanNowRequest,
    recruiter_id: str = Depends(get_current_recruiter)
):
    """Trigger immediate email scan"""
    try:
        integration = await GmailIntegration.find_one(
            GmailIntegration.recruiter_id == recruiter_id
        )
        
        if not integration:
            raise HTTPException(status_code=404, detail="No Gmail integration found")
        
        if not integration.refresh_token:
            raise HTTPException(status_code=400, detail="No refresh token available. Please reconnect Gmail.")
        
        # Import scan function to avoid circular imports
        from app.services.scanner_service import perform_email_scan
        
        # Trigger scan in background
        job_ids = request.job_ids if request.job_ids else integration.job_ids
        background_tasks.add_task(
            perform_email_scan,
            integration_id=str(integration.id),
            job_ids=job_ids
        )
        
        return {
            "status": "success",
            "message": "Scan initiated. You will receive an email notification when complete.",
            "data": {
                "scan_initiated_at": datetime.utcnow().isoformat()
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error triggering scan: {e}")
        raise HTTPException(status_code=500, detail=str(e))
