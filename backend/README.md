# Veloce Motors API

FastAPI backend for the existing Veloce React marketplace. PostgreSQL is the application database.

## Local development

1. Create a PostgreSQL database named `veloce` and a user with access to it.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`, a unique `JWT_SECRET_KEY`, and admin password.
3. Start the API:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
python -m scripts.seed
uvicorn app.main:app --reload
```

The PostgreSQL schema is created by Alembic. To start the frontend, open a separate terminal and run:

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

The frontend runs at `http://localhost:5173`; the API docs are at `http://localhost:8000/docs`.

## API contract

The API is versioned under `/api/v1`:

- `GET /cars` and `GET /cars/{id}`: public inventory, with `search`, `type`, `status`, `featured`, `page`, and `page_size` filters.
- `POST /cars`, `PATCH /cars/{id}`, and `DELETE /cars/{id}`: admin inventory management.
- `POST /cars/images`: admin-only raw image upload. Send the image bytes with an `image/jpeg`, `image/png`, `image/webp`, or `image/gif` content type; the response contains an image path to store on the car.
- `GET /uploads/{filename}`: public access to uploaded car images. Files are stored under `UPLOAD_DIRECTORY` (default `./uploads`, relative to the backend working directory).
- `POST /auth/login`: returns a bearer token for the configured admin account.
- `POST /test-drives`: public customer request form.
- `GET /test-drives/mine?email=...`: customer request lookup.
- `GET /test-drives`: admin queue, optionally filtered by email.
- `PATCH /test-drives/{id}`: approve or decline a request.
- `POST /leads`: signup form capture.

The response fields use camelCase aliases where they match the existing React state, for example `costBasis`, `isFeatured`, `carId`, `preferredAt`, and `createdAt`. Send `Authorization: Bearer <token>` for admin routes. A car with existing test-drive requests cannot be deleted; the API returns `409 Conflict` to preserve those requests.

## Production checklist

- Supply a strong secret and admin credential through a secret manager.
- Restrict `CORS_ORIGINS` to the deployed frontend origins.
- Run `alembic upgrade head` as a release step before starting API replicas.
- Put the API behind TLS and a reverse proxy, and add structured log shipping and database backups.