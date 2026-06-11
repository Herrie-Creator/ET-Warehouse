# Eventech Warehouse Management System v3.1

## Setup

```bash
npm install
npm run dev       # Development
npm run build     # Production build
npm run preview   # Preview production build
```

## Architecture

This app runs fully in-browser using React + localStorage persistence. No external database required.

- **Data layer**: `usePersisted()` hook — all state auto-saved to `localStorage` under `et_*` keys
- **Auth**: Hardcoded user list in `USERS` constant (top of App.jsx) — replace with your server auth when ready
- **Server migration**: When ready, swap `usePersisted()` calls in `App()` with API calls to your server

## Connecting to your server (future)

In `App.jsx`, the bottom of the file has the `App()` component. Replace `usePersisted(key, fallback)` calls with your own `useServerData(endpoint)` hook that POSTs/GETs from your backend.

## User accounts

Edit the `USERS` array near the top of `src/App.jsx` to update names, emails, passwords, and roles.

## Roles

- `admin` — Full access (managers)
- `warehouse` — Scan in/out, fault reports, assets
- `hod_audio / hod_lighting / hod_rigging / hod_power / hod_av` — Scan, fault reports, own department
- `crew` — Scan out only
- `freelancer` — Calendar & availability only

## Deployment (Vercel)

Push to GitHub, connect repo to Vercel. The included `vercel.json` handles SPA routing.
