from datetime import time

from sqlalchemy import select

from app.core.config import settings
from app.core.security import hash_password
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models import Cafe, Table, User

DEMO_CAFES = [
    {
        "name": "The Roasted Bean",
        "slug": "the-roasted-bean",
        "address": "12 Jalan Bukit Jalil, Bukit Jalil, Kuala Lumpur",
        "phone": "+60 3 8996 1200",
        "description": (
            "A quiet corner roastery pulling single-origin espresso on a "
            "restored lever machine. Pastries come out of the oven at eight "
            "and again at two, and the back room is lined with power points "
            "for anyone settling in for the morning."
        ),
        "cuisine": "Specialty Coffee, Brunch",
        "price_range": "$$",
        "image_url": "/cafe_1.jpg",
        "opening_time": time(7, 0),
        "closing_time": time(20, 0),
        "status": "approved",
        "tables": [("1", 2), ("2", 2), ("3", 4), ("4", 6)],
    },
    {
        "name": "Pour & Pause",
        "slug": "pour-and-pause",
        "address": "88 Jalan Telawi, Bangsar, Kuala Lumpur",
        "phone": "+60 3 2201 4488",
        "description": (
            "Filter-first bar with a rotating guest roaster and a long "
            "communal table by the window. The cold brew is steeped for "
            "eighteen hours and sells out most afternoons."
        ),
        "cuisine": "Filter Coffee, Pastries",
        "price_range": "$$$",
        "image_url": "/cafe_2.jpg",
        "opening_time": time(8, 0),
        "closing_time": time(19, 0),
        "status": "approved",
        "tables": [("1", 2), ("2", 4), ("3", 8)],
    },
    {
        "name": "Kopi Lane",
        "slug": "kopi-lane",
        "address": "5 Lorong Panggung, Chinatown, Kuala Lumpur",
        "phone": "+60 3 2072 9910",
        "description": (
            "Traditional kopitiam brewing sock-filtered kopi alongside kaya "
            "toast and soft-boiled eggs. Marble tables, ceiling fans, and a "
            "queue out the door before nine on weekends."
        ),
        "cuisine": "Local Kopi, Breakfast",
        "price_range": "$",
        "image_url": "/cafe_3.jpg",
        "opening_time": time(7, 30),
        "closing_time": time(18, 0),
        "status": "approved",
        "tables": [("1", 2), ("2", 2), ("3", 4)],
    },
    {
        "name": "Ember and Oat",
        "slug": "ember-and-oat",
        "address": "21 Jalan Mesui, Bukit Bintang, Kuala Lumpur",
        "phone": "+60 3 2141 7733",
        "description": (
            "Plant-based kitchen and slow bar in a converted shophouse. "
            "Every drink is built for oat milk first, and the courtyard "
            "seating stays cool well past noon."
        ),
        "cuisine": "Plant-Based, Slow Bar",
        "price_range": "$$$",
        "image_url": "/cafe_5.jpg",
        "opening_time": time(9, 0),
        "closing_time": time(22, 0),
        "status": "approved",
        "tables": [("1", 2), ("2", 4), ("3", 4), ("4", 10)],
    },
    {
        "name": "Third Wave Depot",
        "slug": "third-wave-depot",
        "address": "3 Jalan SS 15/4, Subang Jaya, Selangor",
        "phone": "+60 3 5612 8080",
        "description": (
            "Warehouse space with a competition-grade brew bar and a cupping "
            "table open to the public on Saturdays. Beans are roasted on site "
            "every Tuesday and Friday."
        ),
        "cuisine": "Specialty Coffee, Roastery",
        "price_range": "$$",
        "image_url": "/cafe_6.jpg",
        "opening_time": time(8, 0),
        "closing_time": time(21, 0),
        "status": "approved",
        "tables": [("1", 4), ("2", 4), ("3", 6)],
    },
    {
        "name": "Morning Ritual",
        "slug": "morning-ritual",
        "address": "17 Jalan Kemuja, Bangsar, Kuala Lumpur",
        "phone": "+60 3 2287 5566",
        "description": (
            "A newly opened neighbourhood bar focused on light roasts and "
            "laminated pastries. Submitted for listing and waiting on review."
        ),
        "cuisine": "Light Roast, Bakery",
        "price_range": "$$",
        "image_url": "/cafe_7.jpg",
        "opening_time": time(7, 0),
        "closing_time": time(17, 0),
        "status": "pending",
        "tables": [("1", 2), ("2", 4)],
    },
]


def create_tables() -> None:
    Base.metadata.create_all(bind=engine)


DEMO_ACCOUNTS = [
    ("ADMIN_NAME", "ADMIN_EMAIL", "ADMIN_PASSWORD", "admin"),
    ("DEMO_OWNER_NAME", "DEMO_OWNER_EMAIL", "DEMO_OWNER_PASSWORD", "owner"),
    ("DEMO_USER_NAME", "DEMO_USER_EMAIL", "DEMO_USER_PASSWORD", "user"),
]


def seed(db) -> tuple[list[tuple[str, str, str]], int]:
    accounts_created = []

    for name_key, email_key, password_key, role in DEMO_ACCOUNTS:
        email = getattr(settings, email_key)
        password = getattr(settings, password_key)

        existing = db.execute(
            select(User).where(User.email == email)
        ).scalar_one_or_none()

        if existing:
            continue

        db.add(
            User(
                name=getattr(settings, name_key),
                email=email,
                password=hash_password(password),
                role=role,
            )
        )
        accounts_created.append((role, email, password))

    db.commit()

    cafes_added = 0

    for entry in DEMO_CAFES:
        data = dict(entry)
        table_specs = data.pop("tables")

        exists = db.execute(
            select(Cafe).where(Cafe.slug == data["slug"])
        ).scalar_one_or_none()

        if exists:
            continue

        cafe = Cafe(**data)
        db.add(cafe)
        db.flush()

        for number, capacity in table_specs:
            db.add(
                Table(cafe_id=cafe.id, table_number=number, capacity=capacity)
            )

        cafes_added += 1

    db.commit()
    return accounts_created, cafes_added


def bootstrap() -> None:
    create_tables()

    db = SessionLocal()

    try:
        accounts_created, cafes_added = seed(db)
    finally:
        db.close()

    print("")
    print("  Cafe Circle API is ready")
    print(f"  Database: {settings.DATABASE_URL}")

    if cafes_added:
        print(f"  Seeded {cafes_added} demo cafes (one is pending approval)")

    if accounts_created:
        print("  Sign in with any of these:")

        for role, email, password in accounts_created:
            print(f"    {role:<6} {email:<24} {password}")

    print("")
