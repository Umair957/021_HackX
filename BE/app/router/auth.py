from fastapi import FastAPI, Depends, HTTPException, status, APIRouter, Response
from app.database.models import user
from app.services.auth_service import AuthService
from app.schema import auth
from pydantic import EmailStr
from app.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(payload: user.User):
    
    logger.info("User registration initiated")
    try:
        await AuthService.create_user(
            first_name=payload.first_name,
            last_name=payload.last_name,
            email=payload.email,
            role=payload.role,
            company=payload.company,
            password=payload.password
        )
        
    except HTTPException as http_exc:
        raise http_exc
    
        
    return HTTPException(
        status_code=status.HTTP_201_CREATED,
        detail="User registered successfully. Please verify your email with the OTP sent."
    )
    
    
    
@router.post("/verify-otp", status_code=status.HTTP_200_OK)
async def verify_otp(
    payload: auth.VerifyOTPRequest
    ):
    
    is_verified = await AuthService.verify_otp(user_email=payload.email, input_otp=payload.otp)
    
    if not is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP."
        )
        
    return {"detail": "Email verified successfully."}


@router.post("/resend-otp", status_code=status.HTTP_200_OK)
async def resend_otp(
    payload: auth.ResendOTPRequest
    ):
    
    try:
        await AuthService.resend_otp(user_email=payload.email)
        
    except HTTPException as http_exc:
        raise http_exc
    
        
    return {"detail": "OTP resent successfully."}


@router.post("/login", response_model=auth.TokenResponse ,status_code=status.HTTP_200_OK)
async def login_user(
    credentials: auth.LoginRequest, response: Response
    ):
    
    user_data, token = await AuthService.authenticate_user(email=credentials.email, password=credentials.password)
    
    # Return token only, user data without sensitive info
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_name": user_data["sub"],
        "role": user_data["role"]
    }