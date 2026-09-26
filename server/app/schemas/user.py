import re
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

Role = Literal["user", "owner", "admin"]

NAME_MIN = 2
NAME_MAX = 60
PASSWORD_MIN = 8
PASSWORD_MAX = 64
PHONE_MIN_DIGITS = 7
PHONE_MAX_DIGITS = 20

PHONE_PATTERN = re.compile(r"^[0-9+()\-\s]+$")

def validate_password_strength(value: str) -> str:
    problems = []

    if len(value) < PASSWORD_MIN:
        problems.append(f"at least {PASSWORD_MIN} characters")
    if not re.search(r"[A-Z]", value):
        problems.append("one uppercase letter")
    if not re.search(r"[0-9]", value):
        problems.append("one number")
    if not re.search(r"[^A-Za-z0-9]", value):
        problems.append("one symbol")

    if problems:
        raise ValueError("Password needs: " + ", ".join(problems) + ".")

    return value

class UserCreate(BaseModel):
    name: str = Field(min_length=NAME_MIN, max_length=NAME_MAX)
    email: EmailStr = Field(max_length=254)
    password: str = Field(min_length=PASSWORD_MIN, max_length=PASSWORD_MAX)
    phone: str | None = Field(default=None, max_length=20)
    role: Literal["user", "owner"] = "user"

    @field_validator("name")
    @classmethod
    def strip_name(cls, value: str) -> str:
        stripped = value.strip()

        if len(stripped) < NAME_MIN:
            raise ValueError(f"Name must be at least {NAME_MIN} characters.")

        return stripped

    @field_validator("password")
    @classmethod
    def check_password(cls, value: str) -> str:
        return validate_password_strength(value)

    @field_validator("phone")
    @classmethod
    def check_phone(cls, value: str | None) -> str | None:
        if value is None or not value.strip():
            return None

        stripped = value.strip()

        if not PHONE_PATTERN.match(stripped):
            raise ValueError(
                "Phone can only contain digits, spaces, +, -, and ()."
            )

        digits = re.sub(r"\D", "", stripped)

        if not PHONE_MIN_DIGITS <= len(digits) <= PHONE_MAX_DIGITS:
            raise ValueError(
                f"Phone must have {PHONE_MIN_DIGITS}-{PHONE_MAX_DIGITS} digits."
            )

        return stripped

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    phone: str | None = None
    role: Role
    created_at: datetime

class LoginRequest(BaseModel):
    email: EmailStr = Field(max_length=254)
    password: str = Field(min_length=1, max_length=PASSWORD_MAX)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
