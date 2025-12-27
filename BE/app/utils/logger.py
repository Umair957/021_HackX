"""
Secure logging utility that prevents sensitive data from being logged
"""
import logging
import re
from typing import Any, Dict
from datetime import datetime

# Configure logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

class SecureLogger:
    """Logger that automatically masks sensitive information"""
    
    # Patterns to identify sensitive data
    SENSITIVE_PATTERNS = [
        (r'token["\']?\s*[:=]\s*["\']?([^"\'\s,}]+)', 'token'),
        (r'password["\']?\s*[:=]\s*["\']?([^"\'\s,}]+)', 'password'),
        (r'api[_-]?key["\']?\s*[:=]\s*["\']?([^"\'\s,}]+)', 'api_key'),
        (r'secret["\']?\s*[:=]\s*["\']?([^"\'\s,}]+)', 'secret'),
        (r'authorization["\']?\s*[:=]\s*["\']?([^"\'\s,}]+)', 'authorization'),
        (r'Bearer\s+([^\s,}]+)', 'bearer_token'),
    ]
    
    SENSITIVE_KEYS = {
        'token', 'password', 'api_key', 'secret', 'authorization',
        'access_token', 'refresh_token', 'bearer', 'credentials',
        'auth', 'api-key', 'apikey', 'passwd', 'pwd'
    }
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
    
    def _mask_value(self, value: str, visible_chars: int = 4) -> str:
        """Mask a sensitive value, showing only first few characters"""
        if not value or len(value) <= visible_chars:
            return '***'
        return f"{value[:visible_chars]}{'*' * (len(value) - visible_chars)}"
    
    def _sanitize_dict(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Recursively sanitize dictionary data"""
        sanitized = {}
        for key, value in data.items():
            key_lower = key.lower().replace('_', '').replace('-', '')
            
            # Check if key is sensitive
            if any(sensitive in key_lower for sensitive in self.SENSITIVE_KEYS):
                sanitized[key] = '***MASKED***'
            elif isinstance(value, dict):
                sanitized[key] = self._sanitize_dict(value)
            elif isinstance(value, (list, tuple)):
                sanitized[key] = [
                    self._sanitize_dict(item) if isinstance(item, dict) else item
                    for item in value
                ]
            else:
                sanitized[key] = value
        
        return sanitized
    
    def _sanitize_message(self, message: str) -> str:
        """Remove sensitive data patterns from string messages"""
        sanitized = message
        for pattern, name in self.SENSITIVE_PATTERNS:
            sanitized = re.sub(
                pattern,
                f'{name}=***MASKED***',
                sanitized,
                flags=re.IGNORECASE
            )
        return sanitized
    
    def info(self, message: str, extra: Dict = None):
        """Log info level message with sanitization"""
        clean_message = self._sanitize_message(message)
        if extra:
            extra = self._sanitize_dict(extra)
        self.logger.info(clean_message, extra=extra or {})
    
    def warning(self, message: str, extra: Dict = None):
        """Log warning level message with sanitization"""
        clean_message = self._sanitize_message(message)
        if extra:
            extra = self._sanitize_dict(extra)
        self.logger.warning(clean_message, extra=extra or {})
    
    def error(self, message: str, extra: Dict = None):
        """Log error level message with sanitization"""
        clean_message = self._sanitize_message(message)
        if extra:
            extra = self._sanitize_dict(extra)
        self.logger.error(clean_message, extra=extra or {})
    
    def debug(self, message: str, extra: Dict = None):
        """Log debug level message with sanitization"""
        clean_message = self._sanitize_message(message)
        if extra:
            extra = self._sanitize_dict(extra)
        self.logger.debug(clean_message, extra=extra or {})


# Create default logger instances
def get_logger(name: str) -> SecureLogger:
    """Get a secure logger instance"""
    return SecureLogger(name)
