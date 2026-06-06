const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');

const docs = [
  {
    name: 'README.md',
    content: `# Intern Area (Internshala Clone)

## Overview
Intern Area is a full-stack, production-grade platform serving as a comprehensive internship and job marketplace. It seamlessly connects millions of students with meaningful career opportunities while providing employers with highly optimized tools for recruitment, screening, and hiring.

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Authentication:** Firebase Auth (Google + Email/Password + OTP)
- **Payments:** Razorpay
- **Cloud & Media:** Cloudinary
- **Emails:** Nodemailer / SMTP
`
  },
  {
    name: 'API_DOCUMENTATION.md',
    content: `# API Documentation

## Base URL
\`https://api.internarea.com/api\`

## Authentication
All protected routes require a Firebase ID Token passed in the \`Authorization: Bearer <token>\` header.

## Core Endpoints

### Users
- \`POST /users/sync\` - Sync Firebase UID to MongoDB.
- \`GET /users/search?q={query}\` - Search users by name.

### Jobs & Internships
- \`GET /jobs\` - Fetch all active jobs.
- \`GET /internships\` - Fetch all active internships.
- \`POST /applications\` - Apply to an opportunity.

### Subscriptions
- \`POST /subscriptions/create-order\` - Generates Razorpay Order (10 AM to 11 AM IST ONLY).
- \`POST /subscriptions/verify-payment\` - Verifies Razorpay signature and provisions plan.

### Community
- \`POST /community/posts\` - Create post (Validates Friend limits dynamically).
- \`PUT /community/posts/:id/like\` - Toggle like on a post.

### Password Reset
- \`POST /password/reset\` - Generates temporary alphabet-only password. Rate limited to 1 per 24 hours.
`
  },
  {
    name: 'DATABASE_DOCUMENTATION.md',
    content: `# Database Schema Documentation

The platform uses MongoDB with Mongoose ODM.

## Collections

### Users
Stores user profiles, preferences, active subscription plan, and login histories.
- \`uid\` (String, Firebase ID)
- \`email\` (String)
- \`subscriptionPlan\` (Enum: Free, Bronze, Silver, Gold)
- \`friends\` (Array of ObjectIds)

### Jobs & Internships
Stores listings from employers.
- \`title\` (String)
- \`company\` (String)
- \`stipend\` (String)
- \`location\` (String)

### Applications
Links a User to a Job/Internship.
- \`user\` (ObjectId)
- \`jobId\` / \`internshipId\` (ObjectId)
- \`status\` (Enum: pending, accepted, rejected)

### PasswordResets
Tracks forgot-password requests to enforce the 1 request/day limit.
- \`identifier\` (String)
- \`temporaryPassword\` (String)
- \`resetDate\` (Date)
`
  },
  {
    name: 'DEPLOYMENT_GUIDE.md',
    content: `# Deployment Guide

## Frontend (Vercel)
1. Push codebase to GitHub.
2. Import repository into Vercel.
3. Set Build Command: \`npm run build\`
4. Set Output Directory: \`.next\`
5. Configure Environment Variables (\`NEXT_PUBLIC_API_URL\`, \`NEXT_PUBLIC_FIREBASE_*\`).
6. Deploy.

## Backend (Render / Heroku)
1. Create a Web Service in Render.
2. Point to the \`backend/\` directory or set Root Directory to \`backend\`.
3. Set Build Command: \`npm install\`
4. Set Start Command: \`node index.js\`
5. Configure Environment Variables (\`MONGO_URI\`, \`RAZORPAY_KEY_ID\`, \`SMTP_PASS\`).
6. Deploy.

## Database (MongoDB Atlas)
1. Whitelist production IP addresses.
2. Enable database alerts for slow queries.
3. Schedule daily backups.
`
  },
  {
    name: 'TESTING_GUIDE.md',
    content: `# Testing Guide

## Manual Verification
1. **Authentication:** 
   - Ensure Guests cannot apply for jobs or access community.
   - Verify Mobile login restriction (10 AM to 1 PM).
2. **Subscriptions:** 
   - Attempt payment outside of 10 AM-11 AM IST to verify 403 Forbidden.
   - Verify Razorpay test mode signature processing.
3. **Password Reset:**
   - Request reset, check email/SMS for A-Z only password.
   - Request again within 24 hours to verify 429 Too Many Requests.
4. **Community Limits:**
   - Attempt to post with 0 friends to verify 403 Forbidden.

## Automated Testing
- Frontend tests located in \`internarea/__tests__\` (Jest/React Testing Library).
- Backend tests located in \`backend/tests\` (Mocha/Chai).
`
  },
  {
    name: 'SECURITY_REVIEW.md',
    content: `# Security Review & Hardening Report

## Authentication & Authorization
- **Firebase Auth:** Handles primary credential management.
- **Protected Routes:** All secure frontend pages are wrapped in \`<ProtectedRoute>\`.
- **Role-Based Access Control:** Backend validates \`req.user\` for endpoints.

## Rate Limiting & Abuse Prevention
- **Password Resets:** Strictly limited to 1 request per 24 hours per user via MongoDB TTL logic.
- **Posting Limits:** Enforced dynamically on the backend. 0 friends = 0 posts, scaling up.
- **Payment Gateway:** Payments only accepted during an explicit 1 hour window (10 AM - 11 AM IST).
- **Mobile Logins:** Time-restricted to 10 AM - 1 PM IST.

## Input Validation & Data Integrity
- Passwords generated by the system contain strictly alphabetic characters (A-Z, a-z) as requested.
- Mongoose schemas enforce data types and prevent NoSQL injection.

## XSS & CSRF
- React DOM naturally escapes values to prevent XSS.
`
  },
  {
    name: 'ARCHITECTURE.md',
    content: `# System Architecture

## Overview
Intern Area utilizes a decoupled Client-Server architecture.

### Client Layer
Next.js provides SSR (Server-Side Rendering) for SEO-critical pages (like the 31 dynamically generated footer pages) and CSR (Client-Side Rendering) for highly interactive dashboards (Community, Admin Panel).
State is managed globally via Redux Toolkit.

### Server Layer
Node.js/Express acts as a RESTful API gateway. It orchestrates business logic, rate limiting, and third-party API integrations (Razorpay, Cloudinary, SMTP).

### Data Layer
MongoDB Atlas provides scalable document storage. Firebase handles realtime auth syncing and OTP deliveries.

### Event Flow (Example: Applying for Job)
1. Client clicks Apply (Validates Auth state).
2. Client sends POST to \`/applications\`.
3. Server validates Subscription usage limits.
4. Server inserts Application document.
5. Server sends email notification to employer via SMTP.
6. Server returns 201 Created.
`
  },
  {
    name: 'FOLDER_STRUCTURE.md',
    content: `# Folder Structure Documentation

\`\`\`
internshala-clone/
├── backend/                  # Node.js Express API
│   ├── Model/                # Mongoose Schemas (User, Job, Post, PasswordReset)
│   ├── Routes/               # API Controllers (auth, jobs, community, subscription)
│   ├── services/             # Third-party integrations (Nodemailer)
│   └── index.js              # Entry point
├── internarea/               # Next.js Frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── Components/       # Reusable UI (Navbar, Footer, Modals)
│   │   ├── Feature/          # Redux Slices
│   │   ├── pages/            # Next.js Routing
│   │   │   ├── community/    # Social features
│   │   │   ├── jobs/         # Job listings
│   │   │   ├── internships/  # Internship listings
│   │   │   └── ...           # 31 generated footer pages
│   │   └── firebase/         # Firebase config
├── docs/                     # Architecture & Guidelines
└── generate-pages.js         # Build script for static footer content
\`\`\`
`
  }
];

docs.forEach(doc => {
  fs.writeFileSync(path.join(docsDir, doc.name), doc.content);
  console.log('Created:', doc.name);
});
