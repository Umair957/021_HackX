"""
Email scanner service - performs email scanning and resume analysis
"""
from datetime import datetime
from typing import List, Optional
from bson import ObjectId

from app.database.models.gmail_integration import GmailIntegration
from app.database.models.job import Job
from app.database.models.resume_analysis import ResumeAnalysis
from app.services.gmail_service import gmail_service
from app.utils.logger import get_logger

logger = get_logger(__name__)


async def perform_email_scan(integration_id: str, job_ids: Optional[List[str]] = None):
    """
    Perform email scan and analysis
    
    Args:
        integration_id: GmailIntegration document ID
        job_ids: Optional list of specific job IDs to scan for
    """
    try:
        logger.info(f"Starting email scan for integration {integration_id}")
        
        # Fetch integration
        integration = await GmailIntegration.get(integration_id)
        if not integration:
            logger.error(f"Integration {integration_id} not found")
            return
        
        # Update scan status
        integration.last_scan_status = "running"
        await integration.save()
        
        # Refresh access token if needed
        credentials = gmail_service.get_credentials(
            access_token=integration.access_token or "",
            refresh_token=integration.refresh_token or "",
            token_expiry=integration.token_expiry
        )
        
        # Update tokens if refreshed
        if credentials.token != integration.access_token:
            integration.access_token = credentials.token
            integration.token_expiry = credentials.expiry
            await integration.save()
        
        # Get jobs to scan for
        if job_ids:
            jobs = await Job.find({"_id": {"$in": [ObjectId(jid) for jid in job_ids]}}).to_list()
        elif integration.job_ids:
            jobs = await Job.find({"_id": {"$in": [ObjectId(jid) for jid in integration.job_ids]}}).to_list()
        else:
            # Get all active jobs for this recruiter
            jobs = await Job.find(
                Job.recruiter_id == integration.recruiter_id,
                Job.status != "closed"
            ).to_list()
        
        if not jobs:
            logger.warning(f"No jobs found for scanning (integration {integration_id})")
            integration.last_scan_status = "success"
            integration.last_scan_at = datetime.utcnow()
            integration.last_scan_count = 0
            await integration.save()
            return
        
        # Build keywords from jobs and custom keywords
        job_keywords = []
        for job in jobs:
            job_keywords.append(job.title)
            if job.description:
                # Extract key terms from description (simple approach)
                words = job.description.split()
                job_keywords.extend([w for w in words if len(w) > 5][:5])
        
        # Add custom keywords
        job_keywords.extend(integration.keywords)
        
        # Remove duplicates
        job_keywords = list(set(job_keywords))
        
        logger.info(f"Scanning with keywords: {job_keywords}")
        
        # Scan emails
        resumes = await gmail_service.scan_emails_for_resumes(
            credentials=credentials,
            job_keywords=job_keywords,
            last_scan=integration.last_scan_at,
            max_results=50
        )
        
        logger.info(f"Found {len(resumes)} resumes to analyze")
        
        # Analyze each resume
        analyzed_count = 0
        for resume_data in resumes:
            try:
                # Import here to avoid circular dependency
                from app.services.create_service import analyze_resume_with_ai
                
                # Analyze resume with AI (you'll need to adapt this to your existing AI service)
                analysis_result = await analyze_resume_with_ai(
                    resume_text=resume_data["content"],
                    job_context=jobs[0].title if jobs else "General"  # Use first job for context
                )
                
                # Save analysis
                analysis = ResumeAnalysis(
                    candidate_email=resume_data["from"],
                    job_id=str(jobs[0].id) if jobs else None,
                    resume_text=resume_data["content"][:5000],  # Truncate for storage
                    score=analysis_result.get("score", 0),
                    ats_score=analysis_result.get("ats_score", 0),
                    readability_score=analysis_result.get("readability_score", 0),
                    strengths=analysis_result.get("strengths", []),
                    weaknesses=analysis_result.get("weaknesses", []),
                    suggestions=analysis_result.get("suggestions", []),
                    keyword_matches=analysis_result.get("keyword_matches", []),
                    missing_keywords=analysis_result.get("missing_keywords", []),
                    metadata={
                        "source": "gmail",
                        "email_id": resume_data["email_id"],
                        "subject": resume_data["subject"],
                        "filename": resume_data["filename"],
                        "date": resume_data["date"]
                    }
                )
                
                await analysis.insert()
                analyzed_count += 1
                logger.info(f"Analyzed resume from {resume_data['from']}")
                
            except Exception as e:
                logger.error(f"Error analyzing resume from {resume_data.get('from')}: {e}")
                continue
        
        # Update integration status
        integration.last_scan_status = "success"
        integration.last_scan_at = datetime.utcnow()
        integration.last_scan_count = analyzed_count
        integration.last_error = None
        await integration.save()
        
        logger.info(f"Email scan completed. Analyzed {analyzed_count} resumes.")
        
        # Send notification email if enabled
        if integration.send_notifications:
            await send_scan_notification(integration, analyzed_count, jobs)
        
    except Exception as e:
        logger.error(f"Error in email scan: {e}")
        
        # Update error status
        try:
            integration = await GmailIntegration.get(integration_id)
            if integration:
                integration.last_scan_status = "error"
                integration.last_error = str(e)
                integration.last_scan_at = datetime.utcnow()
                await integration.save()
        except Exception as save_error:
            logger.error(f"Error saving error status: {save_error}")


