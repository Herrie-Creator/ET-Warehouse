# Eventech Warehouse Management System

## Setup & Deploy

### 1. Add Supabase keys
Copy `.env.example` to `.env` and fill in your Supabase URL and anon key from your Supabase project settings.

### 2. Deploy to Vercel
- Push this folder to GitHub
- Connect repo to Vercel
- In Vercel → Settings → Environment Variables, add:
  - `VITE_SUPABASE_URL` = your Supabase URL
  - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
- Deploy — all devices will now sync in real time

### 3. Run locally
```
npm install
npm run dev
```

## Logins
- wynand@eventech.co.za / wynand123 (Manager)
- herman@eventech.co.za / herman123 (Manager)
- remerus@eventech.co.za / remerus123 (Warehouse)
- liam@eventech.co.za / liam123 (Audio HOD)
- pat@eventech.co.za / pat123 (Lighting HOD)
- paulos@eventech.co.za / paulos123 (Structures HOD)
- kabelo@eventech.co.za / kabelo123 (Power HOD)
- frans@eventech.co.za / frans123 (AV/LED HOD)
