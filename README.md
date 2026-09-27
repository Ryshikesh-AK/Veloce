# Veloce Motors

Veloce Motors is split into two independently runnable applications:

- `frontend/`: React and Vite marketplace and admin interface.
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

## Tests

The API regression tests cover authentication, inventory CRUD, image uploads, and test-drive workflows. Run them from the repository root after installing backend requirements:

```powershell
python -m pytest
```