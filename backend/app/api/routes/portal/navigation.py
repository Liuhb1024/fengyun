from fastapi import APIRouter
from sqlalchemy import select

from app.api.deps import SessionDep
from app.core.responses import SuccessResponse
from app.db.models import Navigation
from app.schemas.navigation import NavigationTree

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="门户导航")
async def portal_navigation(session: SessionDep):
    stmt = (
        select(Navigation)
        .where(Navigation.is_visible.is_(True))
        .order_by(Navigation.parent_id.asc(), Navigation.sort_order.asc())
    )
    result = await session.execute(stmt)
    nodes = [NavigationTree.model_validate(item).model_dump() for item in result.scalars().all()]
    tree = []
    node_map = {node["id"]: node for node in nodes}
    for node in nodes:
        node.setdefault("children", [])
        parent_id = node["parent_id"]
        if parent_id and parent_id in node_map:
            node_map[parent_id]["children"].append(node)
        else:
            tree.append(node)
    return tree

