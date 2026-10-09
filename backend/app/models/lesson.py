from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .base import Base

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    xp_reward = Column(Integer, default=15)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", order_by="Exercise.order_index", cascade="all, delete-orphan")
    progress = relationship("UserProgress", back_populates="lesson", cascade="all, delete-orphan")
    attempts = relationship("LessonAttempt", back_populates="lesson", cascade="all, delete-orphan")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    type = Column(String(50), nullable=False)  # multiple_choice, translate_word_bank, match_pairs, fill_in_the_blank, type_the_answer
    prompt = Column(String(255), nullable=False)
    question_text = Column(String(255), nullable=False)
    audio_text = Column(String(255), nullable=True)
    
    # Sanitized rendering data exposed to frontend
    client_payload = Column(JSON, nullable=False)
    
    # Authoritative solution data kept private on backend
    solution_payload = Column(JSON, nullable=False)

    lesson = relationship("Lesson", back_populates="exercises")

class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id = Column(String(50), primary_key=True, index=True)  # UUID
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    answered_exercise_ids = Column(JSON, default=list)  # List of exercise IDs submitted
    mistakes_count = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="lesson_attempts")
    lesson = relationship("Lesson", back_populates="attempts")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    completed = Column(Boolean, default=True)
    mistakes_count = Column(Integer, default=0)
    xp_earned = Column(Integer, default=15)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress")
