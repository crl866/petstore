# Render Deployment Guide

This repo is set up for a backend-first Render deployment.

## 1. Push the repository to GitHub

Render deploys from GitHub, so make sure the repo is published first.

## 2. Create the Render services from `render.yaml`

In Render, choose **New** -> **Blueprint** and connect this repository.

The blueprint creates:

- one PostgreSQL database named `petstore-postgres`
- one backend web service named `petstore-backend`

## 3. Why the backend build was failing

Render was trying to build from the repository root and looking for a root-level `Dockerfile`.

The backend Dockerfile actually lives in `petstore-backend/Dockerfile`, so the blueprint points Render to that folder explicitly.

## 4. Backend environment variables

The backend receives these values automatically from the Render database:

- `DATABASE_URL`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `SPRING_PROFILES_ACTIVE=prod`

The backend now accepts Render `DATABASE_URL` in both formats:

- `jdbc:postgresql://...`
- `postgres://...` or `postgresql://...` (auto-converted at startup)

## 5. Backend URL

After deployment, copy the backend URL from Render, for example:

`https://petstore-backend.onrender.com`

You can test the API with:

`https://petstore-backend.onrender.com/david/api/v1/pets`

## 6. Frontend later

Once the backend is live, Render will also create the frontend static site from `petstore-frontend`.

The frontend expects:

- build command: `npm ci && npm run build`
- publish directory: `dist`
- `VITE_API_BASE_URL` set to the backend URL
- SPA rewrite to `/index.html` for React Router paths

If your backend URL is not `https://petstore-backend.onrender.com`, update the frontend env var in Render to match the real backend URL.

## 7. If Render still errors

Check these first:

- the repo contains `render.yaml` at the root
- the backend Dockerfile path is `petstore-backend/Dockerfile`
- the repository was redeployed after committing the blueprint