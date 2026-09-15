from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.core.config import Settings


def create_app(settings: Settings | None = None) -> FastAPI:
    resolved_settings = settings or Settings()
    application = FastAPI(title=resolved_settings.app_name)
    application.include_router(health_router, prefix="/api/v1")
    return application


app = create_app()
