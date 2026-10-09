from typing import Optional
from fastapi import Request, Depends
from sqlalchemy.orm import Session
from .database import get_db
from ..models import User
from ..services.auth_service import get_user_from_session_token
from ..services.user_service import get_or_create_default_user

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Reads session token from HTTP-only duo_session cookie, Authorization header (Bearer),
    or X-Duo-Token header. If no token is provided, gracefully defaults to the pre-seeded learner (Alex Ramos).
    """
    session_token = request.cookies.get("duo_session")
    
    if not session_token:
        auth_header = request.headers.get("authorization", "")
        if auth_header.lower().startswith("bearer "):
            session_token = auth_header[7:].strip()
            
    if not session_token:
        session_token = request.headers.get("x-duo-token")

    if session_token:
        user = get_user_from_session_token(db, session_token)
        if not user:
            from fastapi import HTTPException, status
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired session. Please log in again."
            )
        return user
        
    return get_or_create_default_user(db)

def get_current_user_optional(request: Request, db: Session = Depends(get_db)) -> Optional[User]:
    """Optional session resolution."""
    return get_current_user(request, db)
