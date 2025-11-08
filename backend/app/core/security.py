"""Hashing utilities and JWT helpers."""

from datetime import datetime, timedelta, timezone
from uuid import uuid4

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.schemas.auth import TokenPayload

try:  # pragma: no cover - defensive patch for older bcrypt builds
    import bcrypt as _bcrypt  # type: ignore
except ImportError:  # pragma: no cover
    _bcrypt = None
else:  # pragma: no cover
    if _bcrypt is not None and not hasattr(_bcrypt, "__about__"):
        class _About:
            __version__ = getattr(_bcrypt, "__version__", "unknown")

        _bcrypt.__about__ = _About()  # type: ignore[attr-defined]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(subject: str, expires_minutes: int | None = None) -> tuple[str, datetime, str]:
    expire_minutes = expires_minutes or settings.jwt_expire_minutes
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)
    jti = uuid4().hex
    to_encode = {"exp": expires_at, "sub": subject, "jti": jti}
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return encoded_jwt, expires_at, jti


def decode_token(token: str) -> TokenPayload:
    payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    return TokenPayload(**payload)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
