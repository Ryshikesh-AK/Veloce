# Veloce Motors API

FastAPI backend for the existing Veloce React marketplace. PostgreSQL is the application database.

## Local development

1. Create a PostgreSQL database named `veloce` and a user with access to it.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`, a unique `JWT_SECRET_KEY`, and admin password. For local development, image uploads use `./uploads`; configure all three Cloudinary variables to use remote image storage.
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

## Free demo deployment

This setup uses Cloudflare Pages for the Vite frontend, Render Free for the API, Neon Free for PostgreSQL, and Cloudinary Free for uploaded images. Free services can sleep or have low resource quotas; do not use this setup for production data.

### Render API

- Create a Web Service from the repository with root directory `backend`.
- Build command: `pip install -r requirements.txt`.
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Set `ENVIRONMENT=production`, `DATABASE_URL`, `JWT_SECRET_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CORS_ORIGINS`, and the three `CLOUDINARY_*` variables.
- Use Neon's PostgreSQL connection URL with the SQLAlchemy scheme `postgresql+psycopg://` and retain `sslmode=require`. Set `CORS_ORIGINS` to a JSON array containing both deployed Pages origins, for example `["https://web-site.pages.dev","https://pwa-site.pages.dev"]`.
- Do not use Render's free PostgreSQL database; it expires after 30 days. Apply schema migrations from a local checkout configured with the same `DATABASE_URL` by running `alembic upgrade head` from the `backend` directory.

### Cloudflare Pages apps

- Create one Pages project with root directory `frontend`, build command `npm run build`, and output directory `dist` for the web marketplace/admin.
- Create another Pages project with root directory `pwa`, build command `npm run build`, and output directory `dist` for the responsive installable storefront.
- Set `VITE_API_BASE_URL` to the Render service URL, without a trailing slash, in the production build environment for both projects. The PWA intentionally has no production localhost fallback.
- Add both final Pages origins to Render `CORS_ORIGINS`, then redeploy the API if needed.

Render's free API sleeps after 15 minutes without requests and may take about a minute to wake. Uploaded images are stored remotely in Cloudinary when all three Cloudinary credentials are set; local development without those credentials continues to use `UPLOAD_DIRECTORY`.

## API contract

The API is versioned under `/api/v1`:

- `GET /cars` and `GET /cars/{id}`: public inventory, with `search`, `type`, `status`, `featured`, `page`, and `page_size` filters.
- `POST /cars`, `PATCH /cars/{id}`, and `DELETE /cars/{id}`: admin inventory management.
- `POST /cars/images`: admin-only raw image upload. Send the image bytes with an `image/jpeg`, `image/png`, `image/webp`, or `image/gif` content type; the response contains a URL to store on the car (a Cloudinary URL when configured, otherwise a local `/uploads/` path).
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
- Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` together for persistent image uploads. Production startup requires these credentials; local development can continue using `UPLOAD_DIRECTORY`.
- Restrict `CORS_ORIGINS` to the deployed frontend origins.
- Run `alembic upgrade head` as a release step before starting API replicas.
- Put the API behind TLS and a reverse proxy, and add structured log shipping and database backups.