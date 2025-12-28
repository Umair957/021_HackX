from fastapi import APIRouter, Depends, Query
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from app.core.security import get_current_user
from app.database.models.resume_analysis import ResumeAnalysis

router = APIRouter()

@router.get("/recruiter", status_code=200)
async def get_recruiter_dashboard(
    days: int = Query(default=30, description="Number of days to look back for analytics"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get recruiter dashboard analytics including:
    - Total analyses and resumes analyzed
    - Recent bulk analyses
    - Top candidates by score
    - Monthly statistics
    """
    
    # Check if user is recruiter
    user_role = current_user.get("role")
    if user_role != "recruiter":
        return {
            "status": "error",
            "message": "Dashboard access limited to recruiters",
            "data": None
        }
    
    user_id = current_user.get("user_id")
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    try:
        # Get all analyses by this recruiter
        all_analyses = await ResumeAnalysis.find(
            ResumeAnalysis.user_id == user_id
        ).sort("-analyzed_at").to_list()
        
        # Get recent analyses (within the specified days)
        recent_analyses = [
            analysis for analysis in all_analyses 
            if analysis.analyzed_at >= cutoff_date
        ]
        
        # Calculate basic statistics
        total_analyses = len(all_analyses)
        total_resumes = len(all_analyses)  # Each analysis = one resume
        analyses_this_month = len(recent_analyses)
        
        # Calculate average scores using the actual model structure
        if all_analyses:
            ats_scores = [a.scores.ats_compatibility_score for a in all_analyses if a.scores]
            overall_scores = [a.scores.overall_score for a in all_analyses if a.scores]
            avg_ats_score = round(sum(ats_scores) / len(ats_scores), 1) if ats_scores else 0
            avg_overall_score = round(sum(overall_scores) / len(overall_scores), 1) if overall_scores else 0
            
            # Count top candidates (ATS score >= 80)
            top_candidates_count = len([s for s in ats_scores if s >= 80])
        else:
            avg_ats_score = 0
            avg_overall_score = 0
            top_candidates_count = 0
        
        # Group by bulk analysis sessions (same job_context and close timestamps)
        bulk_analyses = []
        grouped_analyses = {}
        
        for analysis in recent_analyses:
            # Create a key based on job_title and date (group analyses within same hour)
            analysis_hour = analysis.analyzed_at.replace(minute=0, second=0, microsecond=0)
            job_title = analysis.job_context.job_title if analysis.job_context else "general"
            job_key = f"{job_title}_{analysis_hour}"
            
            if job_key not in grouped_analyses:
                grouped_analyses[job_key] = []
            grouped_analyses[job_key].append(analysis)
        
        # Process bulk analysis groups
        for group_key, group_analyses in grouped_analyses.items():
            if len(group_analyses) > 1:  # Only consider groups with multiple analyses as "bulk"
                # Find the best candidate in this group
                best_candidate = max(
                    group_analyses, 
                    key=lambda x: x.scores.ats_compatibility_score if x.scores else 0
                )
                
                # Calculate group statistics
                scores = [a.scores.ats_compatibility_score for a in group_analyses if a.scores]
                avg_score = round(sum(scores) / len(scores), 1) if scores else 0
                
                bulk_analyses.append({
                    "id": str(best_candidate.id),
                    "job_title": best_candidate.job_context.job_title if best_candidate.job_context else "General Analysis",
                    "total_resumes": len(group_analyses),
                    "successful_analyses": len([a for a in group_analyses if a.scores]),
                    "avg_score": avg_score,
                    "top_candidate": best_candidate.file_name.replace('.pdf', '').replace('_', ' '),
                    "analyzed_at": group_analyses[0].analyzed_at.isoformat()
                })
        
        # Sort bulk analyses by date (most recent first)
        bulk_analyses.sort(key=lambda x: x['analyzed_at'], reverse=True)
        
        # Get top candidates overall (highest ATS scores)
        top_candidates = sorted(
            all_analyses,
            key=lambda x: x.scores.ats_compatibility_score if x.scores else 0,
            reverse=True
        )[:10]
        
        top_candidates_data = []
        for candidate in top_candidates:
            if candidate.scores:
                top_candidates_data.append({
                    "file_name": candidate.file_name,
                    "overall_score": candidate.scores.overall_score,
                    "ats_score": candidate.scores.ats_compatibility_score,
                    "analyzed_at": candidate.analyzed_at.isoformat(),
                    "job_title": candidate.job_context.job_title if candidate.job_context else "General"
                })
        
        dashboard_data = {
            "stats": {
                "total_analyses": total_analyses,
                "analyses_this_month": analyses_this_month,
                "total_resumes_analyzed": total_resumes,
                "avg_ats_score": avg_ats_score,
                "avg_overall_score": avg_overall_score,
                "top_candidates_count": top_candidates_count,
                "recent_bulk_analyses": len(bulk_analyses)
            },
            "recent_analyses": bulk_analyses[:5],  # Limit to 5 most recent
            "top_candidates": top_candidates_data[:8]  # Limit to 8 top candidates
        }
        
        return {
            "status": "success",
            "message": f"Dashboard data for last {days} days",
            "data": dashboard_data
        }
        
    except Exception as e:
        return {
            "status": "error", 
            "message": f"Failed to fetch dashboard data: {str(e)}",
            "data": None
        }