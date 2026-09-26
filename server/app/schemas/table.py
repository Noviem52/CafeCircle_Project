from pydantic import BaseModel, ConfigDict


class TableCreate(BaseModel):
    cafe_id: int
    table_number: str
    capacity: int


class TableOut(TableCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
