import asyncio
from datetime import datetime, timedelta
import re
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import secrets
import string
import jwt
from typing import Optional, Union, Any
import os
import dotenv

dotenv.load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

class Security():
    def __init__(self):
        # PRD 4.62: "Hash passwords (bcrypt, Argon2)"
        self.context = CryptContext(schemes=["argon2"], deprecated="auto")
        
        # Pre-compile regex patterns for performance
        self.uppercase_regex = re.compile(r"[A-Z]")
        self.lowercase_regex = re.compile(r"[a-z]")
        self.digit_regex = re.compile(r"\d")
        self.special_char_regex = re.compile(r"[!@#$%^&*(),.?\":{}|<>]")

    async def hash_password(self, password: str) -> str:
        """
        Hashes a password asynchronously using Argon2.
        """
        return await asyncio.to_thread(self.context.hash, password)

    async def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verifies a password asynchronously.
        """
        return await asyncio.to_thread(self.context.verify, plain_password, hashed_password)

    async def validate_password(self, password: str) -> bool:
        """
        Validates password strength rules synchronously.
        Raises HTTPException if validation fails (best for FastAPI flow).
        
        Rules:
        - At least 8 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        - At least one special character
        """
        if len(password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 8 characters long"
            )
        
        if not self.uppercase_regex.search(password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must contain at least one uppercase letter"
            )

        if not self.lowercase_regex.search(password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must contain at least one lowercase letter"
            )

        if not self.digit_regex.search(password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must contain at least one number"
            )

        if not self.special_char_regex.search(password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must contain at least one special character (!@#$%^&*...)"
            )
            
        return True
    
    async def generate_otp(self, length: int = 6) -> str:
        """
        Generates a cryptographically secure numeric OTP.
        Example output: "482910"
        """
        # Define the alphabet (digits 0-9)
        digits = string.digits
        
        # Select 'length' random digits securely
        otp = "".join(secrets.choice(digits) for _ in range(length))
        return otp
    

    # JWT Token Methods
    async def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """
        Creates a JWT access token.
        """
        payload = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        payload.update({"exp": expire})
        encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    async def create_refresh_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """
        Creates a JWT refresh token.
        """
        payload = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        payload.update({"exp": expire})
        encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    async def verify_token(self, token: str) -> Union[dict, None]:
        """
        Verifies a JWT token and returns the payload if valid.
        Returns None if invalid.
        """
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except jwt.PyJWTError:
            return None
    
    async def get_current_user(self, token: str) -> Any:
        """
        Extracts user information from the JWT token.
        Raises HTTPException if token is invalid or expired.
        """
        payload = await self.verify_token(token)
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return payload

    
# --- Singleton Instance ---
security = Security()

# --- HTTPBearer scheme for token extraction ---
bearer_scheme = HTTPBearer()

# --- Dependency function for FastAPI ---
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> Any:
    """
    FastAPI dependency to extract and verify the current user from JWT token.
    """
    token = credentials.credentials
    return await security.get_current_user(token)