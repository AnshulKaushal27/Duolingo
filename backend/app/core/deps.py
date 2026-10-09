from typing import Optional
from fastapi import Request, Depends
from sqlalchemy.orm import Session
from .database import get_db
from ..models import User
from ..services.auth_service import get_user_from_session_token

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Reads session token from HTTP-only duo_session cookie, Authorization header (Bearer),
    or X-Duo-Token header. Requires valid authentication.
    """
    session_token = request.cookies.get("duo_session")
    
    if not session_token:
        auth_header = request.headers.get("authorization", "")
        if auth_header.lower().startswith("bearer "):
            session_token = auth_header[7:].strip()
            
    if not session_token:
        session_token = request.headers.get("x-duo-token")

    if not session_token:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in."
        )

    user = get_user_from_session_token(db, session_token)
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session. Please log in again."
        )
    return user

def get_current_user_optional(request: Request, db: Session = Depends(get_db)) -> Optional[User]:
    """Optional session resolution. Returns None if unauthenticated."""
    session_token = request.cookies.get("duo_session")
    
    if not session_token:
        auth_header = request.headers.get("authorization", "")
        if auth_header.lower().startswith("bearer "):
            session_token = auth_header[7:].strip()
            
    if not session_token:
        session_token = request.headers.get("x-duo-token")

    if not session_token:
        return None

    return get_user_from_session_token(db, session_token)

