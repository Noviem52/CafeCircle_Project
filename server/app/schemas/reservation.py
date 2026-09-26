from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ReservationCreate(BaseModel):
    table_id: int
    reservation_time: datetime
    party_size: int


class ReservationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    table_id: int
    reservation_time: datetime
    party_size: int
    status: str
    created_at: datetime


class OwnerReservationOut(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    user_name: str
    user_email: str
    table_id: int
    table_number: str
    cafe_id: int
    cafe_name: str
    reservation_time: datetime
    party_size: int
    status: str
    created_at: datetime
