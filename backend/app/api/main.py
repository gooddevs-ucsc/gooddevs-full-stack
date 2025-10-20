from fastapi import APIRouter

from app.api.routes import items, login, private, users, utils, projects, project_threads, tasks, project_applications, notifications, payments, requester_profile, donations, volunteer_profile, public_profiles, sponsorships, withdrawals
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(items.router)
api_router.include_router(projects.router)
api_router.include_router(project_threads.router)
api_router.include_router(tasks.router)
api_router.include_router(project_applications.router)
api_router.include_router(payments.router)
api_router.include_router(donations.router)
api_router.include_router(sponsorships.router)
api_router.include_router(withdrawals.router)
api_router.include_router(notifications.router)

api_router.include_router(
    requester_profile.router,
    prefix="/requester-profile",
    tags=["requester-profile"]
)
api_router.include_router(
    volunteer_profile.router,
    prefix="/volunteer-profile",
    tags=["volunteer-profile"]
)

# Public profile routes (no authentication required)
api_router.include_router(
    public_profiles.router,
    prefix="/public",
    tags=["public-profiles"]
)

if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
