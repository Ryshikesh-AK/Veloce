# DriveXCars Storefront

The installable storefront shares live inventory, images, currency, and customer test-drive endpoints with the web marketplace. Its layout adapts from a compact phone view to desktop navigation and multi-column inventory.

## Local development

From this directory, install packages and run the PWA against the local API:

```powershell
npm install
$env:VITE_API_BASE_URL = "http://localhost:8000"
npm run dev -- --port 5174
```

Open `http://localhost:5174`. Ensure the API allows this origin in `CORS_ORIGINS`.

## Cloudflare Pages deployment

Create a separate Pages project for this directory with build command `npm run build` and output directory `dist`. Set the build environment variable `VITE_API_BASE_URL` to the deployed FastAPI service URL (no trailing slash), then redeploy. Add this Pages site's origin to the API's `CORS_ORIGINS`, alongside the web frontend origin. Without the API URL, the PWA reports a configuration error instead of showing stale sample cars.
