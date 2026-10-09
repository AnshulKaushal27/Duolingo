from datetime import datetime, date
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=True)
    auth_provider = Column(String(50), default="local")
    avatar_url = Column(String(255), default="/mascot/duo-happy.svg")
    streak = Column(Integer, default=1)
    last_active_date = Column(Date, default=date.today)
    hearts = Column(Integer, default=5)
    max_hearts = Column(Integer, default=5)
    gems = Column(Integer, default=500)
    total_xp = Column(Integer, default=0)
    streak_freezes = Column(Integer, default=0)
    daily_goal_xp = Column(Integer, default=30)
    current_course_id = Column(Integer, nullable=True)
    last_heart_regenerated_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    lesson_attempts = relationship("LessonAttempt", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    quests = relationship("DailyQuest", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="sessions")

