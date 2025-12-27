from datetime import datetime, timedelta
from fastapi import HTTPException, status
from app.database.models import candidate, recruiter
from app.database.models.user import User, OTPModel
from pydantic import EmailStr
from app.database.connection import connect
from app.core.security import security


class AuthService:
    @staticmethod
    async def create_user(
        email: str, 
        password: str, 
        first_name: str, 
        last_name: str, 
        role: User.UserRole,
        company: str = None
    ) -> User.User:
        # 1. Check if user already exists
        existing_user = await User.User.find_one({"email": email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        await security.validate_password(password)

        # 3. Hash the Password
        hashed_password = await security.hash_password(password)

        # 4. Generate OTP
        otp_code = await security.generate_otp()
        otp_expiry = datetime.utcnow() + timedelta(minutes=10) # Expires in 10 mins

        # 5. Create User Document
        new_user = User.User(
            email=email,
            password=hashed_password,
            first_name=first_name,
            last_name=last_name,
            role=role,
            otp=User.OTPModel(code=otp_code, expires_at=otp_expiry),
            company=company,
            is_verified=False
        )
        
        # 6. Save to DB
        await new_user.create()

        # 3. Create the Linked Profile (The "Spoke")
        # depending on the role selected
        if role == User.UserRole.CANDIDATE:
            profile = candidate.CandidateProfile(
                user_id=str(new_user.id),  # <--- LINKING HAPPENS HERE
                full_name=f"{first_name} {last_name}",
                email=email
            )
            await profile.insert()

        elif role == User.UserRole.RECRUITER:
            # NOTE: If this is a new company, create it. 
            # If they are joining an existing one via invite, that's a different flow.
            # Assuming they are creating a new company here:
            company = recruiter.CompanyProfile(
                owner_user_id=str(new_user.id), # <--- LINKING HAPPENS HERE
                details={
                    "name": company or "", # Ensure your frontend sends this!
                    "industry": "Technology" # Default or ask in signup
                }
            )
            await company.insert()
            
        return new_user

    @staticmethod
    async def verify_otp(user_email: EmailStr, input_otp: str) -> bool:
        existing_user = await User.find_one( {"email":user_email})
        if not existing_user or not existing_user.otp:
            return False
            
        if existing_user.otp.code != input_otp:
            return False
            
        if datetime.utcnow() > existing_user.otp.expires_at:
            return False # Expired
            
        # Success: Verify user
        existing_user.is_verified = True
        existing_user.otp = OTPModel(code="", expires_at=datetime.utcnow()) # Clear OTP after use
        await existing_user.save()
        return True
    
    
    @staticmethod
    async def resend_otp(user_email: str) -> None:
        user = await User.find_one({"email": user_email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        # Generate new OTP
        otp_code = await security.generate_otp()
        otp_expiry = datetime.utcnow() + timedelta(minutes=10) # Expires in 10 mins
        user.otp = OTPModel(code=otp_code, expires_at=otp_expiry)
        await user.save()
        
    
    @staticmethod
    async def authenticate_user(email: str, password: str) -> str:
        user = await User.find_one({"email": email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        if not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email not verified"
            )
            
        is_password_valid = await security.verify_password(password, user.password)
        if not is_password_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
            
        # If everything is valid, generate and return an access token
        data = {
            "sub": user.email,
                "user_id": str(user.id),
            "role": user.role.value
        }
        access_token = await security.create_access_token(data=data)
        return data, access_token