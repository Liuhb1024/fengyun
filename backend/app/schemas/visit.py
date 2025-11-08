from pydantic import BaseModel, Field


class VisitCreate(BaseModel):
    page_url: str = Field(..., max_length=500)
    referer: str | None = Field(None, max_length=500)
    user_agent: str | None = Field(None, max_length=500)
    device_type: str | None = Field(None, max_length=20)
    browser: str | None = Field(None, max_length=50)
    os: str | None = Field(None, max_length=50)
    region: str | None = Field(None, max_length=100)

