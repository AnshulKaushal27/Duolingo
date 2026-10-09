from pydantic import BaseModel, Field
from typing import Optional
from .user import UserProfile

class SignupRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=3, max_length=100)
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=128)
    age: Optional[int] = Field(None, ge=5, le=120)
    daily_goal_xp: Optional[int] = 20
    placement_unit: Optional[int] = 1

class LoginRequest(BaseModel):
    identifier: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=1, max_length=128)

class ForgotPasswordRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=100)

class SocialLoginRequest(BaseModel):
    provider: str = Field(..., description="google or facebook")

class AuthResponse(BaseModel):
    success: bool = True
    user: UserProfile
    message: Optional[str] = None
