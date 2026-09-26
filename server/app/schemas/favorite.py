from pydantic import BaseModel, ConfigDict


class FavoriteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    cafe_id: int
