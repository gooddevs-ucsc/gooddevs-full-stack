from collections.abc import Generator
from typing import Annotated, Optional

import jwt
from fastapi import Depends, HTTPException, status, Request, Cookie
from fastapi.security import OAuth2PasswordBearer, HTTPBearer
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
from sqlmodel import Session

from app.core import security
from app.core.config import settings
from app.core.db import engine
from app.models import TokenPayload, User

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token",
    auto_error=False  # Don't auto-error so we can check cookies
)


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[Optional[str], Depends(reusable_oauth2)]

# TODO: For now, I added coockie based authentication on top of using Autherization header.
# Once all login endpoints are migrated to use the new cookie based authentication,
# we can remove Authorization header based authentication.


def get_token_from_cookie_or_header(
    request: Request,
    authorization_token: TokenDep,
    access_token: Optional[str] = Cookie(default=None),
) -> str:
    """
    Get token from either cookie or Authorization header.
    Priority: Authorization header > Cookie
    """
    # First try to get token from Authorization header
    if authorization_token:
        return authorization_token

    # If no Authorization header, try cookie
    if access_token:
        return access_token

    # If neither is available, raise an exception
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
        headers={"WWW-Authenticate": "Bearer"},
    )


TokenFromCookieOrHeader = Annotated[str,
                                    Depends(get_token_from_cookie_or_header)]


def get_current_user(session: SessionDep, token: TokenFromCookieOrHeader) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = session.get(User, token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_current_active_superuser(current_user: CurrentUser) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user
