from fastapi import APIRouter
from .endpoints import auth, courses, lessons, user, gamification

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Sessions"])
api_router.include_router(courses.router, prefix="/courses", tags=["Courses & Learning Path"])
api_router.include_router(lessons.router, prefix="/lessons", tags=["Lessons & Exercise Validation"])
api_router.include_router(user.router, prefix="/user", tags=["User & Hearts"])
api_router.include_router(gamification.router, prefix="", tags=["Gamification & Leaderboard"])
