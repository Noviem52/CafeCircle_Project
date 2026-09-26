import secrets
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.api.deps import require_role
from app.core.config import UPLOAD_DIR
from app.models.user import User

router = APIRouter()

ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
MAX_BYTES = 5 * 1024 * 1024


@router.post("/image", status_code=201)
async def upload_image(
    file: UploadFile = File(...),
    _owner: User = Depends(require_role("owner", "admin")),
):
    suffix = ALLOWED_TYPES.get(file.content_type or "")

    if not suffix:
        raise HTTPException(
            status_code=400,
            detail="Image must be a JPG, PNG, or WEBP file.",
        )

    contents = await file.read()

    if len(contents) > MAX_BYTES:
        raise HTTPException(
            status_code=400,
            detail="Image must be smaller than 5 MB.",
        )

    if not contents:
        raise HTTPException(status_code=400, detail="The file is empty.")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{secrets.token_hex(16)}{suffix}"
    Path(UPLOAD_DIR / filename).write_bytes(contents)

    return {"url": f"/uploads/{filename}", "filename": filename}
