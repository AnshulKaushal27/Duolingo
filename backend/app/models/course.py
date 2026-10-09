from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), unique=True, index=True, nullable=False)
    title = Column(String(100), nullable=False)
    flag_icon = Column(String(100), nullable=False)
    description = Column(String(255), default="")

    units = relationship("Unit", back_populates="course", order_by="Unit.unit_number", cascade="all, delete-orphan")

class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    unit_number = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    color_hex = Column(String(20), default="#58cc02")

    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", order_by="Skill.order_index", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    icon_name = Column(String(50), default="star")
    total_crowns = Column(Integer, default=3)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", order_by="Lesson.order_index", cascade="all, delete-orphan")
