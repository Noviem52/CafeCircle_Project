from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.cafe import Cafe
from app.models.favorite import Favorite
from app.models.user import User
from app.schemas.cafe import CafeOut

router = APIRouter()


@router.get("/", response_model=list[int])
def list_favorite_ids(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = db.execute(
        select(Favorite.cafe_id).where(Favorite.user_id == current_user.id)
    ).scalars().all()
    return list(rows)


@router.get("/cafes", response_model=list[CafeOut])
def list_favorite_cafes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(Cafe)
        .join(Favorite, Favorite.cafe_id == Cafe.id)
        .where(Favorite.user_id == current_user.id)
    )
    return db.execute(stmt).scalars().all()


@router.post("/{cafe_id}", status_code=201)
def add_favorite(
    cafe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not db.get(Cafe, cafe_id):
        raise HTTPException(status_code=404, detail="Cafe not found")

    existing = db.execute(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.cafe_id == cafe_id,
        )
    ).scalar_one_or_none()

    if not existing:
        db.add(Favorite(user_id=current_user.id, cafe_id=cafe_id))
        db.commit()

    return {"cafe_id": cafe_id, "favorited": True}


@router.delete("/{cafe_id}", status_code=200)
def remove_favorite(
    cafe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.execute(
        delete(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.cafe_id == cafe_id,
        )
    )
    db.commit()
    return {"cafe_id": cafe_id, "favorited": False}
