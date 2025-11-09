from pydantic import BaseModel, Field


class ContactInfo(BaseModel):
    title: str = Field(default="预约演出 / 合作洽谈", max_length=200)
    description: str = Field(
        default="支持巡演、品牌定制演出、沉浸式发布会以及非遗研学课程，欢迎联系团队获取方案。",
        max_length=1000,
    )
    phone: str | None = Field(default="+86 138 0000 0000", max_length=50)
    email: str | None = Field(default="heritage@yingge.com", max_length=100)
    wechat: str | None = Field(default=None, max_length=100)
    locations: list[str] = Field(default_factory=lambda: ["汕头", "深圳", "上海", "全球巡演"])
    tags: list[str] = Field(default_factory=lambda: ["品牌共创", "国际巡演", "教育工作坊", "沉浸体验"])
    cta_text: str = Field(default="立即联系", max_length=50)
    cta_link: str | None = Field(default="mailto:heritage@yingge.com", max_length=200)
