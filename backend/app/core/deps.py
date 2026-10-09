from typing import Optional
from fastapi import Request, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .database import get_db
from ..models import User
from ..services.auth_service import get_user_from_session_token

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Reads the HTTP-only duo_session cookie and resolves the active UserSession.
    Raises 401 Unauthorized if the cookie is missing, expired, or invalid.
    """
    session_token = request.cookies.get("duo_session")
    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in."
        )
    user = get_user_from_session_token(db, session_token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session. Please log in again."
        )
    return user

def get_current_user_optional(request: Request, db: Session = Depends(get_db)) -> Optional[User]:
    """Optional session resolution without throwing 401."""
    session_token = request.cookies.get("duo_session")
    if not session_token:
        return None
    return get_user_from_session_token(db, session_token)
