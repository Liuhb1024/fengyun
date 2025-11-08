"""Custom response helpers."""

from fastapi.responses import ORJSONResponse


class SuccessResponse(ORJSONResponse):
    """统一格式成功响应。"""

    def __init__(
        self,
        data: object | None = None,
        message: str = "success",
        status_code: int = 200,
        content: object | None = None,
        **kwargs,
    ):
        payload = content if content is not None else data
        super().__init__(
            content={"code": status_code, "message": message, "data": payload},
            status_code=status_code,
            **kwargs,
        )


class ErrorResponse(ORJSONResponse):
    """统一格式失败响应。"""

    def __init__(
        self,
        message: str,
        status_code: int = 400,
        content: object | None = None,
        **kwargs,
    ):
        payload = content if content is not None else None
        super().__init__(
            content={"code": status_code, "message": message, "data": payload},
            status_code=status_code,
            **kwargs,
        )
