from fastapi import APIRouter

from app.api.routes import items, login, private, users, utils, projects, project_threads, tasks, volunteer_profiles
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(items.router)
api_router.include_router(projects.router)
api_router.include_router(project_threads.router, prefix="/projects")
api_router.include_router(tasks.router)
api_router.include_router(volunteer_profiles.router)

if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
