from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, List
from datetime import datetime
import uuid

from app.core.security import get_current_user
from app.database.models.candidate import CandidateProfile, WorkExperience, Education, Project, Preferences
from app.schema.profile import (
    ProfileUpdateRequest,
    ProfileResponse,
    ProfileCompletenessResponse,
    PersonalInfo,
    SocialLinks,
    Skills,
    JobPreferences
)

router = APIRouter()


def calculate_profile_completeness(profile: CandidateProfile) -> Dict:
    """Calculate profile completion percentage and missing sections"""
    sections = {
        "personal_info": 15,  # Name, email, phone, location, title, bio
        "social_links": 10,   # LinkedIn, GitHub, portfolio
        "education": 20,      # At least one education entry
        "work_experience": 25,  # At least one work experience
        "skills": 15,         # Technical, soft skills, tools
        "projects": 10,       # At least one project
        "job_preferences": 5  # Basic job preferences
    }
    
    score = 0
    completed = []
    missing = []
    
    # Personal info (15 points)
    personal_fields = [
        profile.full_name,
        profile.email,
        profile.phone,
        profile.location,
        (profile.title or profile.headline),
        (profile.bio or profile.summary)
    ]
    personal_filled = sum(1 for field in personal_fields if field)
    if personal_filled >= 4:  # At least 4 out of 6 fields
        score += sections["personal_info"]
        completed.append("personal_info")
    else:
        missing.append("personal_info")
    
    # Social links (10 points)
    social_filled = sum(1 for link in [
        profile.urls.linkedin,
        profile.urls.github,
        profile.urls.portfolio
    ] if link)
    if social_filled >= 2:  # At least 2 social links
        score += sections["social_links"]
        completed.append("social_links")
    else:
        missing.append("social_links")
    
    # Education (20 points)
    if len(profile.education) > 0:
        score += sections["education"]
        completed.append("education")
    else:
        missing.append("education")
    
    # Work experience (25 points)
    if len(profile.work_experience) > 0:
        score += sections["work_experience"]
        completed.append("work_experience")
    else:
        missing.append("work_experience")
    
    # Skills (15 points)
    total_skills = len(profile.technical_skills) + len(profile.soft_skills) + len(profile.tools)
    if total_skills >= 5:  # At least 5 skills
        score += sections["skills"]
        completed.append("skills")
    else:
        missing.append("skills")
    
    # Projects (10 points)
    if len(profile.projects) > 0:
        score += sections["projects"]
        completed.append("projects")
    else:
        missing.append("projects")
    
    # Job preferences (5 points)
    if profile.preferences and len(profile.preferences.desired_positions or profile.preferences.desired_titles or []) > 0:
        score += sections["job_preferences"]
        completed.append("job_preferences")
    else:
        missing.append("job_preferences")
    
    return {
        "completeness": min(score, 100),
        "completed_sections": completed,
        "missing_sections": missing
    }


