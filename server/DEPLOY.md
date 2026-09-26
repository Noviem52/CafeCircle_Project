# Deploying Café Circle API on Render

## 1. Create the database first
Render dashboard → **New → Postgres** → name `cafecircle-db`, region **Oregon**, free plan.

## 2. Create the web service
**New → Web Service**, connect the repo.

| Setting | Value |
| --- | --- |
| Root Directory | `server` (only if the repo has the client folder too) |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Health Check Path | `/api/health` |

## 3. Environment variables

| Key | Value |
| --- | --- |
| `DATABASE_URL` | Internal Database URL from `cafecircle-db` |
| `SECRET_KEY` | any long random string |
| `CORS_ORIGINS` | `https://cafecircle.netlify.app,http://localhost:5173` |
| `PYTHON_VERSION` | `3.12.7` |

`render.yaml` in this folder does all of the above automatically if you use a Blueprint instead.

## 4. Point the frontend at it
In Netlify → Site settings → Environment variables, set the API base URL
(usually `VITE_API_URL`) to `https://<your-service>.onrender.com`, then redeploy.

## Notes
- The free instance sleeps after 15 minutes idle; the first request afterwards takes ~30–50s.
- Tables are created and demo data seeded automatically on startup (`bootstrap()`), so
  Alembic does not need to run on Render.
- Uploaded images go to local disk, which Render wipes on every deploy. Attach a Render
  Disk mounted at `/var/data` and set `UPLOAD_DIR=/var/data/uploads` if uploads must persist.
