from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.db.session import get_db
from app.models.cafe import Cafe
from app.models.user import User
from app.schemas.cafe import CafeCreate, CafeOut, CafeUpdate, slugify

router = APIRouter()


def _unique_slug(db: Session, base: str) -> str:
    slug = base
    counter = 2
    while db.execute(select(Cafe).where(Cafe.slug == slug)).scalar_one_or_none():
        slug = f"{base}-{counter}"
        counter += 1
    return slug


@router.post("/", response_model=CafeOut, status_code=201)
def create_cafe(
    payload: CafeCreate,
    db: Session = Depends(get_db),
    owner: User = Depends(require_role("owner", "admin")),
):
    data = payload.model_dump()
    base_slug = data.pop("slug") or slugify(payload.name)
    data["slug"] = _unique_slug(db, base_slug)
    data["owner_id"] = owner.id

    data["status"] = "approved" if owner.role == "admin" else "pending"

    cafe = Cafe(**data)
    db.add(cafe)
    db.commit()
    db.refresh(cafe)
    return cafe


@router.get("/", response_model=list[CafeOut])
def list_cafes(db: Session = Depends(get_db)):
    stmt = select(Cafe).where(Cafe.status == "approved")
    return db.execute(stmt).scalars().all()


@router.get("/mine", response_model=list[CafeOut])
def list_my_cafes(
    db: Session = Depends(get_db),
    owner: User = Depends(require_role("owner", "admin")),
):
    stmt = select(Cafe).where(Cafe.owner_id == owner.id)
    return db.execute(stmt).scalars().all()


@router.get("/pending", response_model=list[CafeOut])
def list_pending_cafes(
    db: Session = Depends(get_db),
    _admin: User = Depends(require_role("admin")),
):
    stmt = select(Cafe).where(Cafe.status == "pending")
    return db.execute(stmt).scalars().all()


@router.get("/all", response_model=list[CafeOut])
def list_all_cafes(
    db: Session = Depends(get_db),
    _admin: User = Depends(require_role("admin")),
):
    return db.execute(select(Cafe)).scalars().all()


@router.get("/slug/{slug}", response_model=CafeOut)
def get_cafe_by_slug(slug: str, db: Session = Depends(get_db)):
    cafe = db.execute(select(Cafe).where(Cafe.slug == slug)).scalar_one_or_none()
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    return cafe


@router.get("/{cafe_id}", response_model=CafeOut)
def get_cafe(cafe_id: int, db: Session = Depends(get_db)):
    cafe = db.get(Cafe, cafe_id)
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    return cafe


@router.patch("/{cafe_id}", response_model=CafeOut)
def update_cafe(
    cafe_id: int,
    payload: CafeUpdate,
    db: Session = Depends(get_db),
    owner: User = Depends(require_role("owner", "admin")),
):
    cafe = db.get(Cafe, cafe_id)
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    if cafe.owner_id != owner.id and owner.role != "admin":
        raise HTTPException(status_code=403, detail="Not your cafe")

    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(cafe, field, value)

    db.commit()
    db.refresh(cafe)
    return cafe


@router.patch("/{cafe_id}/approve", response_model=CafeOut)
def approve_cafe(
    cafe_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_role("admin")),
):
    cafe = db.get(Cafe, cafe_id)
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    cafe.status = "approved"
    db.commit()
    db.refresh(cafe)
    return cafe


@router.patch("/{cafe_id}/reject", response_model=CafeOut)
def reject_cafe(
    cafe_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_role("admin")),
):
    cafe = db.get(Cafe, cafe_id)
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    cafe.status = "rejected"
    db.commit()
    db.refresh(cafe)
    return cafe
