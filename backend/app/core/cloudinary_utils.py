import cloudinary.uploader
from fastapi import UploadFile, HTTPException
import uuid

async def upload_image_to_cloudinary(file: UploadFile, folder: str ) -> str:
    """
    Upload image to Cloudinary and return the secure URL
    """
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
        
        # Generate unique filename
        file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        # Read file content
        file_content = await file.read()
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file_content,
            folder=folder,
            public_id=unique_filename,
            resource_type="image",
            transformation=[
                {"width": 500, "height": 500, "crop": "fill", "gravity": "face"},  # Resize and crop
                {"quality": "auto"}  # Auto quality optimization
            ]
        )
        
        return result["secure_url"]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")