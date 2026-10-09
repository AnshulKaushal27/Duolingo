from datetime import datetime, date
from typing import Tuple, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models import User, UserSession
from ..schemas.auth import SignupRequest, LoginRequest
from ..core.security import (
    hash_password,
    verify_password,
    generate_session_token,
    get_session_expiry,
)

def create_session_for_user(db: Session, user_id: int) -> str:
    """Generates and persists a secure session token for a user."""
    token = generate_session_token()
    session = UserSession(
        id=token,
        user_id=user_id,
        created_at=datetime.utcnow(),
        expires_at=get_session_expiry(days=30),
    )
    db.add(session)
    db.commit()
    return token

def signup_user(db: Session, data: SignupRequest) -> Tuple[User, str]:
    email_clean = data.email.strip().lower()
    username_clean = data.username.strip().lower()

    # Check duplicate email
    existing_email = db.query(User).filter(User.email.ilike(email_clean)).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Check duplicate username
    existing_username = db.query(User).filter(User.username.ilike(username_clean)).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="That username is already taken."
        )

    # Hash password securely
    hashed = hash_password(data.password)

    user = User(
        display_name=data.name.strip(),
        username=username_clean,
        email=email_clean,
        password_hash=hashed,
        auth_provider="local",
        avatar_url="/mascot/duo-happy.svg",
        streak=1,
        last_active_date=date.today(),
        hearts=5,
        max_hearts=5,
        gems=500,
        total_xp=0,
        created_at=datetime.utcnow()
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # If learner placed into a higher unit via placement test, unlock prior units
    if data.placement_unit and data.placement_unit > 1:
        from ..models import Unit, UserProgress
        prior_units = db.query(Unit).filter(Unit.unit_number < data.placement_unit).all()
        xp_awarded = 0
        for u in prior_units:
            for sk in u.skills:
                for ls in sk.lessons:
                    prog = UserProgress(
                        user_id=user.id,
                        lesson_id=ls.id,
                        skill_id=sk.id,
                        completed=True,
                        mistakes_count=0,
                        xp_earned=15,
                        completed_at=datetime.utcnow()
                    )
                    db.add(prog)
                    xp_awarded += 15
        user.total_xp += xp_awarded
        db.commit()
        db.refresh(user)

    token = create_session_for_user(db, user.id)
    return user, token

def login_user(db: Session, data: LoginRequest) -> Tuple[User, str]:
    identifier_clean = data.identifier.strip().lower()

    if "@" in identifier_clean:
        user = db.query(User).filter(User.email.ilike(identifier_clean)).first()
    else:
        user = db.query(User).filter(User.username.ilike(identifier_clean)).first()

    if not user or not user.password_hash or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password."
        )

    token = create_session_for_user(db, user.id)
    return user, token

def social_login_user(db: Session, provider: str) -> Tuple[User, str]:
    """Clean mock authentication behind Google/Facebook buttons."""
    provider_name = provider.capitalize()
    mock_email = f"{provider.lower()}_learner@duolingo.example"
    mock_username = f"{provider.lower()}_learner"

    user = db.query(User).filter(User.email == mock_email).first()
    if not user:
        user = User(
            display_name=f"{provider_name} Learner",
            username=mock_username,
            email=mock_email,
            password_hash=hash_password("social-mock-password"),
            auth_provider=provider.lower(),
            avatar_url="/mascot/duo-happy.svg",
            streak=3,
            last_active_date=date.today(),
            hearts=5,
            max_hearts=5,
            gems=600,
            total_xp=120,
            created_at=datetime.utcnow()
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_session_for_user(db, user.id)
    return user, token

def logout_session(db: Session, session_token: str) -> bool:
    if not session_token:
        return False
    session = db.query(UserSession).filter(UserSession.id == session_token).first()
    if session:
        db.delete(session)
        db.commit()
        return True
    return False

def get_user_from_session_token(db: Session, session_token: str) -> Optional[User]:
    if not session_token:
        return None
    session = db.query(UserSession).filter(
        UserSession.id == session_token,
        UserSession.expires_at > datetime.utcnow()
    ).first()
    if session:
        return session.user
    return None
