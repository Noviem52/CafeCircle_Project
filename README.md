# Café Circle

Café discovery and seat reservation platform. Guests browse approved cafés and
book a table; café owners submit their café for listing; admins approve or
reject those submissions.

- **Frontend** — React 19 + TypeScript + Vite + Tailwind v4
- **Backend** — FastAPI + SQLAlchemy + SQLite
- **Auth** — JWT bearer tokens, bcrypt password hashing

No database server, no config files, no migration commands. The database is a
single SQLite file created automatically on first run.

---

## Prerequisites

- Node.js 20+
- Python 3.11+

---

## Running the app

Two terminals, side by side.

### Terminal 1 — backend

```bash
cd server
python -m venv .venv
.\.venv\Scripts\Activate.ps1            # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

That is the whole backend setup. On first start it creates the tables, seeds
six demo cafés, and creates the admin account:

```
  Café Circle API is ready
  Database: sqlite:///.../server/cafe_circle.db
  Seeded 6 demo cafés (one is pending approval)
  Sign in with any of these:
    admin  admin@cafecircle.com     Adm1n!Pass
    owner  owner@cafecircle.com     Own3r!Pass
    user   user@cafecircle.com      Us3r!Pass
```

### Terminal 2 — frontend

```bash
cd client
npm install
npm run dev
```

Open <http://localhost:5173>. Start the backend first.

---

## What you get on first run

Five approved cafés appear on the site straight away, each with tables you can
book. A sixth, **Morning Ritual**, is left `pending` so you can walk through the
approval flow immediately.

Three accounts are created for you:

| Role | Email | Password |
|---|---|---|
| admin | `admin@cafecircle.com` | `Adm1n!Pass` |
| owner | `owner@cafecircle.com` | `Own3r!Pass` |
| user | `user@cafecircle.com` | `Us3r!Pass` |

The demo owner deliberately has no café yet, so signing in as them takes you
straight to the submission wizard where you can test the photo upload.

---

## Using your own café photos

Sign in as an owner and upload from either place:

- **New café** — the Café Owner Portal wizard has an *Upload Café Image*
  button. Pick a file and it uploads immediately; the button shows
  "Uploading..." then "Uploaded".
- **Existing café** — *Café Profile Details* has a cover image panel with a
  preview. Upload a new photo, then press Save to apply it.

Files are stored in `server/uploads/` under a random filename and served from
`http://localhost:8000/uploads/<name>`. Accepts JPG, PNG, and WEBP up to 5 MB.
Only owners and admins can upload.

Cafés without an uploaded photo fall back to the bundled stock images in
`client/public/`. To wipe every uploaded photo, delete `server/uploads/`.

---

## Trying the approval flow

1. Sign in as `admin@cafecircle.com` / `Adm1n!Pass`.
2. Open **Admin Console → Café Approvals** from the navbar. Morning Ritual is
   waiting there — approve or reject it and watch it appear on or stay off the
   public site.
3. To see the owner side, sign out and sign up with **"I own or manage a café"**
   ticked. You land on the Café Owner Portal with the submission wizard.
4. Submit a café. It goes in as `pending` and is invisible in search.
5. Sign back in as the admin and approve it.

---

## Resetting

Stop the server, delete `server/cafe_circle.db`, and start it again. Tables,
demo cafés, and the admin account are recreated from scratch.

---

## Account rules

Enforced in the browser (`client/src/lib/validation.ts`) and again on the server
(`server/app/schemas/user.py`), so the API stays safe even if the form is
bypassed.

| Field | Rule |
|---|---|
| Full name | 2–60 characters, required |
| Email | valid format, max 254 characters, required |
| Password | 8–64 characters, at least one uppercase letter, one number, one symbol |
| Phone | optional; 7–20 digits, only digits, spaces, `+`, `-`, `( )` |

Sign-in is rate limited: 5 failed attempts for the same email from the same IP
locks that combination out for 15 minutes and returns HTTP 429.

