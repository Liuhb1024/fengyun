from app.schemas.base import PaginatedResponse, PaginationMeta


def build_paginated_payload(items, total: int, page: int, page_size: int):
    return PaginatedResponse(
        meta=PaginationMeta(total=total, page=page, page_size=page_size),
        items=items,
    ).model_dump()

