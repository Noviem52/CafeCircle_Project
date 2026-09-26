from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ReviewCreate(BaseModel):
    cafe_id: int
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    cafe_id: int
    user_id: int
    user_name: str | None = None
    rating: int
    comment: str | None = None
    created_at: datetime
