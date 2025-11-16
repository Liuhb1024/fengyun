from __future__ import annotations

import mimetypes
import re
from datetime import datetime
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from qcloud_cos import CosConfig, CosS3Client  # type: ignore

from app.core.config import settings

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "storage"
SAFE_CATEGORY = re.compile(r"^[a-zA-Z0-9][a-zA-Z0-9_-]{0,30}$")
MAX_SIZE_BYTES = {
    "avatars": 10 * 1024 * 1024,
    "carousels": 15 * 1024 * 1024,
    "images": 20 * 1024 * 1024,
    "videos": 500 * 1024 * 1024,
    "audios": 100 * 1024 * 1024,
    "general": 50 * 1024 * 1024,
}
ACCEPT_MIME_PREFIX = {
    "avatars": ("image/",),
    "carousels": ("image/",),
    "images": ("image/",),
    # 视频封面通常是图片，这里允许 video/ 和 image/ 两种前缀
    "videos": ("video/", "image/"),
    "audios": ("audio/",),
}

_cos_client: CosS3Client | None = None


def _ensure_local_dir() -> None:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def _get_cos_client() -> CosS3Client | None:
    global _cos_client
    if _cos_client is not None:
        return _cos_client
    if not (
        settings.cos_secret_id
        and settings.cos_secret_key
        and settings.cos_bucket
        and settings.cos_region
    ):
        return None
    config = CosConfig(
        Region=settings.cos_region,
        SecretId=settings.cos_secret_id,
        SecretKey=settings.cos_secret_key,
        Token=None,
        Scheme="https",
    )
    _cos_client = CosS3Client(config)
    return _cos_client


def _sanitize_category(category: str | None) -> str:
    if not category:
        return "general"
    category = category.strip().lower()
    if not SAFE_CATEGORY.match(category):
        return "general"
    return category


def _build_object_key(category: str, filename: str) -> str:
    suffix = ""
    if "." in filename:
        suffix = filename.rsplit(".", 1)[-1]
        suffix = f".{suffix.lower()}"
    else:
        guessed = mimetypes.guess_extension(filename)
        if guessed:
            suffix = guessed
    date_prefix = datetime.utcnow().strftime("%Y/%m/%d")
    return f"{category}/{date_prefix}/{uuid4().hex}{suffix}"


async def save_file(file: UploadFile, category: str | None = None) -> dict[str, Any]:
    category_name = _sanitize_category(category)
    content = await file.read()
    max_size = MAX_SIZE_BYTES.get(category_name, MAX_SIZE_BYTES["general"])
    if max_size and len(content) > max_size:
        readable = f"{max_size / (1024 * 1024):.0f}MB"
        raise HTTPException(status_code=400, detail=f"文件尺寸超出限制（<= {readable}）")

    mime_prefix = ACCEPT_MIME_PREFIX.get(category_name)
    if mime_prefix and file.content_type:
        if not any(file.content_type.startswith(prefix) for prefix in mime_prefix):
            raise HTTPException(status_code=400, detail="文件类型不支持，请选择正确的格式")

    client = _get_cos_client()
    if client:
        object_key = _build_object_key(category_name, file.filename)
        client.put_object(
            Bucket=settings.cos_bucket,
            Body=content,
            Key=object_key,
        )
        base_url = (
            settings.cos_public_domain.rstrip("/")
            if settings.cos_public_domain
            else f"https://{settings.cos_bucket}.cos.{settings.cos_region}.myqcloud.com"
        )
        return {
            "url": f"{base_url}/{object_key}",
            "thumbnail_url": None,
            "file_size": len(content),
        }

    # fallback to local storage
    _ensure_local_dir()
    category_dir = UPLOAD_DIR / category_name
    category_dir.mkdir(parents=True, exist_ok=True)
    filename = file.filename or f"{uuid4().hex}.bin"
    file_path = category_dir / filename
    with open(file_path, "wb") as f:
        f.write(content)
    return {
        "url": f"/static/uploads/{category_name}/{filename}",
        "thumbnail_url": None,
        "file_size": len(content),
    }
