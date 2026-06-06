# Deployment Guide

## Frontend (Vercel)
1. Push codebase to GitHub.
2. Import repository into Vercel.
3. Set Build Command: `npm run build`
4. Set Output Directory: `.next`
5. Configure Environment Variables (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_FIREBASE_*`).
6. Deploy.

## Backend (Render / Heroku)
1. Create a Web Service in Render.
2. Point to the `backend/` directory or set Root Directory to `backend`.
3. Set Build Command: `npm install`
4. Set Start Command: `node index.js`
5. Configure Environment Variables (`MONGO_URI`, `RAZORPAY_KEY_ID`, `SMTP_PASS`).
6. Deploy.

## Database (MongoDB Atlas)
1. Whitelist production IP addresses.
2. Enable database alerts for slow queries.
3. Schedule daily backups.
