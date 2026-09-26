from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import create_access_token, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import LoginRequest, Token, UserOut

router = APIRouter()

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15

_failed_attempts: dict[str, list[datetime]] = {}

def _attempt_key(request: Request, email: str) -> str:
    client = request.client.host if request.client else "unknown"
    return f"{client}:{email.lower()}"

def _prune(key: str, now: datetime) -> list[datetime]:
    window_start = now - timedelta(minutes=LOCKOUT_MINUTES)
    attempts = [a for a in _failed_attempts.get(key, []) if a > window_start]

    if attempts:
        _failed_attempts[key] = attempts
    else:
        _failed_attempts.pop(key, None)

    return attempts

def _register_failure(key: str, now: datetime) -> None:
    attempts = _prune(key, now)
    attempts.append(now)
    _failed_attempts[key] = attempts

@router.post("/login", response_model=Token)
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    key = _attempt_key(request, payload.email)
    attempts = _prune(key, now)

    if len(attempts) >= MAX_FAILED_ATTEMPTS:
        retry_in = LOCKOUT_MINUTES - int((now - attempts[0]).total_seconds() // 60)
        raise HTTPException(
            status_code=429,
            detail=(
                f"Too many failed sign-in attempts. Try again in "
                f"{max(retry_in, 1)} minute(s)."
            ),
        )

    user = db.execute(
        select(User).where(User.email == payload.email)
    ).scalar_one_or_none()

    if not user or not verify_password(payload.password, user.password):
        _register_failure(key, now)
        remaining = MAX_FAILED_ATTEMPTS - len(_failed_attempts.get(key, []))
        suffix = f" {remaining} attempt(s) left." if 0 < remaining <= 2 else ""
        raise HTTPException(
            status_code=401,
            detail=f"Incorrect email or password.{suffix}",
        )

    _failed_attempts.pop(key, None)

    token = create_access_token(subject=str(user.id))
    return Token(access_token=token, user=UserOut.model_validate(user))

@router.get("/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user
