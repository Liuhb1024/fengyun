from pydantic import BaseModel


class UploadResponse(BaseModel):
    url: str
    thumbnail_url: str | None = None
    file_size: int | None = None
    width: int | None = None
    height: int | None = None