async def send_scan_notification(
    integration: GmailIntegration,
    analyzed_count: int,
    jobs: List[Job]
):
    """Send email notification after scan completion"""
    try:
        # Import email service
        from app.services.email_service import send_email
        
        recipient = integration.notification_email or integration.email
        job_titles = ", ".join([job.title for job in jobs[:3]])
        if len(jobs) > 3:
            job_titles += f" and {len(jobs) - 3} more"
        
        subject = f"Resume Scan Complete - {analyzed_count} CVs Analyzed"
        
        body = f"""
        <html>
        <body>
            <h2>Gmail Resume Scan Complete</h2>
            <p>Your scheduled email scan has been completed.</p>
            
            <h3>Scan Summary:</h3>
            <ul>
                <li><strong>CVs Analyzed:</strong> {analyzed_count}</li>
                <li><strong>Jobs:</strong> {job_titles}</li>
                <li><strong>Scan Time:</strong> {datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")}</li>
            </ul>
            
            <p>
                <a href="http://localhost:3000/zume/resume/analyze" 
                   style="background-color: #4F46E5; color: white; padding: 10px 20px; 
                          text-decoration: none; border-radius: 5px; display: inline-block;">
                    View Analysis Results
                </a>
            </p>
            
            <p>Thank you for using our service!</p>
        </body>
        </html>
        """
        
        await send_email(
            to_email=recipient,
            subject=subject,
            html_content=body
        )
        
        logger.info(f"Notification email sent to {recipient}")
        
    except Exception as e:
        logger.error(f"Error sending notification email: {e}")


async def analyze_resume_with_ai(resume_text: str, job_context: str) -> dict:
    """
    Placeholder for AI analysis - integrate with your existing AI service
    
    TODO: Replace this with actual AI analysis from your create_service.py
    """
    # This is a simplified version - you should integrate with your actual AI service
    return {
        "score": 75,
        "ats_score": 70,
        "readability_score": 80,
        "strengths": ["Good formatting", "Relevant experience"],
        "weaknesses": ["Missing keywords", "Too brief"],
        "suggestions": [
            {
                "category": "Keywords",
                "issue": "Missing important keywords",
                "fix": "Add more technical skills",
                "priority": "high"
            }
        ],
        "keyword_matches": ["Python", "JavaScript"],
        "missing_keywords": ["React", "AWS"]
    }
