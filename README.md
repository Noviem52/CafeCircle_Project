# Café Circle

A full-stack café discovery and table reservation platform. Guests browse approved cafés and book a table; café owners submit their café for listing and manage its bookings; admins approve or reject submissions.

## Tech Stack

**Backend**
- FastAPI (Python)
- SQLAlchemy ORM (+ Alembic migrations, for Postgres deployments)
- SQLite by default — a single file created automatically on first run, no DB server needed
- JWT authentication (python-jose + bcrypt)

**Frontend**
- React 19 + TypeScript + Vite
- React Router
- Tailwind CSS v4
- Axios + react-hot-toast

**Deployment**
- Backend → [Render](https://render.com)
- Frontend → [Netlify](https://www.netlify.com)

## Project Structure

```
├── server/                  # FastAPI backend
│   ├── app/
│   │   ├── api/              # Route handlers (auth, users, cafes, tables, reservations, reviews, favorites, uploads)
│   │   ├── core/             # Config and security (JWT, bcrypt hashing)
│   │   ├── db/                # Engine, session, bootstrap (create tables + seed demo data)
│   │   ├── models/           # SQLAlchemy models
│   │   └── schemas/          # Pydantic request/response schemas
│   ├── alembic/               # Migrations (only used for Postgres deployments, not local SQLite)
│   ├── uploads/               # Café cover photos uploaded by owners (created on first upload)
│   └── requirements.txt
│
└── client/                   # React frontend
    ├── src/
    │   ├── pages/              # Home, Search, CafeDetail, Dashboard, Favorites, admin/, owner/
    │   ├── components/         # Navbar, Footer, AuthModal, CafeCard, admin/, owner/, cafe/, booking/, home/
    │   ├── context/             # AppContext (auth, favourites, dark mode)
    │   └── lib/                # api.ts, adapters.ts, types.ts, validation.ts
    └── public/
```

## Features

- **Auth** — sign up (guest or "I own a café"), login, JWT-based sessions, protected routes, role-based permissions (`user` / `owner` / `admin`), sign-in rate limiting (5 failed attempts locks an email+IP pair for 15 minutes)
- **Café discovery** — browse and search approved cafés, filter by cuisine, view opening hours, reviews, and available tables
- **Reservations** — guests book a table for a 90-minute slot; the backend checks the café's opening hours and rejects overlapping bookings on the same table
- **Café Owner Portal** — a submission wizard for listing a new café (with cover photo upload), a profile editor, and a bookings dashboard
- **Admin Console** — approve or reject pending café submissions, view all users and stats
- **Favourites** — signed-in users can save cafés; the list is stored per account on the server and follows them across devices
- **Reviews** — signed-in users can leave a rating and comment on a café's page
- **Photo uploads** — owners upload a JPG/PNG/WEBP (max 5 MB) for their café's cover image; files are stored under `server/uploads/` and served from `/uploads/<name>`

## API Overview

All endpoints are prefixed with `/api`. Interactive docs are available at `/docs` once the backend is running (Swagger UI).

| Resource | Endpoints |
|---|---|
| Health | `GET /health` |
| Auth | `POST /auth/login`, `GET /auth/me` |
| Users | `POST /users/` (sign-up), `GET /users/` (admin) |
| Cafés | `GET /cafes/` (approved only), `GET /cafes/slug/{slug}`, `GET /cafes/{id}`, `POST /cafes/`, `PATCH /cafes/{id}`, `GET /cafes/mine`, `GET /cafes/pending`, `GET /cafes/all`, `PATCH /cafes/{id}/approve`, `PATCH /cafes/{id}/reject` |
| Tables | `GET /tables/` (optional `cafe_id` filter), `POST /tables/` |
| Reservations | `POST /reservations/`, `GET /reservations/` (own, or all for admin), `GET /reservations/owner`, `DELETE /reservations/{id}`, `PATCH /reservations/{id}/status` |
| Reviews | `GET /reviews/?cafe_id=`, `POST /reviews/` |
| Favorites | `GET /favorites/`, `GET /favorites/cafes`, `POST /favorites/{cafe_id}`, `DELETE /favorites/{cafe_id}` |
| Uploads | `POST /uploads/image` |

### Permissions

| Action | Who |
|---|---|
| Browse approved cafés, book a table, leave reviews, save favourites | Any signed-in `user` (and above) |
| Submit a café, manage its tables/bookings, upload photos | `owner` or `admin` |
| Approve/reject café submissions, view all users | `admin` |

A café submitted by an `owner` is created with status `pending` and stays invisible on the public site until an `admin` approves it. A café created by an `admin` is auto-approved.

## Getting Started

### Backend

```bash
cd server
python -m venv .venv
.\.venv\Scripts\Activate.ps1      # Windows
# source .venv/bin/activate       # macOS/Linux

pip install -r requirements.txt
cp .env.example .env               # then fill in real values (defaults work for local dev)
python -m uvicorn app.main:app --reload --port 8000
```

That's the whole backend setup — no database server and no migration commands. On first start it creates the SQLite tables, seeds six demo cafés (one left `pending` for testing the approval flow), and creates three demo accounts.

### Frontend

```bash
cd client
npm install
cp .env.example .env               # then fill in real values (defaults work for local dev)
npm run dev
```

The app runs at `http://localhost:5173`. Start the backend first.

## Default Accounts

All demo accounts are seeded automatically on first backend start.

| Role | Email | Password |
|---|---|---|
| admin | `admin@cafecircle.com` | `Adm1n!Pass` |
| owner | `owner@cafecircle.com` | `Own3r!Pass` |
| user | `user@cafecircle.com` | `Us3r!Pass` |

The demo owner deliberately has no café yet, so signing in as them goes straight to the submission wizard.

## Database

SQLite by default — `server/cafe_circle.db`, created and seeded automatically by `bootstrap()` on app startup (`app/db/init_db.py`). No `alembic upgrade` step is needed for local development.

Alembic is included for deployments that switch `DATABASE_URL` to Postgres (see Deployment below). In that case, schema changes should go through a migration:

```bash
alembic revision --autogenerate -m "description of the change"
alembic upgrade head
```

To reset local data entirely: stop the server, delete `server/cafe_circle.db`, and start it again.

## Deployment

- **Backend (Render):** Root directory `server`, build command `pip install -r requirements.txt`, start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`, health check path `/api/health`. Set `DATABASE_URL` (Postgres connection string), `SECRET_KEY`, and `CORS_ORIGINS` (including the live Netlify URL) as environment variables — `render.yaml` does this automatically via a Render Blueprint. Tables and demo data are seeded automatically on startup, so Alembic does not need to run on Render. The free instance sleeps after 15 minutes idle; the first request afterward takes ~30–50s. Uploaded images go to local disk, which Render wipes on every deploy — attach a Render Disk and set `UPLOAD_DIR` if uploads must persist. See `server/DEPLOY.md` for the full walkthrough.
- **Frontend (Netlify):** Base directory `client`, build command `npm run build`, publish directory `dist`. Set `VITE_API_URL` to the live Render URL (e.g. `https://cafecircle-api.onrender.com/api`).