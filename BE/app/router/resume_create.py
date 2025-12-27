from fastapi import FastAPI, Depends, HTTPException, status, APIRouter, Response
from app.core.security import get_current_user
from pydantic import EmailStr

router = APIRouter()
from app.database.models.candidate import CandidateProfile

@router.post("/resume-create", status_code=status.HTTP_201_CREATED, response_model=CandidateProfile)
async def create_resume(
    candidate_data: CandidateProfile,
    current_user: dict = Depends(get_current_user)
):
    # Ensure the current user is a candidate
    if current_user.get("role") != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can create resumes."
        )

    # Link the resume to the current user's ID
    candidate_data.user_id = current_user.get("user_id")

    # Save the candidate profile to the database
    await candidate_data.insert()

    return candidate_data