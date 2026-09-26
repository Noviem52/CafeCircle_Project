from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.cafe import Cafe
from app.models.review import Review
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewOut

router = APIRouter()


@router.post("/", response_model=ReviewOut, status_code=201)
def create_review(
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not db.get(Cafe, payload.cafe_id):
        raise HTTPException(status_code=404, detail="Cafe not found")

    review = Review(
        cafe_id=payload.cafe_id,
        user_id=current_user.id,
        rating=payload.rating,
        comment=payload.comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    out = ReviewOut.model_validate(review)
    out.user_name = current_user.name
    return out


@router.get("/", response_model=list[ReviewOut])
def list_reviews(cafe_id: int, db: Session = Depends(get_db)):
    stmt = (
        select(Review, User.name)
        .join(User, User.id == Review.user_id)
        .where(Review.cafe_id == cafe_id)
        .order_by(Review.created_at.desc())
    )
    results = []
    for review, user_name in db.execute(stmt).all():
        out = ReviewOut.model_validate(review)
        out.user_name = user_name
        results.append(out)
    return results
