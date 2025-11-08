"""
Comprehensive smoke tests for admin & portal APIs using the in-process ASGI app.
Run after seeding data: `python scripts/api_smoke_test.py`
"""

import asyncio
import io
import sys
import uuid
from pathlib import Path
from typing import Any, Dict, List

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))

from httpx import ASGITransport, AsyncClient

from app.db.session import engine
from app.main import app

API_PREFIX = "/api/v1"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123456"
TEMP_PASSWORD = "TempPass123!"


class SmokeTestError(RuntimeError):
    pass


class APISmokeTester:
    def __init__(self) -> None:
        self.transport = ASGITransport(app=app, raise_app_exceptions=True)
        self.results: List[str] = []
        self.client: AsyncClient | None = None
        self.admin_token: str | None = None

    async def __aenter__(self) -> "APISmokeTester":
        self.client = AsyncClient(transport=self.transport, base_url="http://test")
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        if self.client:
            await self.client.aclose()

    async def request(self, method: str, path: str, expected: int = 200, **kwargs) -> Dict[str, Any] | None:
        if not self.client:
            raise SmokeTestError("Client not initialized")
        resp = await self.client.request(method, f"{API_PREFIX}{path}", **kwargs)
        if resp.status_code != expected:
            raise SmokeTestError(f"{method} {path} expected {expected}, got {resp.status_code}: {resp.text}")
        if resp.headers.get("content-type", "").startswith("application/json"):
            return resp.json()
        return None

    def auth_headers(self, token: str | None = None) -> Dict[str, str]:
        token = token or self.admin_token
        if not token:
            raise SmokeTestError("Missing admin token")
        return {"Authorization": f"Bearer {token}"}

    async def login(self, username: str, password: str) -> Dict[str, Any]:
        data = await self.request(
            "post",
            "/admin/auth/login",
            json={"username": username, "password": password},
        )
        assert data
        token = data["data"]["access_token"]
        self.admin_token = token
        self.results.append("Login success")
        return data["data"]

    async def test_auth_flow(self) -> None:
        await self.login(ADMIN_USERNAME, ADMIN_PASSWORD)
        await self.request("get", "/admin/auth/me", headers=self.auth_headers())
        self.results.append("Auth me OK")

        await self.request(
            "post",
            "/admin/auth/change-password",
            headers=self.auth_headers(),
            json={"old_password": ADMIN_PASSWORD, "new_password": TEMP_PASSWORD},
        )
        self.results.append("Password changed to temp")

        await self.login(ADMIN_USERNAME, TEMP_PASSWORD)
        await self.request(
            "post",
            "/admin/auth/change-password",
            headers=self.auth_headers(),
            json={"old_password": TEMP_PASSWORD, "new_password": ADMIN_PASSWORD},
        )
        self.results.append("Password reverted")

        await self.login(ADMIN_USERNAME, ADMIN_PASSWORD)
        await self.request("post", "/admin/auth/logout", headers=self.auth_headers())
        self.results.append("Logout OK")

        await self.login(ADMIN_USERNAME, ADMIN_PASSWORD)

    async def test_crud_endpoints(self) -> None:
        headers = self.auth_headers()
        uid = uuid.uuid4().hex

        # Carousel
        carousel = await self.request(
            "post",
            "/admin/carousels",
            headers=headers,
            json={"image_url": f"https://example.com/{uid}.jpg", "title_zh": "Test Carousel"},
        )
        cid = carousel["data"]["id"]
        await self.request("put", f"/admin/carousels/{cid}", headers=headers, json={"title_zh": "Updated"})
        await self.request("delete", f"/admin/carousels/{cid}", headers=headers)

        # Images
        image = await self.request(
            "post",
            "/admin/images",
            headers=headers,
            json={
                "url": f"https://example.com/{uid}.png",
                "thumbnail_url": f"https://example.com/{uid}_thumb.png",
                "title_zh": "测试图片",
            },
        )
        image_id = image["data"]["id"]
        await self.request("put", f"/admin/images/{image_id}", headers=headers, json={"title_zh": "更新图片"})
        await self.request("delete", f"/admin/images/{image_id}", headers=headers)

        # Videos
        video = await self.request(
            "post",
            "/admin/videos",
            headers=headers,
            json={"url": f"https://example.com/{uid}.mp4", "title_zh": "测试视频"},
        )
        vid = video["data"]["id"]
        await self.request("put", f"/admin/videos/{vid}", headers=headers, json={"title_zh": "更新视频"})
        await self.request("delete", f"/admin/videos/{vid}", headers=headers)

        # Audios
        audio = await self.request(
            "post",
            "/admin/audios",
            headers=headers,
            json={"url": f"https://example.com/{uid}.mp3", "title_zh": "测试音频"},
        )
        aid = audio["data"]["id"]
        await self.request("put", f"/admin/audios/{aid}", headers=headers, json={"title_zh": "更新音频"})
        await self.request("delete", f"/admin/audios/{aid}", headers=headers)

        # Articles
        article = await self.request(
            "post",
            "/admin/articles",
            headers=headers,
            json={"title_zh": "测试文章", "content_zh": "正文内容", "category": "资讯"},
        )
        article_id = article["data"]["id"]
        await self.request("get", f"/admin/articles/{article_id}", headers=headers)
        await self.request("put", f"/admin/articles/{article_id}", headers=headers, json={"summary_zh": "更新摘要"})
        await self.request("post", f"/admin/articles/{article_id}/publish", headers=headers)
        await self.request("delete", f"/admin/articles/{article_id}", headers=headers)

        # Members
        member = await self.request(
            "post",
            "/admin/members",
            headers=headers,
            json={"name_zh": "测试成员", "position_zh": "鼓手"},
        )
        mid = member["data"]["id"]
        await self.request("put", f"/admin/members/{mid}", headers=headers, json={"bio_zh": "更新简介"})
        await self.request("delete", f"/admin/members/{mid}", headers=headers)

        # Navigation
        nav = await self.request(
            "post",
            "/admin/navigation",
            headers=headers,
            json={"name_zh": "测试导航", "link_url": "/test", "sort_order": 99},
        )
        nid = nav["data"]["id"]
        await self.request("get", "/admin/navigation", headers=headers)
        await self.request("get", "/admin/navigation/tree", headers=headers)
        await self.request("put", f"/admin/navigation/{nid}", headers=headers, json={"name_zh": "更新导航"})
        await self.request("delete", f"/admin/navigation/{nid}", headers=headers)

        # SEO
        seo = await self.request(
            "post",
            "/admin/seo",
            headers=headers,
            json={"page_key": f"page_{uid}", "title_zh": "测试SEO"},
        )
        seo_id = seo["data"]["id"]
        await self.request("put", f"/admin/seo/{seo_id}", headers=headers, json={"description_zh": "更新描述"})
        await self.request("delete", f"/admin/seo/{seo_id}", headers=headers)

        # System config
        await self.request("get", "/admin/system/config", headers=headers)
        await self.request("put", "/admin/system/config/site_info", headers=headers, json={"config_value": '{"name":"英歌舞"}'})
        await self.request("get", "/admin/system/config/site_info", headers=headers)

        # Upload
        file_data = io.BytesIO(b"fake image data")
        await self.request(
            "post",
            "/admin/upload",
            headers=headers,
            files={"file": ("test.jpg", file_data, "image/jpeg")},
        )

        # Stats & logs
        await self.request("get", "/admin/stats/overview", headers=headers)
        await self.request("get", "/admin/stats/visits?days=3", headers=headers)
        await self.request("get", "/admin/stats/content-hot?type=article", headers=headers)
        await self.request("get", "/admin/logs/operations", headers=headers)

        self.results.append("Admin CRUD endpoints validated")

    async def test_portal_endpoints(self) -> None:
        # Fetch lists to get IDs
        portal_client = self.client
        if portal_client is None:
            raise SmokeTestError("Client missing")

        def data(resp):
            assert resp
            return resp["data"]

        home = await self.request("get", "/portal/home/config")
        assert data(home)["hero"]
        await self.request("get", "/portal/home/latest-news")

        images = data(await self.request("get", "/portal/images"))
        if images["items"]:
            image_id = images["items"][0]["id"]
            await self.request("get", f"/portal/images/{image_id}")

        videos = data(await self.request("get", "/portal/videos"))
        if videos["items"]:
            video_id = videos["items"][0]["id"]
            await self.request("get", f"/portal/videos/{video_id}")

        articles = data(await self.request("get", "/portal/articles"))
        if articles["items"]:
            article_id = articles["items"][0]["id"]
            await self.request("get", f"/portal/articles/{article_id}")

        await self.request("get", "/portal/members")
        await self.request("get", "/portal/navigation")
        await self.request("get", "/portal/seo/home")
        await self.request(
            "post",
            "/portal/stats/visit",
            json={"page_url": "/portal-test", "referer": "https://example.com"},
        )

        self.results.append("Portal endpoints validated")

    async def run(self) -> None:
        async with self:
            await self.test_auth_flow()
            await self.test_crud_endpoints()
            await self.test_portal_endpoints()

        await engine.dispose()

        print("All API smoke tests passed:")
        for item in self.results:
            print(f"- {item}")


if __name__ == "__main__":
    try:
        asyncio.run(APISmokeTester().run())
    except Exception as exc:  # pragma: no cover
        print(f"API smoke tests failed: {exc}", file=sys.stderr)
        raise
