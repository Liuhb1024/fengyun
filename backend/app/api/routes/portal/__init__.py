from fastapi import APIRouter

from . import articles, contact, gallery, home, members, milestones, navigation, seo, stats, videos

router = APIRouter(prefix="/portal")

router.include_router(home.router, tags=["Portal Home"])
router.include_router(gallery.router, prefix="/images", tags=["Portal Images"])
router.include_router(videos.router, prefix="/videos", tags=["Portal Videos"])
router.include_router(articles.router, prefix="/articles", tags=["Portal Articles"])
router.include_router(members.router, prefix="/members", tags=["Portal Members"])
router.include_router(navigation.router, prefix="/navigation", tags=["Portal Navigation"])
router.include_router(seo.router, prefix="/seo", tags=["Portal SEO"])
router.include_router(stats.router, prefix="/stats", tags=["Portal Stats"])
router.include_router(contact.router, prefix="/contact", tags=["Portal Contact"])
router.include_router(milestones.router, prefix="/milestones", tags=["Portal Milestones"])
