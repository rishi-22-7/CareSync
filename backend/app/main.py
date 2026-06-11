import os
import cloudinary
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
from app.workers.scheduler import check_schedules

from app.routers import auth, patients, medications, uploads
import app.models  # noqa: F401 — ensures all models are registered with Base

load_dotenv(override=True)

# ── Cloudinary configuration (done once here, not in every router) ──
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

app = FastAPI(title="CareSync API", version="2.0.0")

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
allowed_origins_env = os.getenv("CORS_ALLOWED_ORIGINS")
if allowed_origins_env:
    for origin in allowed_origins_env.split(","):
        origin = origin.strip()
        if origin:
            # Strip trailing slash if present (browsers send origins without trailing slashes)
            if origin.endswith("/"):
                origin = origin.rstrip("/")
            origins.append(origin)
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # If no env variable is set, default to allow any origin with credentials using regex
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"https?://.*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/", tags=["Health"])
def root():
    return {"message": "CareSync API is live!", "version": "2.0.0"}


@app.get("/api/config", tags=["Config"])
def get_config():
    sandbox_keyword = os.getenv("TWILIO_SANDBOX_KEYWORD", "YOUR_SANDBOX_KEYWORD")
    return {"twilio_sandbox_keyword": sandbox_keyword}


# Register all routers
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(medications.router)
app.include_router(uploads.router)


@app.on_event("startup")
def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_schedules, trigger="interval", minutes=1)
    scheduler.start()
    print("CareSync Background Scheduler started inside FastAPI process.")
