import asyncio
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

from sqlalchemy import delete

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))

from app.db.models import (
    Article,
    Audio,
    Carousel,
    Image,
    Member,
    Navigation,
    OperationLog,
    SEOConfig,
    SystemConfig,
    Video,
)
from app.db.session import async_session


async def seed():
    async with async_session() as session:
        for model in [OperationLog, Carousel, Image, Video, Audio, Article, Member, Navigation, SEOConfig, SystemConfig]:
            await session.execute(delete(model))

        now = datetime.utcnow()

        carousels = [
            Carousel(image_url="https://example.com/carousel1.jpg", title_zh="英歌舞一", sort_order=1),
            Carousel(image_url="https://example.com/carousel2.jpg", title_zh="英歌舞二", sort_order=2),
        ]
        session.add_all(carousels)

        images = [
            Image(
                url="https://example.com/image1.jpg",
                thumbnail_url="https://example.com/thumb1.jpg",
                title_zh="训练瞬间",
                category="训练",
                is_homepage=True,
            ),
            Image(
                url="https://example.com/image2.jpg",
                thumbnail_url="https://example.com/thumb2.jpg",
                title_zh="演出掠影",
                category="演出",
            ),
        ]
        session.add_all(images)

        videos = [
            Video(
                url="https://example.com/video1.mp4",
                cover_url="https://example.com/video1.jpg",
                title_zh="英歌舞介绍",
                category="演出",
                duration=180,
            )
        ]
        session.add_all(videos)

        audios = [
            Audio(
                url="https://example.com/audio1.mp3",
                title_zh="鼓点示范",
                category="音乐",
                duration=60,
            )
        ]
        session.add_all(audios)

        publish_at = now - timedelta(days=1)
        articles = [
            Article(
                title_zh="英歌舞文化溯源",
                content_zh="英歌舞起源于潮汕地区……",
                category="文化",
                cover_url="https://example.com/article1.jpg",
                summary_zh="英歌舞的文化背景介绍",
                is_published=True,
                publish_at=publish_at,
            ),
            Article(
                title_zh="最新演出预告",
                content_zh="本周末将在市中心广场表演……",
                category="演出预告",
                cover_url="https://example.com/article2.jpg",
                summary_zh="演出预告摘要",
                is_published=True,
                publish_at=publish_at,
            ),
        ]
        session.add_all(articles)

        members = [
            Member(
                name_zh="陈师傅",
                position_zh="总教头",
                bio_zh="英歌舞资深教练，负责队伍训练。",
                sort_order=1,
                is_homepage=True,
            ),
            Member(
                name_zh="李队长",
                position_zh="队长",
                bio_zh="负责日常排练与演出统筹。",
                sort_order=2,
            ),
        ]
        session.add_all(members)

        navigation = [
            Navigation(name_zh="首页", name_en="Home", link_url="/", sort_order=1),
            Navigation(name_zh="文化溯源", name_en="Culture", link_url="/culture", sort_order=2),
            Navigation(name_zh="队伍风采", name_en="Team", link_url="/team", sort_order=3),
            Navigation(name_zh="精彩瞬间", name_en="Gallery", link_url="/gallery", sort_order=4),
            Navigation(name_zh="动态资讯", name_en="News", link_url="/news", sort_order=5),
        ]
        session.add_all(navigation)

        seo_configs = [
            SEOConfig(
                page_key="home",
                title_zh="潮汕英歌舞 - 首页",
                description_zh="潮汕英歌舞官方展示平台",
                keywords_zh="英歌舞,潮汕,非遗",
            ),
            SEOConfig(
                page_key="news",
                title_zh="英歌舞资讯",
                description_zh="最新英歌舞资讯与活动预告",
            ),
        ]
        session.add_all(seo_configs)

        system_configs = [
            SystemConfig(
                config_key="home_hero",
                config_value=json.dumps(
                    {
                        "video_url": "https://example.com/hero.mp4",
                        "title_zh": "潮汕英歌舞",
                        "title_en": "Chaoshan Yingge Dance",
                        "subtitle_zh": "匠心传承 · 非遗风采",
                        "subtitle_en": "Heritage in Motion",
                        "cta_text_zh": "了解更多",
                        "cta_link": "/culture",
                    },
                    ensure_ascii=False,
                ),
            ),
            SystemConfig(
                config_key="home_stats",
                config_value=json.dumps(
                    {"founded_year": 1990, "members": 60, "performances": 300},
                    ensure_ascii=False,
                ),
            ),
        ]
        session.add_all(system_configs)

        await session.commit()
        print("Demo data seeded successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
