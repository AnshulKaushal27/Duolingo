from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from ....core.config import settings
from ....core.database import get_db
from ....core.deps import get_current_user
from ....schemas.auth import (
    SignupRequest,
    LoginRequest,
    ForgotPasswordRequest,
    SocialLoginRequest,
)
from ....schemas.user import UserProfile
from ....models.user import User
from ....services.auth_service import (
    signup_user,
    login_user,
    social_login_user,
    logout_session,
)

router = APIRouter()

SESSION_COOKIE_NAME = "duo_session"
COOKIE_MAX_AGE = 30 * 24 * 3600  # 30 days

def set_session_cookie(response: Response, token: str, request: Optional[Request] = None) -> None:
    """Sets session cookie with support for cross-origin HTTPS deployments (Vercel <-> Render)."""
    is_prod = (settings.ENVIRONMENT.lower() == "production") or (request is not None and request.url.scheme == "https")
    response.headers["X-Duo-Token"] = token
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        max_age=COOKIE_MAX_AGE,
        httponly=True,
        samesite="none" if is_prod else "lax",
        secure=True if is_prod else False,
        path="/",
    )

def delete_session_cookie(response: Response, request: Optional[Request] = None) -> None:
    is_prod = (settings.ENVIRONMENT.lower() == "production") or (request is not None and request.url.scheme == "https")
    response.delete_cookie(
        key=SESSION_COOKIE_NAME,
        path="/",
        httponly=True,
        samesite="none" if is_prod else "lax",
        secure=True if is_prod else False,
    )

@router.post("/signup", response_model=UserProfile, status_code=status.HTTP_201_CREATED)
def api_signup(
    payload: SignupRequest,
    response: Response,
    request: Request,
    db: Session = Depends(get_db),
):
    """Registers a new learner, establishes an authenticated session, and returns UserProfile."""
    user, token = signup_user(db, payload)
    set_session_cookie(response, token, request)
    return user

@router.post("/login", response_model=UserProfile)
def api_login(
    payload: LoginRequest,
    response: Response,
    request: Request,
    db: Session = Depends(get_db),
):
    """Authenticates a learner via email or username, creates a session cookie, and returns UserProfile."""
    user, token = login_user(db, payload)
    set_session_cookie(response, token, request)
    return user

@router.post("/social-login", response_model=UserProfile)
def api_social_login(
    payload: SocialLoginRequest,
    response: Response,
    request: Request,
    db: Session = Depends(get_db),
):
    """Mock social authentication handler for Google and Facebook login buttons."""
    user, token = social_login_user(db, payload.provider)
    set_session_cookie(response, token, request)
    return user

@router.post("/logout")
def api_logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    """Terminates the user's active session and clears the duo_session cookie."""
    token = request.cookies.get(SESSION_COOKIE_NAME) or request.headers.get("x-duo-token")
    if token:
        logout_session(db, token)
    delete_session_cookie(response, request)
    return {"success": True, "message": "Successfully logged out."}

@router.get("/me", response_model=UserProfile)
def api_get_me(current_user: User = Depends(get_current_user)):
    """Returns the authenticated learner's profile from the active duo_session cookie."""
    return current_user

@router.post("/forgot-password")
def api_forgot_password(payload: ForgotPasswordRequest):
    """Safe password reset request. Never exposes user presence in the system."""
    return {
        "success": True,
        "message": "If an account matches that email address, password reset instructions have been sent."
    }
