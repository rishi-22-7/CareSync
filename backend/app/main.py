import os
import cloudinary
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers import auth, patients, medications, uploads
import app.models  # noqa: F401 — ensures all models are registered with Base

load_dotenv()

# ── Cloudinary configuration (done once here, not in every router) ──
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

app = FastAPI(title="CareSync API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
