from fastapi import APIRouter, Depends, HTTPException, Body
from app.core.security import get_current_user
from app.database.models.job import Job
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter()

class CreateJobRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    location: Optional[str] = None
    type: str = "Full-time"
    status: str = "draft"

@router.get("", status_code=200)
async def get_jobs(current_user: dict = Depends(get_current_user)):
    """Get all jobs for the recruiter"""
    try:
        recruiter_id = current_user.get("user_id")
        
        jobs = await Job.find(Job.recruiter_id == recruiter_id).sort("-created_at").to_list()
        
        return {
            "status": "success",
            "message": "Jobs retrieved successfully",
            "data": [
                {
                    "id": str(job.id),
                    "title": job.title,
                    "description": job.description,
                    "location": job.location.city if job.location else None,
                    "type": job.type,
                    "status": job.status,
                    "created_at": job.created_at.isoformat(),
                }
                for job in jobs
            ]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to fetch jobs: {str(e)}",
            "data": None
        }


@router.post("", status_code=201)
async def create_job(
    job_data: CreateJobRequest,
    current_user: dict = Depends(get_current_user)
):
    """Create a new job posting"""
    try:
        recruiter_id = current_user.get("user_id")
        print(f"Creating job for recruiter: {recruiter_id}")
        print(f"Job data: {job_data}")
        
        new_job = Job(
            recruiter_id=recruiter_id,
            company_id="",  # Will be linked to recruiter's company
            title=job_data.title,
            description=job_data.description or "",
            type=job_data.type,
            status=job_data.status,
            candidates_count=0
        )
        
        if job_data.location:
            from app.database.models.common import Location
            new_job.location = Location(city=job_data.location)
        
        result = await new_job.insert()
        print(f"Job inserted: {result}")
        
        return {
            "status": "success",
            "message": "Job created successfully",
            "data": {
                "id": str(new_job.id),
                "title": new_job.title,
                "description": new_job.description,
                "location": new_job.location.city if new_job.location else None,
                "type": new_job.type,
                "status": new_job.status,
                "created_at": new_job.created_at.isoformat(),
            }
        }
    except Exception as e:
        import traceback
        error_msg = str(e) or traceback.format_exc()
        print(f"Job creation error: {error_msg}")
        return {
            "status": "error",
            "message": f"Failed to create job: {error_msg}",
            "data": None
        }


@router.get("/{job_id}", status_code=200)
async def get_job(job_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific job by ID"""
    try:
        from bson import ObjectId
        
        job = await Job.get(ObjectId(job_id))
        
        if not job or job.recruiter_id != current_user.get("user_id"):
            raise HTTPException(status_code=404, detail="Job not found")
        
        return {
            "status": "success",
            "message": "Job retrieved successfully",
            "data": {
                "id": str(job.id),
                "title": job.title,
                "description": job.description,
                "location": job.location.city if job.location else None,
                "type": job.type,
                "status": job.status,
                "created_at": job.created_at.isoformat(),
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to fetch job: {str(e)}",
            "data": None
        }


@router.put("/{job_id}", status_code=200)
async def update_job(
    job_id: str,
    job_data: CreateJobRequest,
    current_user: dict = Depends(get_current_user)
):
    """Update an existing job"""
    try:
        from bson import ObjectId
        print(f"Updating job {job_id} for recruiter: {current_user.get('user_id')}")
        
        job = await Job.get(ObjectId(job_id))
        
        if not job or job.recruiter_id != current_user.get("user_id"):
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Update fields
        job.title = job_data.title
        job.description = job_data.description or ""
        job.type = job_data.type
        job.status = job_data.status
        
        if job_data.location:
            from app.database.models.common import Location
            job.location = Location(city=job_data.location)
        
        await job.save()
        print(f"Job updated successfully: {job.id}")
        
        return {
            "status": "success",
            "message": "Job updated successfully",
            "data": {
                "id": str(job.id),
                "title": job.title,
                "description": job.description,
                "location": job.location.city if job.location else None,
                "type": job.type,
                "status": job.status,
                "created_at": job.created_at.isoformat(),
            }
        }
    except Exception as e:
        import traceback
        error_msg = str(e) or traceback.format_exc()
        print(f"Job update error: {error_msg}")
        return {
            "status": "error",
            "message": f"Failed to update job: {error_msg}",
            "data": None
        }


@router.delete("/{job_id}", status_code=200)
async def delete_job(job_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a job posting"""
    try:
        from bson import ObjectId
        print(f"Deleting job {job_id} for recruiter: {current_user.get('user_id')}")
        
        job = await Job.get(ObjectId(job_id))
        
        if not job or job.recruiter_id != current_user.get("user_id"):
            raise HTTPException(status_code=404, detail="Job not found")
        
        await job.delete()
        print(f"Job deleted successfully: {job.id}")
        
        return {
            "status": "success",
            "message": "Job deleted successfully",
            "data": None
        }
    except Exception as e:
        import traceback
        error_msg = str(e) or traceback.format_exc()
        print(f"Job deletion error: {error_msg}")
        return {
            "status": "error",
            "message": f"Failed to delete job: {error_msg}",
            "data": None
        }
