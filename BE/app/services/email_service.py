"""
Email notification service
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

from app.utils.logger import get_logger

logger = get_logger(__name__)


async def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    from_email: Optional[str] = None,
    from_name: Optional[str] = None
):
    """
    Send email notification
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML email body
        from_email: Sender email (defaults to SMTP_FROM_EMAIL env var)
        from_name: Sender name (defaults to "ZUME Resume Analyzer")
    """
    try:
        # Get SMTP configuration from environment
        smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_username = os.getenv("SMTP_USERNAME")
        smtp_password = os.getenv("SMTP_PASSWORD")
        from_email = from_email or os.getenv("SMTP_FROM_EMAIL", smtp_username)
        from_name = from_name or "ZUME Resume Analyzer"
        
        if not smtp_username or not smtp_password:
            logger.warning("SMTP credentials not configured. Email not sent.")
            return False
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f"{from_name} <{from_email}>"
        msg['To'] = to_email
        
        # Attach HTML content
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Send email
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Error sending email to {to_email}: {e}")
        return False
