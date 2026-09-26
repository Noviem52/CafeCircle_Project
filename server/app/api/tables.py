from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.db.session import get_db
from app.models.cafe import Cafe
from app.models.table import Table
from app.models.user import User
from app.schemas.table import TableCreate, TableOut

router = APIRouter()


@router.post("/", response_model=TableOut, status_code=201)
def create_table(
    payload: TableCreate,
    db: Session = Depends(get_db),
    owner: User = Depends(require_role("owner", "admin")),
):
    cafe = db.get(Cafe, payload.cafe_id)
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    if cafe.owner_id != owner.id and owner.role != "admin":
        raise HTTPException(status_code=403, detail="Not your cafe")

    table = Table(**payload.model_dump())
    db.add(table)
    db.commit()
    db.refresh(table)
    return table


@router.get("/", response_model=list[TableOut])
def list_tables(cafe_id: int | None = None, db: Session = Depends(get_db)):
    stmt = select(Table)
    if cafe_id is not None:
        stmt = stmt.where(Table.cafe_id == cafe_id)
    return db.execute(stmt).scalars().all()
