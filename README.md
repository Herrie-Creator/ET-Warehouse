# Eventech Warehouse Management System v3.0

## Deploy to Vercel (step by step)

1. Unzip this file
2. Go to github.com → New repository → name it `eventech-warehouse`
3. Upload ALL files from this folder into the repo
4. Go to vercel.com → Sign up/Login with GitHub
5. Click "New Project" → Import your `eventech-warehouse` repo
6. Vercel auto-detects Vite → just click **Deploy**
7. Live at: yourname.vercel.app

## Run locally
```
npm install
npm run dev
```

## Logins
| Name     | Email                        | Password     | Role           |
|----------|------------------------------|--------------|----------------|
| Wynand   | wynand@eventech.co.za        | wynand123    | Manager        |
| Herman   | herman@eventech.co.za        | herman123    | Manager        |
| Remerus  | remerus@eventech.co.za       | remerus123   | Warehouse      |
| Liam     | liam@eventech.co.za          | liam123      | Audio HOD      |
| Pat      | pat@eventech.co.za           | pat123       | Lighting HOD   |
| Paulos   | paulos@eventech.co.za        | paulos123    | Structures HOD |
| Kabelo   | kabelo@eventech.co.za        | kabelo123    | Power HOD      |
| Frans    | frans@eventech.co.za         | frans123     | AV/LED HOD     |

## Notes
- All data saves to browser localStorage — no database needed
- Warehouse Display opens as a popup from the Dashboard (top right button)
- Camera feed requires the camera to be on the same local network
