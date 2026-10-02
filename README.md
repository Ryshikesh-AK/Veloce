# Veloce Motors

Veloce Motors is split into three independently runnable applications:

- `frontend/`: responsive React and Vite marketplace and admin interface.
- `pwa/`: installable storefront for mobile and desktop, sharing live inventory and customer APIs with the web app.
- `backend/`: FastAPI API, SQLAlchemy models, Alembic migrations, and seed script.

## Run locally

Use separate terminals from the repository root.

### Backend

```powershell
Set-Location backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Create a PostgreSQL database named `veloce`, then update `backend/.env` with its `DATABASE_URL`, a unique `JWT_SECRET_KEY`, and admin password. Initialize and start the API:

```powershell
alembic upgrade head
python -m scripts.seed
uvicorn app.main:app --reload
```

The API and documentation are available at `http://localhost:8000` and `http://localhost:8000/docs`.

### Frontend

```powershell
Set-Location frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

The frontend is available at `http://localhost:5173`. Set `VITE_API_BASE_URL` in `frontend/.env.local` to point it at a different API; the default is `http://localhost:8000`.

### PWA local development

```powershell
Set-Location pwa
npm install
$env:VITE_API_BASE_URL = "http://localhost:8000"
npm run dev -- --port 5174
```

The PWA is available at `http://localhost:5174`. The backend's development CORS origins include this port. Production builds must set `VITE_API_BASE_URL` to the deployed API URL and include the deployed PWA origin in backend `CORS_ORIGINS`; see [backend deployment instructions](backend/README.md).

### PWA install and offline behavior

Create a production frontend build with `npm run build` and preview it with `npm run preview`. The build includes the Veloce web app manifest and service worker, so browsers can install it as a desktop or mobile app. Service workers require HTTPS in production; `localhost` is allowed for local testing.

The installed app caches the frontend shell and can open previously visited routes while offline. Inventory, images served by the API, authentication, uploads, test-drive requests, and admin changes remain online-only and are not queued. Configure the deployed frontend URL in the backend `CORS_ORIGINS` setting.

## Tests

The API regression tests cover authentication, inventory CRUD, image uploads, and test-drive workflows. Run them from the repository root after installing backend requirements:

```powershell
python -m pytest
```