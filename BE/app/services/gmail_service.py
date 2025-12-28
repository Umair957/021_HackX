import base64
import io
import os
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import PyPDF2
from docx import Document as DocxDocument
from app.utils.logger import get_logger

logger = get_logger(__name__)


class GmailService:
    """Service for Gmail API operations"""
    
    SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
    
    def __init__(self):
        self.client_id = os.getenv("GOOGLE_CLIENT_ID")
        self.client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        self.redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/zume/settings/gmail/callback")
    
    def get_oauth_url(self, state: str) -> str:
        """Generate OAuth2 authorization URL"""
        from google_auth_oauthlib.flow import Flow
        
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [self.redirect_uri]
                }
            },
            scopes=self.SCOPES,
            redirect_uri=self.redirect_uri
        )
        
        auth_url, _ = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            state=state,
            prompt='consent'  # Force to get refresh token
        )
        
        return auth_url
    
    def exchange_code_for_tokens(self, code: str) -> Dict[str, Any]:
        """Exchange authorization code for access and refresh tokens"""
        from google_auth_oauthlib.flow import Flow
        
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [self.redirect_uri]
                }
            },
            scopes=self.SCOPES,
            redirect_uri=self.redirect_uri
        )
        
        flow.fetch_token(code=code)
        credentials = flow.credentials
        
        return {
            "access_token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_expiry": credentials.expiry,
            "email": self._get_user_email(credentials)
        }
    
    def _get_user_email(self, credentials: Credentials) -> str:
        """Get user's email address from Gmail API"""
        try:
            service = build('gmail', 'v1', credentials=credentials)
            profile = service.users().getProfile(userId='me').execute()
            return profile.get('emailAddress', '')
        except HttpError as error:
            logger.error(f"Error fetching user profile: {error}")
            return ""
    
    def refresh_access_token(self, refresh_token: str) -> Optional[Credentials]:
        """Refresh expired access token"""
        try:
            credentials = Credentials(
                token=None,
                refresh_token=refresh_token,
                token_uri="https://oauth2.googleapis.com/token",
                client_id=self.client_id,
                client_secret=self.client_secret,
                scopes=self.SCOPES
            )
            
            credentials.refresh(Request())
            return credentials
        except Exception as error:
            logger.error(f"Error refreshing token: {error}")
            return None
    
    def get_credentials(self, access_token: str, refresh_token: str, token_expiry: Optional[datetime] = None) -> Credentials:
        """Create credentials object"""
        credentials = Credentials(
            token=access_token,
            refresh_token=refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=self.client_id,
            client_secret=self.client_secret,
            scopes=self.SCOPES
        )
        
        if token_expiry:
            credentials.expiry = token_expiry
        
        # Refresh if expired
        if credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
        
        return credentials
    
    async def scan_emails_for_resumes(
        self,
        credentials: Credentials,
        job_keywords: List[str],
        last_scan: Optional[datetime] = None,
        max_results: int = 50
    ) -> List[Dict[str, Any]]:
        """
        Scan Gmail for emails with resume attachments
        
        Args:
            credentials: Google OAuth2 credentials
            job_keywords: Keywords to filter emails (job titles, skills, etc.)
            last_scan: Only fetch emails after this datetime
            max_results: Maximum number of emails to process
        
        Returns:
            List of dictionaries with resume data
        """
        try:
            service = build('gmail', 'v1', credentials=credentials)
            
            # Build search query
            query_parts = ["has:attachment"]
            
            # Add date filter
            if last_scan:
                date_str = last_scan.strftime("%Y/%m/%d")
                query_parts.append(f"after:{date_str}")
            
            # Add keywords (OR condition)
            if job_keywords:
                keyword_query = " OR ".join([f"subject:({kw})" for kw in job_keywords])
                query_parts.append(f"({keyword_query})")
            
            # Add filename filters for common resume formats
            query_parts.append("(filename:pdf OR filename:doc OR filename:docx)")
            
            query = " ".join(query_parts)
            logger.info(f"Gmail search query: {query}")
            
            # Search for messages
            results = service.users().messages().list(
                userId='me',
                q=query,
                maxResults=max_results
            ).execute()
            
            messages = results.get('messages', [])
            logger.info(f"Found {len(messages)} matching emails")
            
            resumes = []
            
            for message in messages:
                try:
                    # Get full message details
                    msg = service.users().messages().get(
                        userId='me',
                        id=message['id'],
                        format='full'
                    ).execute()
                    
                    # Extract email metadata
                    headers = {h['name']: h['value'] for h in msg['payload']['headers']}
                    subject = headers.get('Subject', 'No Subject')
                    from_email = headers.get('From', 'Unknown')
                    date = headers.get('Date', '')
                    
                    # Process attachments
                    if 'parts' in msg['payload']:
                        for part in msg['payload']['parts']:
                            if part.get('filename') and self._is_resume_file(part['filename']):
                                attachment_data = await self._download_attachment(
                                    service,
                                    message['id'],
                                    part
                                )
                                
                                if attachment_data:
                                    resume_text = self._extract_text_from_file(
                                        attachment_data,
                                        part['filename']
                                    )
                                    
                                    if resume_text:
                                        resumes.append({
                                            "email_id": message['id'],
                                            "subject": subject,
                                            "from": from_email,
                                            "date": date,
                                            "filename": part['filename'],
                                            "content": resume_text,
                                            "mime_type": part.get('mimeType', '')
                                        })
                
                except Exception as e:
                    logger.error(f"Error processing message {message['id']}: {e}")
                    continue
            
            logger.info(f"Successfully extracted {len(resumes)} resumes")
            return resumes
        
        except HttpError as error:
            logger.error(f"Gmail API error: {error}")
            raise Exception(f"Failed to scan emails: {str(error)}")
    
    def _is_resume_file(self, filename: str) -> bool:
        """Check if file is likely a resume"""
        resume_keywords = ['resume', 'cv', 'curriculum']
        ext = filename.lower().split('.')[-1]
        
        # Check file extension
        if ext not in ['pdf', 'doc', 'docx']:
            return False
        
        # Check filename contains resume-related keywords
        filename_lower = filename.lower()
        return any(keyword in filename_lower for keyword in resume_keywords)
    
    async def _download_attachment(
        self,
        service: Any,
        message_id: str,
        part: Dict[str, Any]
    ) -> Optional[bytes]:
        """Download email attachment"""
        try:
            if 'body' in part and 'attachmentId' in part['body']:
                attachment = service.users().messages().attachments().get(
                    userId='me',
                    messageId=message_id,
                    id=part['body']['attachmentId']
                ).execute()
                
                data = attachment.get('data')
                if data:
                    return base64.urlsafe_b64decode(data)
        except Exception as e:
            logger.error(f"Error downloading attachment: {e}")
        
        return None
    
    def _extract_text_from_file(self, file_data: bytes, filename: str) -> Optional[str]:
        """Extract text from PDF or DOCX file"""
        try:
            ext = filename.lower().split('.')[-1]
            
            if ext == 'pdf':
                return self._extract_text_from_pdf(file_data)
            elif ext in ['doc', 'docx']:
                return self._extract_text_from_docx(file_data)
        except Exception as e:
            logger.error(f"Error extracting text from {filename}: {e}")
        
        return None
    
    def _extract_text_from_pdf(self, file_data: bytes) -> str:
        """Extract text from PDF"""
        try:
            pdf_file = io.BytesIO(file_data)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = []
            for page in pdf_reader.pages:
                text.append(page.extract_text())
            
            return "\n".join(text)
        except Exception as e:
            logger.error(f"Error parsing PDF: {e}")
            return ""
    
    def _extract_text_from_docx(self, file_data: bytes) -> str:
        """Extract text from DOCX"""
        try:
            docx_file = io.BytesIO(file_data)
            doc = DocxDocument(docx_file)
            
            text = []
            for paragraph in doc.paragraphs:
                text.append(paragraph.text)
            
            return "\n".join(text)
        except Exception as e:
            logger.error(f"Error parsing DOCX: {e}")
            return ""


# Singleton instance
gmail_service = GmailService()
