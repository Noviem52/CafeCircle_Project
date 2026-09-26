import re
from datetime import time
from pydantic import BaseModel, ConfigDict, field_validator


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


class CafeCreate(BaseModel):
    name: str
    address: str
    phone: str | None = None
    description: str | None = None
    cuisine: str | None = None
    price_range: str | None = None
    image_url: str | None = None
    opening_time: time
    closing_time: time

    slug: str | None = None

    @field_validator("slug")
    @classmethod
    def normalize_slug(cls, v: str | None) -> str | None:
        return slugify(v) if v else v


class CafeUpdate(BaseModel):

    name: str | None = None
    address: str | None = None
    phone: str | None = None
    description: str | None = None
    cuisine: str | None = None
    price_range: str | None = None
    image_url: str | None = None
    opening_time: time | None = None
    closing_time: time | None = None


class CafeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int | None = None
    name: str
    slug: str
    address: str
    phone: str | None = None
    description: str | None = None
    cuisine: str | None = None
    price_range: str | None = None
    image_url: str | None = None
    opening_time: time
    closing_time: time
    status: str
