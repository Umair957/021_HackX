"""
Background scheduler for periodic email scanning
"""
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime
from typing import List

from app.database.models.gmail_integration import GmailIntegration
from app.services.scanner_service import perform_email_scan
from app.utils.logger import get_logger

logger = get_logger(__name__)

scheduler = AsyncIOScheduler()


async def scan_job_wrapper(integration_id: str):
    """Wrapper for scheduled scan jobs"""
    try:
        logger.info(f"Executing scheduled scan for integration {integration_id}")
        await perform_email_scan(integration_id=integration_id)
    except Exception as e:
        logger.error(f"Error in scheduled scan for {integration_id}: {e}")


async def setup_scheduled_scans():
    """Setup all scheduled scans based on active integrations"""
    try:
        # Clear existing jobs
        scheduler.remove_all_jobs()
        
        # Get all active integrations
        integrations = await GmailIntegration.find(
            GmailIntegration.is_active == True
        ).to_list()
        
        logger.info(f"Setting up {len(integrations)} scheduled scans")
        
        for integration in integrations:
            job_id = f"gmail_scan_{integration.id}"
            
            if integration.scan_schedule == "hourly":
                # Run every hour
                scheduler.add_job(
                    scan_job_wrapper,
                    trigger=CronTrigger(minute=0),
                    args=[str(integration.id)],
                    id=job_id,
                    replace_existing=True,
                    name=f"Hourly scan for {integration.email}"
                )
                logger.info(f"Scheduled hourly scan for {integration.email}")
                
            elif integration.scan_schedule == "daily":
                # Run daily at specified time
                hour, minute = map(int, integration.scan_time.split(':'))
                scheduler.add_job(
                    scan_job_wrapper,
                    trigger=CronTrigger(hour=hour, minute=minute),
                    args=[str(integration.id)],
                    id=job_id,
                    replace_existing=True,
                    name=f"Daily scan for {integration.email} at {integration.scan_time}"
                )
                logger.info(f"Scheduled daily scan for {integration.email} at {integration.scan_time}")
                
            elif integration.scan_schedule == "weekly":
                # Run weekly on Monday at specified time
                hour, minute = map(int, integration.scan_time.split(':'))
                scheduler.add_job(
                    scan_job_wrapper,
                    trigger=CronTrigger(day_of_week='mon', hour=hour, minute=minute),
                    args=[str(integration.id)],
                    id=job_id,
                    replace_existing=True,
                    name=f"Weekly scan for {integration.email} on Mondays at {integration.scan_time}"
                )
                logger.info(f"Scheduled weekly scan for {integration.email}")
        
        logger.info("All scheduled scans configured successfully")
        
    except Exception as e:
        logger.error(f"Error setting up scheduled scans: {e}")


def start_scheduler():
    """Start the background scheduler"""
    if not scheduler.running:
        scheduler.start()
        logger.info("Scheduler started")


def stop_scheduler():
    """Stop the background scheduler"""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("Scheduler stopped")


async def refresh_scheduler():
    """Refresh scheduler jobs (call this when integration config changes)"""
    await setup_scheduled_scans()
    logger.info("Scheduler refreshed")
