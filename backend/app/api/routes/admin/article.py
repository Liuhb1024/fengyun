from datetime import datetime, timedelta, timezone
from io import BytesIO

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
from sqlalchemy import func, select
import asyncio
import httpx
import re
from html import unescape
from pydantic import AnyHttpUrl

from app.api.deps import SessionDep, get_current_admin
from app.core.pagination import build_paginated_payload
from app.core.responses import SuccessResponse
from app.db.models import Admin, Article
from app.schemas.article import ArticleCreate, ArticleOut, ArticleUpdate
from app.services.crud_entities import article_crud
from app.services.operation_log import record_operation
from app.services.upload import save_file

router = APIRouter()


def _normalize_tags(tags: list[str] | None) -> list[str]:
    if not tags:
        return []
    cleaned = [tag.strip() for tag in tags if tag and tag.strip()]
    # dict.fromkeys preserves order while removing duplicates
    return list(dict.fromkeys(cleaned))


@router.get("", response_class=SuccessResponse, summary="Article list")
async def list_articles(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
    page: int = 1,
    page_size: int = 10,
    category: str | None = None,
    is_published: bool | None = None,
    tag: str | None = Query(default=None, description="Filter by tag value"),
):
    stmt = select(Article)
    if category is not None:
        stmt = stmt.where(Article.category == category)
    if is_published is not None:
        stmt = stmt.where(Article.is_published.is_(is_published))
    if tag:
        stmt = stmt.where(Article.tags.contains([tag]))
    total_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await session.execute(total_stmt)).scalar_one() or 0
    stmt = (
        stmt.order_by(Article.publish_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await session.execute(stmt)
    items = result.scalars().all()
    payload = build_paginated_payload(
        [ArticleOut.model_validate(item) for item in items],
        total,
        page,
        page_size,
    )
    return payload


@router.post("", response_class=SuccessResponse, summary="Create article")
async def create_article(
    payload: ArticleCreate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    normalized = payload.model_copy(
        update={
            "tags": _normalize_tags(payload.tags),
            "content_format": payload.content_format or "html",
        }
    )
    if normalized.is_published and not normalized.publish_at:
        normalized = normalized.model_copy(update={"publish_at": datetime.now(timezone.utc)})
    item = await article_crud.create(session, normalized)
    await record_operation(
        session, admin_id=current_admin.id, module="article", action="create", content=item.id
    )
    await session.commit()
    return ArticleOut.model_validate(item).model_dump()


@router.get("/tags", response_class=SuccessResponse, summary="Article tag suggestions")
async def list_article_tags(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
) -> dict[str, list[str]]:
    stmt = select(Article.tags)
    result = await session.execute(stmt)
    tags: set[str] = set()
    for value in result.scalars().all():
        if not value:
            continue
        for tag in value:
            if tag:
                tags.add(tag)
    return {"items": sorted(tags)}


@router.get("/{article_id}", response_class=SuccessResponse, summary="Article detail")
async def get_article(
    article_id: int,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    item = await article_crud.get(session, article_id)
    if not item:
        raise HTTPException(status_code=404, detail="Article not found")
    return ArticleOut.model_validate(item).model_dump()


@router.put("/{article_id}", response_class=SuccessResponse, summary="Update article")
async def update_article(
    article_id: int,
    payload: ArticleUpdate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    db_obj = await article_crud.get(session, article_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Article not found")
    updates = payload.model_dump(exclude_unset=True)
    if "tags" in updates:
        updates["tags"] = _normalize_tags(updates.get("tags"))
    if "content_format" in updates and not updates.get("content_format"):
        updates.pop("content_format")
    if updates.get("is_published") and not updates.get("publish_at") and not db_obj.publish_at:
        updates["publish_at"] = datetime.now(timezone.utc)
    item = await article_crud.update(session, db_obj, updates)
    await record_operation(
        session, admin_id=current_admin.id, module="article", action="update", content=item.id
    )
    await session.commit()
    return ArticleOut.model_validate(item).model_dump()


@router.delete("/{article_id}", response_class=SuccessResponse, summary="Delete article")
async def delete_article(
    article_id: int,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    await article_crud.delete(session, article_id)
    await record_operation(
        session, admin_id=current_admin.id, module="article", action="delete", content=article_id
    )
    await session.commit()
    return {"message": "Deleted"}


@router.post("/{article_id}/publish", response_class=SuccessResponse, summary="Publish article")
async def publish_article(
    article_id: int,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    db_obj = await article_crud.get(session, article_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Article not found")
    db_obj.is_published = True
    if not db_obj.publish_at:
        db_obj.publish_at = datetime.now(timezone.utc)
    await record_operation(
        session, admin_id=current_admin.id, module="article", action="publish", content=article_id
    )
    await session.commit()
    return {"message": "Published"}


@router.post("/import-wechat", response_class=SuccessResponse, summary="Import WeChat article")
async def import_wechat_article(
    url: AnyHttpUrl,
    current_admin: Admin = Depends(get_current_admin),
) -> dict[str, object]:
    headers = _wechat_headers()
    try:
        resp = await _fetch_wechat(url, headers=headers)
    except httpx.HTTPStatusError as exc:
        detail = (
            f"获取文章失败，状态码 {exc.response.status_code}，"
            "可能是访问受限/需登录或链接失效；请稍后重试或手动粘贴内容"
        )
        raise HTTPException(status_code=400, detail=detail) from exc
    except httpx.HTTPError as exc:  # pragma: no cover - runtime network errors
        raise HTTPException(status_code=400, detail=f"获取文章失败: {exc}") from exc

    html = resp.text
    parsed = _parse_wechat_html(html)
    if not parsed.get("title_zh"):
        parsed["title_zh"] = resp.headers.get("wechat-title") or "微信文章"
    parsed["content_format"] = "html"
    publish_at = parsed.get("publish_at")
    if publish_at:
        parsed["publish_at"] = publish_at.isoformat()

    # 下载封面并保存到存储，避免防盗链
    if parsed.get("cover_url"):
        uploaded = await _download_and_store_image(parsed["cover_url"])
        if uploaded:
            parsed["cover_url"] = uploaded

    # 替换正文内图片到本地/COS，规避防盗链
    if parsed.get("content_zh"):
        parsed["content_zh"] = await _rewrite_content_images(parsed["content_zh"])

    return parsed


def _wechat_headers() -> dict[str, str]:
    return {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
        ),
        "Referer": "https://mp.weixin.qq.com/",
    }


def _parse_wechat_html(html: str) -> dict[str, object]:
    """Best-effort parse for WeChat article HTML."""
    def find_meta(keys: list[str]) -> str | None:
        for key in keys:
            pattern = rf'<meta[^>]+(?:name|property)=["\']{re.escape(key)}["\'][^>]+content=["\']([^"\']+)["\']'
            match = re.search(pattern, html, re.IGNORECASE)
            if match:
                return unescape(match.group(1).strip())
        return None

    title = find_meta(["og:title", "title"])
    if not title:
        title_match = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
        title = unescape(title_match.group(1).strip()) if title_match else None

    cover = find_meta(["og:image"])
    summary = find_meta(["description", "og:description"])
    publish_at = _parse_wechat_publish_time(html)

    content_match = re.search(
        r'<div[^>]+id=["\']js_content["\'][^>]*>(.*?)</div>',
        html,
        re.IGNORECASE | re.DOTALL,
    )
    content_html = content_match.group(1).strip() if content_match else ""
    # 兼容微信 data-src -> src，防止图片不显示
    content_html = re.sub(r'data-src=(["\'])(.*?)\1', r'src="\2"', content_html)

    return {
        "title_zh": title,
        "cover_url": cover,
        "summary_zh": summary,
        "content_zh": content_html or None,
        "publish_at": publish_at,
    }


def _parse_wechat_publish_time(html: str) -> datetime | None:
    # 1) 直接的时间字符串
    time_match = re.search(
        r'publish_time\s*=\s*"(?P<ts>\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})"',
        html,
        re.IGNORECASE,
    )
    if time_match:
        ts_str = time_match.group("ts")
        try:
            dt_local = datetime.strptime(ts_str, "%Y-%m-%d %H:%M:%S")
            # 微信时间通常为北京时间，转换为 UTC
            dt_local = dt_local.replace(tzinfo=timezone(timedelta(hours=8)))
            return dt_local.astimezone(timezone.utc)
        except ValueError:
            pass

    # 2) ct 字段的时间戳（秒）
    ct_match = re.search(r'ct\s*=\s*"(?P<ct>\d{10})"', html)
    if ct_match:
        try:
            ct = int(ct_match.group("ct"))
            return datetime.fromtimestamp(ct, tz=timezone.utc)
        except ValueError:
            return None
    return None


async def _download_and_store_image(url: str, client: httpx.AsyncClient | None = None) -> str | None:
    url = _clean_image_url(url)
    if not url.startswith("http"):
        return None
    headers = _wechat_headers()
    try:
        close_client = False
        if client is None:
            client = httpx.AsyncClient(timeout=10, headers=headers, follow_redirects=True)
            close_client = True
        resp = await client.get(url, timeout=10)
        resp.raise_for_status()
        content_type = resp.headers.get("Content-Type", "image/jpeg")
        filename = url.split("/")[-1] or "cover.jpg"
        upload_file = UploadFile(filename=filename, file=BytesIO(resp.content), headers={"content-type": content_type})
        saved = await save_file(upload_file, category="articles")
        return saved.get("url")
    except Exception:
        return None
    finally:
        if close_client:
            await client.aclose()


def _extract_image_urls(html: str) -> set[str]:
    raw = unescape(html)
    raw = raw.replace("\\\\", "\\")
    urls: set[str] = set()
    # img data-src / src
    for match in re.finditer(r'(?:data-src|src)=["\'](https?://[^"\']+)["\']', raw, re.IGNORECASE):
        urls.add(match.group(1))
    # CSS background-image: url(...)
    for match in re.finditer(r'url\(\s*["\']?(https?://[^)"\']+)["\']?\s*\)', raw, re.IGNORECASE):
        urls.add(match.group(1))
    return urls


async def _rewrite_content_images(html: str) -> str:
    urls = _extract_image_urls(html)
    if not urls:
        return html
    replacements: dict[str, str] = {}
    cleaned_urls = {_clean_image_url(u) for u in urls}
    async with httpx.AsyncClient(
        timeout=10,
        headers=_wechat_headers(),
        follow_redirects=True,
    ) as client:
        sem = asyncio.Semaphore(3)

        async def worker(raw_url: str) -> None:
            async with sem:
                new_url = await _retry_download(raw_url, client=client)
                if new_url:
                    replacements[raw_url] = new_url

        await asyncio.gather(*[worker(u) for u in cleaned_urls])

    replaced = html
    for original in urls:
        cleaned = _clean_image_url(original)
        new_url = replacements.get(cleaned) or replacements.get(original)
        if not new_url:
            continue
        replaced = replaced.replace(original, new_url)
        escaped = original.replace("&", "&amp;").replace('"', "&quot;").replace("'", "&#39;")
        replaced = replaced.replace(escaped, new_url)
        if cleaned != original:
            replaced = replaced.replace(cleaned, new_url)
        css_escaped = original.replace('"', '\\"').replace("'", "\\'")
        replaced = replaced.replace(css_escaped, new_url)
    return replaced


def _clean_image_url(url: str) -> str:
    cleaned = unescape(url).strip()
    cleaned = cleaned.strip('"').strip("'")
    cleaned = cleaned.replace("&amp;", "&")
    # 部分微信参数后带 &from=appmsg 等，可直接保留，若结尾有 &quot 等已去除
    return cleaned


async def _fetch_wechat(url: AnyHttpUrl | str, headers: dict[str, str]) -> httpx.Response:
    client = httpx.AsyncClient(timeout=10, headers=headers, follow_redirects=True)
    try:
        resp = await client.get(str(url))
        resp.raise_for_status()
        return resp
    finally:
        await client.aclose()


async def _retry_download(url: str, client: httpx.AsyncClient) -> str | None:
    backoffs = [0, 1.5, 3.0]
    for delay in backoffs:
        if delay:
            await asyncio.sleep(delay)
        result = await _download_and_store_image(url, client=client)
        if result:
            return result
    return None
