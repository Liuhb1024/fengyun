from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import SessionDep, get_current_admin
from app.core.responses import SuccessResponse
from app.db.models import Admin, Navigation
from app.schemas.navigation import NavigationCreate, NavigationOut, NavigationTree, NavigationUpdate
from app.services.crud_entities import navigation_crud
from app.services.operation_log import record_operation

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="导航列表")
async def list_navigation(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    items, _ = await navigation_crud.get_multi(
        session, page=1, page_size=999, filters={}, order_by=Navigation.sort_order.asc()
    )
    return [NavigationOut.model_validate(item).model_dump() for item in items]


@router.get("/tree", response_class=SuccessResponse, summary="导航树")
async def navigation_tree(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    items, _ = await navigation_crud.get_multi(
        session, page=1, page_size=999, filters={}, order_by=Navigation.sort_order.asc()
    )
    nodes = [NavigationTree.model_validate(item).model_dump() for item in items]
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


@router.post("", response_class=SuccessResponse, summary="新增导航")
async def create_navigation(
    payload: NavigationCreate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    item = await navigation_crud.create(session, payload)
    await record_operation(session, admin_id=current_admin.id, module="navigation", action="create", content=item.id)
    await session.commit()
    return NavigationOut.model_validate(item).model_dump()


@router.put("/{nav_id}", response_class=SuccessResponse, summary="更新导航")
async def update_navigation(
    nav_id: int,
    payload: NavigationUpdate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    db_obj = await navigation_crud.get(session, nav_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="导航不存在")
    item = await navigation_crud.update(session, db_obj, payload)
    await record_operation(session, admin_id=current_admin.id, module="navigation", action="update", content=item.id)
    await session.commit()
    return NavigationOut.model_validate(item).model_dump()


@router.delete("/{nav_id}", response_class=SuccessResponse, summary="删除导航")
async def delete_navigation(
    nav_id: int,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    await navigation_crud.delete(session, nav_id)
    await record_operation(session, admin_id=current_admin.id, module="navigation", action="delete", content=nav_id)
    await session.commit()
    return {"message": "删除成功"}

