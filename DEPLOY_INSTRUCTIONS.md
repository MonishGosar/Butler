# Deployment Instructions

## 1. Landing Page (Vercel)

The landing page (`apps/web`) is a Next.js app optimized for Vercel.

1.  Log in to [Vercel](https://vercel.com).
2.  Click **Add New...** > **Project**.
3.  Import your GitHub repository: `Buttler`.
4.  **Configure Project**:
    - **Framework Preset**: Next.js
    - **Root Directory**: Select `apps/web` (click Edit)
    - **Build Command**: `next build` (default)
    - **Output Directory**: `.next` (default)
5.  Click **Deploy**.

## 2. Domain Setup (butler.gomonish.com)

To connect your subdomain:

1.  In the Vercel Project Dashboard, go to **Settings** > **Domains**.
2.  Add `butler.gomonish.com`.
3.  Vercel will give you a **CNAME** record value (usually `cname.vercel-dns.com`).
4.  Go to your DNS Provider for `gomonish.com` (e.g., GoDaddy, Namecheap).
5.  Add a new record:
    - **Type**: CNAME
    - **Name**: `butler`
    - **Value**: `cname.vercel-dns.com` (or whatever Vercel provides)
    - **TTL**: 3600 (or default)

## 3. Desktop App Releases

To update the "Download" button on the site:

1.  Build the app: `npm run dist` (in root or apps/desktop).
2.  Go to GitHub Releases.
3.  Create a new Release (e.g., v1.0.2).
4.  Upload the `Butler.exe` or `Butler-Setup.exe`.
5.  The website links to `/releases/latest`, so it will automatically point to the newest version!
