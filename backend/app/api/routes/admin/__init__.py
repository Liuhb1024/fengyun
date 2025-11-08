from fastapi import APIRouter

from . import (
    admin_users,
    article,
    audio,
    auth,
    carousel,
    image,
    logs,
    member,
    navigation,
    seo,
    stats,
    system,
    upload,
    video,
)

router = APIRouter(prefix="/admin")

router.include_router(auth.router, prefix="/auth", tags=["Admin Auth"])
router.include_router(carousel.router, prefix="/carousels", tags=["Carousel"])
router.include_router(image.router, prefix="/images", tags=["Images"])
router.include_router(video.router, prefix="/videos", tags=["Videos"])
router.include_router(audio.router, prefix="/audios", tags=["Audios"])
router.include_router(article.router, prefix="/articles", tags=["Articles"])
router.include_router(member.router, prefix="/members", tags=["Members"])
router.include_router(admin_users.router, prefix="/users", tags=["Admin Users"])
router.include_router(navigation.router, prefix="/navigation", tags=["Navigation"])
router.include_router(seo.router, prefix="/seo", tags=["SEO"])
router.include_router(system.router, prefix="/system", tags=["System Config"])
router.include_router(upload.router, prefix="/upload", tags=["Upload"])
router.include_router(stats.router, prefix="/stats", tags=["Statistics"])
router.include_router(logs.router, prefix="/logs", tags=["Operation Logs"])
