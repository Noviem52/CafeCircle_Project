# Project Diagrams

## 1. Architecture Diagram

```mermaid
flowchart TB
    subgraph Client["Browser"]
        UI["React + Vite SPA\n(Tailwind, Axios)"]
    end

    subgraph Netlify["Netlify"]
        Static["Static build\n(client/dist)"]
    end

    subgraph Render["Render"]
        API["FastAPI backend\n(server/app)"]
        Uploads["Local disk\nserver/uploads/"]
    end

    subgraph DB["Database"]
        SQLite[("SQLite\ncafe_circle.db\n(local dev)")]
        Postgres[("Postgres\n(Render, production)")]
    end

    UI -->|"loads static assets"| Static
    UI -->|"REST + JWT\n/api/*"| API
    UI -->|"multipart upload\n/api/uploads/image"| API
    API -->|"saves file, returns /uploads/<name>"| Uploads
    UI -->|"GET /uploads/<name>"| API
    API -->|"SQLAlchemy\n(sqlite:///... locally)"| SQLite
    API -.->|"SQLAlchemy\n(DATABASE_URL override)"| Postgres

    style Client fill:#eef,stroke:#557
    style Netlify fill:#e6f7e6,stroke:#3a3
    style Render fill:#fff0e6,stroke:#c73
    style DB fill:#e8e8f8,stroke:#66a
```

**Key point:** unlike a setup that uploads straight to a third-party CDN, café cover photos are posted to the FastAPI backend itself (`POST /api/uploads/image`), written to `server/uploads/`, and served back by the same backend at `/uploads/<name>`. This is why uploads are wiped on every Render deploy unless a persistent disk is attached (see the README's Deployment section) — there is no external image host in this stack.

## 2. API Sequence Diagram — Book a Table

```mermaid
sequenceDiagram
    actor G as Guest (browser)
    participant API as FastAPI backend
    participant DB as Database (cafes, tables, reservations)

    G->>G: Open a café page, pick a table, date and time
    G->>API: POST /api/reservations\n{table_id, reservation_time, party_size}\nAuthorization: Bearer <JWT>

    API->>API: Decode JWT, resolve current_user
    alt invalid or missing token
        API-->>G: 401 Could not validate credentials
    end

    API->>DB: SELECT table WHERE id = table_id
    alt table not found
        API-->>G: 404 Table not found
    end

    API->>API: Reject if reservation_time is in the past
    alt party_size > table.capacity
        API-->>G: 400 Table seats N people
    end

    API->>DB: SELECT cafe WHERE id = table.cafe_id
    API->>API: Compare requested time against\ncafe.opening_time / closing_time\n(handles cafes open past midnight)
    alt outside opening hours
        API-->>G: 400 Cafe is closed at that time
    end

    API->>DB: SELECT confirmed reservations\nWHERE table_id = table_id
    API->>API: Check the new 90-minute slot\nagainst each existing booking
    alt overlaps an existing booking
        API-->>G: 409 Table already booked at that time
    end

    API->>DB: INSERT INTO reservations (status = confirmed)
    DB-->>API: new row (id, created_at, ...)
    API-->>G: 201 Created\n{"id", "table_id", "reservation_time",\n"party_size", "status": "confirmed", ...}
```

## 3. CI/CD Pipeline Diagram

```mermaid
flowchart LR
    subgraph LocalDev["Local development (your machine)"]
        DevServer["npm run dev\n(Vite, localhost:5173)"]
        UvicornDev["uvicorn app.main:app --reload\n(localhost:8000, SQLite file)"]
    end

    Dev["Developer"] -.->|"codes against"| LocalDev
    Dev["Developer"] -->|"git push"| GH["GitHub\nmain branch"]

    GH -->|"webhook"| RenderBuild["Render: build backend"]
    GH -->|"webhook"| NetlifyBuild["Netlify: build frontend"]

    subgraph RenderPipeline["Render pipeline"]
        RenderBuild --> RB1["pip install -r requirements.txt"]
        RB1 --> RB2["uvicorn app.main:app\n--host 0.0.0.0 --port $PORT"]
        RB2 --> RB3["bootstrap(): create tables\n+ seed demo data on startup"]
        RB3 --> RenderLive["cafecircle-api\n.onrender.com"]
    end

    subgraph NetlifyPipeline["Netlify pipeline"]
        NetlifyBuild --> NB1["npm install"]
        NB1 --> NB2["npm run build\n(tsc -b && vite build)"]
        NB2 --> NB3["publish client/dist"]
        NB3 --> NetlifyLive["cafecircle\n.netlify.app"]
    end

    RenderLive -.->|"CORS_ORIGINS allows"| NetlifyLive
    NetlifyLive -->|"VITE_API_URL"| RenderLive
```

**`npm run dev` vs `npm run build`:** `npm run dev` (top-left box) is only ever run locally, by a developer, while coding — it starts a live-reloading dev server and never touches production. `npm run build` (inside the Netlify pipeline) is what actually produces the static files that get deployed; Netlify runs this itself on every push, not `npm run dev`.

**Why no Alembic step on Render:** locally the app talks to a SQLite file and creates its own tables on startup, so there is nothing to migrate. In production, `DATABASE_URL` is swapped for the Postgres connection string Render provides, but `bootstrap()` still runs `Base.metadata.create_all()` and the demo seed on every startup — it only inserts rows that don't already exist, so redeploys are safe. Alembic is there for hand-written schema changes against that Postgres database, run manually, not as part of the deploy pipeline.