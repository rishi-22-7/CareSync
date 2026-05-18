import os
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, UploadFile, File

router = APIRouter(tags=["Uploads"])


@router.post("/upload-image")
async def upload_image(image: UploadFile = File(...)):
    """Uploads an image to Cloudinary and returns the permanent secure URL."""
    result = cloudinary.uploader.upload(image.file, resource_type="image")
    return {"image_url": result.get("secure_url")}
