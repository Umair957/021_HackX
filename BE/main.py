from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database.connection import connect
from app.router.auth import router as auth_router
from app.router.resume_create import router as resume_router
from app.router.resume_analyze import router as analyze_router
from app.router.dashboard import router as dashboard_router
from app.router.jobs import router as jobs_router
from app.router.gmail_integration import router as gmail_router
from app.router.profile import router as profile_router
from app.router.templates import router as templates_router
from app.router.trends import router as trends_router
from app.middleware.security import SecurityHeadersMiddleware, RateLimitMiddleware
from app.utils.logger import get_logger
import signal
import sys

logger = get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- STARTUP ---
    logger.info("Starting application...")
    await connect.init_db()  # Connects to Mongo & Initializes Beanie
    logger.info("Database initialized successfully")
    
    # Start background scheduler for Gmail scanning
    from app.services.scheduler_service import start_scheduler, setup_scheduled_scans
    start_scheduler()
    await setup_scheduled_scans()
    logger.info("Background scheduler started")

    yield  # The application runs here

    # --- SHUTDOWN ---
    logger.info("Shutting down application...")
    
    # Stop scheduler
    from app.services.scheduler_service import stop_scheduler
    stop_scheduler()
    logger.info("Background scheduler stopped")
    
    await connect.close_db() # Cleans up connection

# Pass the lifespan to the app
app = FastAPI(
    title="ZUME API",
    lifespan=lifespan,
    docs_url="/api/docs",  # Move docs to /api/docs for better security
    redoc_url="/api/redoc"
)

# Add security middlewares
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    RateLimitMiddleware,
    max_requests=100,  # 100 requests per window
    window_seconds=60   # 60 seconds window
)

# CORS configuration (adjust origins as needed for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.1.14:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"]
)

# Include routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["AUTH"])
app.include_router(resume_router, prefix="/api/v1/resume", tags=["RESUME"])
app.include_router(analyze_router, prefix="/api/v1/resume", tags=["RESUME_ANALYSIS"])
app.include_router(dashboard_router, prefix="/api/v1/dashboard", tags=["DASHBOARD"])
app.include_router(jobs_router, prefix="/api/v1/jobs", tags=["JOBS"])
app.include_router(gmail_router, prefix="/api/v1/gmail", tags=["GMAIL_INTEGRATION"])
app.include_router(profile_router, prefix="/api/v1/profile", tags=["PROFILE"])
app.include_router(templates_router, prefix="/api/v1/templates", tags=["TEMPLATES"])
app.include_router(trends_router, prefix="/api/v1/trends", tags=["TRENDS"])


@app.get("/")
async def root():
    return {"message": "Welcome to the Resume Analyzer API"}

def signal_handler(sig, frame):
    if sig == signal.SIGINT:
        print('Shutting down server...')

    sys.exit(0)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
