from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.database.connection import connect
from app.router.auth import router as auth_router
from app.router.resume_create import router as resume_router
import signal
import sys

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- STARTUP ---
    await connect.init_db()  # Connects to Mongo & Initializes Beanie

    yield  # The application runs here

    # --- SHUTDOWN ---
    await connect.close_db() # Cleans up connection

# Pass the lifespan to the app
app = FastAPI(title="ZUME API", lifespan=lifespan)
app.include_router(auth_router, prefix="/api/v1/auth", tags=["AUTH"])
app.include_router(resume_router, prefix="/api/v1/resume", tags=["RESUME"])


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
