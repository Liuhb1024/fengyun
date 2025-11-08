from app.db.models import (
    Article,
    Audio,
    Carousel,
    Image,
    Member,
    Navigation,
    SEOConfig,
    SystemConfig,
    Video,
)
from app.schemas.article import ArticleCreate, ArticleUpdate
from app.schemas.audio import AudioCreate, AudioUpdate
from app.schemas.carousel import CarouselCreate, CarouselUpdate
from app.schemas.image import ImageCreate, ImageUpdate
from app.schemas.member import MemberCreate, MemberUpdate
from app.schemas.navigation import NavigationCreate, NavigationUpdate
from app.schemas.seo import SEOConfigCreate, SEOConfigUpdate
from app.schemas.system_config import SystemConfigCreate, SystemConfigUpdate
from app.schemas.video import VideoCreate, VideoUpdate
from app.services.crud_base import CRUDBase

carousel_crud = CRUDBase[Carousel, CarouselCreate, CarouselUpdate](Carousel)
image_crud = CRUDBase[Image, ImageCreate, ImageUpdate](Image)
video_crud = CRUDBase[Video, VideoCreate, VideoUpdate](Video)
audio_crud = CRUDBase[Audio, AudioCreate, AudioUpdate](Audio)
article_crud = CRUDBase[Article, ArticleCreate, ArticleUpdate](Article)
member_crud = CRUDBase[Member, MemberCreate, MemberUpdate](Member)
navigation_crud = CRUDBase[Navigation, NavigationCreate, NavigationUpdate](Navigation)
seo_crud = CRUDBase[SEOConfig, SEOConfigCreate, SEOConfigUpdate](SEOConfig)
system_config_crud = CRUDBase[SystemConfig, SystemConfigCreate, SystemConfigUpdate](SystemConfig)

