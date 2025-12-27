from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from ..database.models.user import UserRole

# ===========================
# API REQUEST MODELS (Inputs)
# ===========================
# Use these when you receive data FROM the frontend

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    role: UserRole
    company: Optional[str] = None

class ResendOTPRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

# ===========================
# API RESPONSE MODELS (Outputs)
# ===========================
# Use these when sending data TO the frontend

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_name: str
    role: str
