# Eventech App

A React-based event tech management application.

## Tech Stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/) (build tool)
- Deployed on [Vercel](https://vercel.com/)

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

## Deploy to Vercel

### Option 1 — GitHub (Recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo.
3. Vercel auto-detects Vite. Leave all settings as default.
4. Click **Deploy**.

### Option 2 — Vercel CLI

```bash
npm i -g vercel
vercel
```

## Project Structure

```
eventech-app/
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
├── vercel.json         # SPA routing rewrites
├── package.json
└── src/
    ├── main.jsx        # React root mount
    └── App.jsx         # Main application component
```
