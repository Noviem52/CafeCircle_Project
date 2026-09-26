from datetime import datetime, time, timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.db.session import get_db
from app.models.cafe import Cafe
from app.models.reservation import Reservation
from app.models.table import Table
from app.models.user import User
from app.schemas.reservation import (
    OwnerReservationOut,
    ReservationCreate,
    ReservationOut,
)

router = APIRouter()

SLOT_MINUTES = 90


def _to_wall_clock(dt: datetime) -> datetime:
    """Keep the time exactly as the guest picked it.

    A cafe's opening_time / closing_time are plain local times, so the
    reservation has to be compared against them in the same local clock.
    Converting to UTC first shifted every booking by the guest's timezone
    offset, which is why in-hours slots came back as "Cafe is closed".
    """
    return dt.replace(tzinfo=None)


def _now_in_same_zone(dt: datetime) -> datetime:
    """'Now' as a wall clock in whatever timezone the guest sent."""
    if dt.tzinfo is not None:
        return datetime.now(dt.tzinfo).replace(tzinfo=None)
    return datetime.now()


def _minutes(value: time) -> int:
    return value.hour * 60 + value.minute


@router.post("/", response_model=ReservationOut, status_code=201)
def create_reservation(
    payload: ReservationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    table = db.get(Table, payload.table_id)
    if not table:
        raise HTTPException(404, "Table not found")

    reservation_time = _to_wall_clock(payload.reservation_time)

    if reservation_time < _now_in_same_zone(payload.reservation_time):
        raise HTTPException(400, "Cannot book a time in the past")

    if payload.party_size > table.capacity:
        raise HTTPException(400, f"Table seats {table.capacity} people")

    cafe = db.get(Cafe, table.cafe_id)

    open_minutes = _minutes(cafe.opening_time)
    close_minutes = _minutes(cafe.closing_time)
    if close_minutes <= open_minutes:
        close_minutes += 24 * 60  # cafe closes after midnight

    start_minutes = reservation_time.hour * 60 + reservation_time.minute
    if start_minutes < open_minutes:
        start_minutes += 24 * 60  # after-midnight slot of an overnight cafe
    end_minutes = start_minutes + SLOT_MINUTES

    if start_minutes < open_minutes or end_minutes > close_minutes:
        raise HTTPException(400, "Cafe is closed at that time")

    new_start = reservation_time
    new_end = new_start + timedelta(minutes=SLOT_MINUTES)

    existing = db.execute(
        select(Reservation).where(
            Reservation.table_id == payload.table_id,
            Reservation.status == "confirmed",
        )
    ).scalars().all()

    for r in existing:
        r_end = r.reservation_time + timedelta(minutes=SLOT_MINUTES)
        if new_start < r_end and new_end > r.reservation_time:
            raise HTTPException(409, "Table already booked at that time")

    reservation = Reservation(
        user_id=current_user.id,
        table_id=payload.table_id,
        reservation_time=reservation_time,
        party_size=payload.party_size,
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


@router.get("/", response_model=list[ReservationOut])
def list_reservations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(Reservation)
    if current_user.role != "admin":
        stmt = stmt.where(Reservation.user_id == current_user.id)
    return db.execute(stmt).scalars().all()


@router.get("/owner", response_model=list[OwnerReservationOut])
def list_owner_reservations(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner", "admin")),
):
    stmt = (
        select(Reservation, User.name, User.email, Table.table_number, Cafe)
        .join(User, User.id == Reservation.user_id)
        .join(Table, Table.id == Reservation.table_id)
        .join(Cafe, Cafe.id == Table.cafe_id)
        .order_by(Reservation.reservation_time.desc())
    )
    if current_user.role != "admin":
        stmt = stmt.where(Cafe.owner_id == current_user.id)

    results = []
    for reservation, user_name, user_email, table_number, cafe in db.execute(stmt).all():
        results.append(
            OwnerReservationOut(
                id=reservation.id,
                user_id=reservation.user_id,
                user_name=user_name,
                user_email=user_email,
                table_id=reservation.table_id,
                table_number=table_number,
                cafe_id=cafe.id,
                cafe_name=cafe.name,
                reservation_time=reservation.reservation_time,
                party_size=reservation.party_size,
                status=reservation.status,
                created_at=reservation.created_at,
            )
        )
    return results


@router.delete("/{reservation_id}", status_code=204)
def cancel_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reservation = db.get(Reservation, reservation_id)
    if not reservation:
        raise HTTPException(404, "Reservation not found")
    if reservation.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(403, "You can't cancel someone else's reservation")
    reservation.status = "cancelled"
    db.commit()


ALLOWED_OWNER_STATUSES = {"confirmed", "completed", "cancelled"}


class ReservationStatusUpdate(BaseModel):
    status: str


@router.patch("/{reservation_id}/status", response_model=ReservationOut)
def update_reservation_status(
    reservation_id: int,
    payload: ReservationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner", "admin")),
):
    if payload.status not in ALLOWED_OWNER_STATUSES:
        raise HTTPException(400, f"Status must be one of {sorted(ALLOWED_OWNER_STATUSES)}")

    reservation = db.get(Reservation, reservation_id)
    if not reservation:
        raise HTTPException(404, "Reservation not found")

    table = db.get(Table, reservation.table_id)
    cafe = db.get(Cafe, table.cafe_id) if table else None

    if current_user.role != "admin" and (not cafe or cafe.owner_id != current_user.id):
        raise HTTPException(403, "You don't manage this café")

    reservation.status = payload.status
    db.commit()
    db.refresh(reservation)
    return reservation