@router.get("/", response_model=ProfileResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get candidate profile"""
    user_id = current_user.get("user_id")
    
    # Find or create profile
    profile = await CandidateProfile.find_one(CandidateProfile.user_id == user_id)
    
    if not profile:
        # Create default profile
        profile = CandidateProfile(
            user_id=user_id,
            full_name=current_user.get("email", "").split("@")[0],  # Default name from email
            email=current_user.get("email")
        )
        await profile.save()
    
    # Calculate completeness
    completeness_data = calculate_profile_completeness(profile)
    profile.profile_completeness = completeness_data["completeness"]
    await profile.save()
    
    # Map to response model
    return ProfileResponse(
        personal_info=PersonalInfo(
            full_name=profile.full_name,
            email=profile.email or current_user.get("email") or None,
            phone=profile.phone,
            location=str(profile.location) if profile.location else None,
            title=profile.title or profile.headline,
            bio=profile.bio or profile.summary,
            photo_url=profile.photo_url
        ) if profile.full_name else None,
        social_links=SocialLinks(
            linkedin=profile.urls.linkedin,
            github=profile.urls.github,
            portfolio=profile.urls.portfolio,
            twitter=profile.urls.twitter,
            website=profile.urls.website
        ),
        education=profile.education,
        work_experience=profile.work_experience,
        skills=Skills(
            technical=profile.technical_skills,
            soft=profile.soft_skills,
            tools=profile.tools
        ),
        projects=profile.projects,
        job_preferences=JobPreferences(
            desired_positions=profile.preferences.desired_positions or profile.preferences.desired_titles or [],
            preferred_locations=profile.preferences.preferred_locations,
            remote_preference=profile.preferences.remote_preference or profile.preferences.work_mode,
            job_type=profile.preferences.job_type,
            expected_salary_min=profile.preferences.expected_salary_min or profile.preferences.min_salary,
            expected_salary_max=profile.preferences.expected_salary_max or profile.preferences.max_salary,
            currency=profile.preferences.currency,
            available_from=profile.preferences.available_from,
            willing_to_relocate=profile.preferences.willing_to_relocate or profile.preferences.relocation
        ) if profile.preferences else None,
        profile_completeness=profile.profile_completeness
    )


@router.put("/", response_model=ProfileResponse)
async def update_profile(
    profile_data: ProfileUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    """Update candidate profile"""
    user_id = current_user.get("user_id")
    
    # Find or create profile
    profile = await CandidateProfile.find_one(CandidateProfile.user_id == user_id)
    
    if not profile:
        profile = CandidateProfile(
            user_id=user_id,
            full_name=current_user.get("email", "").split("@")[0],
            email=current_user.get("email")
        )
    
    # Update personal info
    if profile_data.personal_info:
        profile.full_name = profile_data.personal_info.full_name
        profile.email = profile_data.personal_info.email
        profile.phone = profile_data.personal_info.phone
        profile.location = profile_data.personal_info.location  # Store as string for now
        profile.title = profile_data.personal_info.title
        profile.headline = profile_data.personal_info.title
        profile.bio = profile_data.personal_info.bio
        profile.summary = profile_data.personal_info.bio
        profile.photo_url = profile_data.personal_info.photo_url
    
    # Update social links
    if profile_data.social_links:
        profile.urls.linkedin = profile_data.social_links.linkedin
        profile.urls.github = profile_data.social_links.github
        profile.urls.portfolio = profile_data.social_links.portfolio
        profile.urls.twitter = profile_data.social_links.twitter
        profile.urls.website = profile_data.social_links.website
    
    # Update education
    if profile_data.education is not None:
        # Assign IDs to new entries
        for edu in profile_data.education:
            if not edu.id:
                edu.id = str(uuid.uuid4())
        profile.education = profile_data.education
    
    # Update work experience
    if profile_data.work_experience is not None:
        # Assign IDs to new entries
        for exp in profile_data.work_experience:
            if not exp.id:
                exp.id = str(uuid.uuid4())
        profile.work_experience = profile_data.work_experience
    
    # Update skills
    if profile_data.skills:
        profile.technical_skills = profile_data.skills.technical
        profile.soft_skills = profile_data.skills.soft
        profile.tools = profile_data.skills.tools
    
    # Update projects
    if profile_data.projects is not None:
        # Assign IDs to new entries
        for proj in profile_data.projects:
            if not proj.id:
                proj.id = str(uuid.uuid4())
        profile.projects = profile_data.projects
    
    # Update job preferences
    if profile_data.job_preferences:
        if not profile.preferences:
            profile.preferences = Preferences()
        profile.preferences.desired_positions = profile_data.job_preferences.desired_positions
        profile.preferences.desired_titles = profile_data.job_preferences.desired_positions
        profile.preferences.preferred_locations = profile_data.job_preferences.preferred_locations
        profile.preferences.remote_preference = profile_data.job_preferences.remote_preference
        profile.preferences.work_mode = profile_data.job_preferences.remote_preference
        profile.preferences.job_type = profile_data.job_preferences.job_type
        profile.preferences.expected_salary_min = profile_data.job_preferences.expected_salary_min
        profile.preferences.min_salary = profile_data.job_preferences.expected_salary_min
        profile.preferences.expected_salary_max = profile_data.job_preferences.expected_salary_max
        profile.preferences.max_salary = profile_data.job_preferences.expected_salary_max
        profile.preferences.currency = profile_data.job_preferences.currency or "USD"
        profile.preferences.available_from = profile_data.job_preferences.available_from
        profile.preferences.willing_to_relocate = profile_data.job_preferences.willing_to_relocate
        profile.preferences.relocation = profile_data.job_preferences.willing_to_relocate
    
    # Update timestamp
    profile.updated_at = datetime.utcnow()
    
    # Calculate and update completeness
    completeness_data = calculate_profile_completeness(profile)
    profile.profile_completeness = completeness_data["completeness"]
    
    # Save
    await profile.save()
    
    # Return updated profile
    return ProfileResponse(
        personal_info=PersonalInfo(
            full_name=profile.full_name,
            email=profile.email or current_user.get("email", ""),
            phone=profile.phone,
            location=str(profile.location) if profile.location else None,
            title=profile.title or profile.headline,
            bio=profile.bio or profile.summary,
            photo_url=profile.photo_url
        ),
        social_links=SocialLinks(
            linkedin=profile.urls.linkedin,
            github=profile.urls.github,
            portfolio=profile.urls.portfolio,
            twitter=profile.urls.twitter,
            website=profile.urls.website
        ),
        education=profile.education,
        work_experience=profile.work_experience,
        skills=Skills(
            technical=profile.technical_skills,
            soft=profile.soft_skills,
            tools=profile.tools
        ),
        projects=profile.projects,
        job_preferences=JobPreferences(
            desired_positions=profile.preferences.desired_positions or profile.preferences.desired_titles or [],
            preferred_locations=profile.preferences.preferred_locations,
            remote_preference=profile.preferences.remote_preference or profile.preferences.work_mode,
            job_type=profile.preferences.job_type,
            expected_salary_min=profile.preferences.expected_salary_min or profile.preferences.min_salary,
            expected_salary_max=profile.preferences.expected_salary_max or profile.preferences.max_salary,
            currency=profile.preferences.currency,
            available_from=profile.preferences.available_from,
            willing_to_relocate=profile.preferences.willing_to_relocate or profile.preferences.relocation
        ) if profile.preferences else None,
        profile_completeness=profile.profile_completeness
    )


@router.get("/completeness", response_model=ProfileCompletenessResponse)
async def get_profile_completeness(current_user: dict = Depends(get_current_user)):
    """Get profile completeness status"""
    user_id = current_user.get("user_id")
    
    profile = await CandidateProfile.find_one(CandidateProfile.user_id == user_id)
    
    if not profile:
        return ProfileCompletenessResponse(
            completeness=0,
            missing_sections=["personal_info", "social_links", "education", "work_experience", "skills", "projects", "job_preferences"],
            completed_sections=[]
        )
    
    completeness_data = calculate_profile_completeness(profile)
    
    return ProfileCompletenessResponse(
        completeness=completeness_data["completeness"],
        missing_sections=completeness_data["missing_sections"],
        completed_sections=completeness_data["completed_sections"]
    )
