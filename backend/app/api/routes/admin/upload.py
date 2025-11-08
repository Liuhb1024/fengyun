from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.api.deps import get_current_admin
from app.core.responses import SuccessResponse
from app.db.models import Admin
from app.schemas.upload import UploadResponse
from app.services.upload import save_file

router = APIRouter()


@router.post("", response_class=SuccessResponse, summary="上传文件")
async def upload_file(
    category: str = Form("general"),
    file: UploadFile = File(...),
    current_admin: Admin = Depends(get_current_admin),
) -> dict[str, object]:
    saved = await save_file(file, category=category)
    return UploadResponse(**saved).model_dump()
