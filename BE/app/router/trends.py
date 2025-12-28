from fastapi import APIRouter, Depends
from datetime import datetime
from app.schema.trends import TrendsResponse
from app.services.trends_service import TrendsService
from app.core.security import get_current_user
from app.database.models.user import User

router = APIRouter()
trends_service = TrendsService()


@router.get("/", response_model=TrendsResponse)
async def get_trends(current_user: User = Depends(get_current_user)):
    """Get current programming language and job role trends"""
    try:
        languages = await trends_service.get_language_trends()
        job_roles = await trends_service.get_job_role_trends()
        
        return TrendsResponse(
            languages=languages,
            job_roles=job_roles,
            last_updated=datetime.utcnow(),
            data_source="Aggregated from GitHub, Stack Overflow, and Job Markets"
        )
    except Exception as e:
        return TrendsResponse(
            languages=[],
            job_roles=[],
            last_updated=datetime.utcnow(),
            data_source=f"Error: {str(e)}"
        )


@router.get("/languages")
async def get_language_trends(current_user: User = Depends(get_current_user)):
    """Get only programming language trends"""
    try:
        languages = await trends_service.get_language_trends()
        return {"languages": languages, "last_updated": datetime.utcnow()}
    except Exception as e:
        return {"error": str(e), "languages": []}


@router.get("/jobs")
async def get_job_trends(current_user: User = Depends(get_current_user)):
    """Get only job role trends"""
    try:
        job_roles = await trends_service.get_job_role_trends()
        return {"job_roles": job_roles, "last_updated": datetime.utcnow()}
    except Exception as e:
        return {"error": str(e), "job_roles": []}