---

## Roles

| Role | Can do |
|---|---|
| `user` | Browse approved cafés, book seats, leave reviews, save favourites |
| `owner` | Everything a user can, plus submit a café and manage its bookings |
| `admin` | Approve or reject café submissions, view all users and stats |

Favourites are stored per account on the server, so each signed-in user has
their own list and it follows them to any device or browser. Favouriting while
signed out opens the sign-in dialog.

A café submitted by an owner is created with status `pending` and stays
invisible on the public site until an admin approves it.

---

## Scripts

```bash
# client
npm run dev        # dev server on 5173
npm run build      # typecheck + production build
npm run preview    # serve the production build on 4173
npm run lint       # eslint

# server
python -m uvicorn app.main:app --reload --port 8000
```

---

## Project layout

```
client/
  src/
    components/     Navbar, Footer, AuthModal, BrewOverlay, Logo
      admin/        approvals table, stats
      owner/        café wizard, bookings, profile
      cafe/         hero, info, reviews, booking widget
      booking/      summary, success
      home/         hero, trending, cuisine browse, membership
    pages/          Home, Search, CafeDetail, Dashboard, Favorites, ...
    context/        AppContext (auth, favourites, dark mode)
    lib/            api.ts, adapters.ts, types.ts, validation.ts
server/
  app/
    api/            auth, users, cafes, tables, reservations, reviews
    models/         SQLAlchemy models
    schemas/        Pydantic request/response models
    core/           config, security
    db/             engine, session, init_db (tables + demo seed)
  cafe_circle.db    created on first run
```

---

## API reference

| Method | Path | Access |
|---|---|---|
| GET | `/api/health` | public |
| POST | `/api/auth/login` | public |
| GET | `/api/auth/me` | authenticated |
| POST | `/api/users/` | public (sign-up) |
| GET | `/api/users/` | admin |
| GET | `/api/cafes/` | public (approved only) |
| GET | `/api/cafes/slug/{slug}` | public |
| POST | `/api/cafes/` | owner, admin |
| GET | `/api/cafes/mine` | owner, admin |
| PATCH | `/api/cafes/{id}` | owning owner, admin |
| GET | `/api/cafes/pending` | admin |
| GET | `/api/cafes/all` | admin |
| PATCH | `/api/cafes/{id}/approve` | admin |
| PATCH | `/api/cafes/{id}/reject` | admin |
| GET / POST | `/api/tables/` | list public, create owner |
| POST / GET | `/api/reservations/` | authenticated |
| GET | `/api/reservations/owner` | owner, admin |
| DELETE | `/api/reservations/{id}` | booking owner, admin |
| PATCH | `/api/reservations/{id}/status` | owning owner, admin |
| GET / POST | `/api/reviews/` | read public, write authenticated |
| GET | `/api/favorites/` | authenticated (own favourites) |
| GET | `/api/favorites/cafes` | authenticated (own favourites) |
| POST / DELETE | `/api/favorites/{cafe_id}` | authenticated |
| POST | `/api/uploads/image` | owner, admin |

---

## Troubleshooting

**`Error loading ASGI app. Could not import module "main"`**
Run from the `server` folder and use the full module path:
`python -m uvicorn app.main:app --reload --port 8000`.

**`Port 5173 is already in use`**
An old dev server is still running. On Windows:
`Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force`

**Every request fails with "Can't reach the server"**
The backend is not running, or it is on a port other than 8000. Check
`client/.env` matches the port in Terminal 1.

**Site loads but no cafés appear**
The backend was started once before this version and the database predates the
demo seed. Delete `server/cafe_circle.db` and restart.

**Signed in but no Admin Console link**
That account is not the admin. Sign in as `admin@cafecircle.com`.

**Uploaded photo does not show**
The image is served by the backend, so Terminal 1 must be running. Check the
file exists in `server/uploads/`.

**Favourites look empty after signing in as someone else**
That is correct now — each account has its own list.
