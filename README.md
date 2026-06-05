# Internshala Clone 🚀

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Frontend](https://img.shields.io/badge/Frontend-Next.js-black?logo=next.js)
![Backend](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![Database](https://img.shields.io/badge/Database-MongoDB-success?logo=mongodb)
![Deployment](https://img.shields.io/badge/Deployed_on-Vercel_%7C_Render-black)

## Overview

A full-stack, highly scalable internship and job portal heavily inspired by Internshala. This platform empowers users to search for internships and jobs, network with peers in a dedicated community forum, and seamlessly manage their profiles. Built with a modern Next.js frontend and a robust Node.js/Express backend, the project emphasizes strict security practices, device-based authentication restrictions, and real-time database synchronization.

## Features

- **Advanced Authentication:** Google OAuth via Firebase, strictly protected by backend device verification, time-based login restrictions, and OTP validation for specific browsers.
- **Job & Internship Boards:** Dynamic browsing with multi-parameter filtering (Location, Category, Stipend, Work From Home, etc.).
- **Community Forum:** Social networking features including sending friend requests, creating posts (with dynamic rate-limiting based on friend count), and commenting.
- **Multi-Language Support:** Integrated `react-i18next` with specialized OTP-gated access to language modules (e.g., French).
- **Security & Audit Trails:** Comprehensive logging of all login attempts, device types, operating systems, and IP addresses.
- **Premium Subscriptions:** Integrated with Razorpay for handling premium user tiers and payments.

## Tech Stack

- **Frontend:** Next.js (Pages Router), React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** Firebase Auth (Google OAuth), Custom JWT / OTP Verification
- **State Management:** Redux Toolkit (`react-redux`)
- **Deployment:** Vercel (Frontend), Render (Backend)
- **Third-Party Services:** Razorpay (Payments), Nodemailer (SMTP Emails), Cloudinary (Media Uploads), UAParser (Device Tracking)

## Architecture Overview

1. **Client Layer:** Next.js serves a highly optimized React frontend. Redux manages the global user state.
2. **Auth Layer:** Firebase handles the initial Google OAuth redirect. Once authenticated, the frontend silently synchronizes the Firebase UID with the Node.js backend.
3. **Security Gateway:** The Node.js backend analyzes the incoming request (User-Agent, IP). If anomalous behavior is detected (e.g., Chrome browser or restricted mobile login hours), it blocks the request and dispatches an OTP via SMTP.
4. **Data Layer:** MongoDB Atlas securely stores User profiles, Job listings, Community Posts, Friend Requests, and immutable Login Audit histories.

## Project Structure

```text
📦 internshala-clone
 ┣ 📂 backend
 ┃ ┣ 📂 Model             # Mongoose schemas (User, Post, Comment, LoginHistory...)
 ┃ ┣ 📂 Routes            # Express endpoints (auth, community, job, internship...)
 ┃ ┣ 📂 services          # SMTP email and Razorpay configuration
 ┃ ┣ 📜 index.js          # Express server entry point
 ┃ ┗ 📜 db.js             # MongoDB connection logic
 ┗ 📂 internarea (Frontend)
   ┣ 📂 src
   ┃ ┣ 📂 Components      # Reusable UI (Navbar, Footer, Modals)
   ┃ ┣ 📂 Feature         # Redux Slices (Userslice.js)
   ┃ ┣ 📂 firebase        # Firebase initialization and config
   ┃ ┣ 📂 pages           # Next.js routing (index, job, internship, community)
   ┃ ┣ 📂 store           # Redux store configuration
   ┃ ┗ 📂 config          # API base URLs and i18n configurations
   ┣ 📜 next.config.js    # Next.js settings
   ┗ 📜 tailwind.config.js# Tailwind theme and utility configuration
```

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/internshala-clone.git
cd internshala-clone
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run start
```

### 3. Frontend Setup
```bash
cd ../internarea
npm install
npm run dev
```

## Environment Variables

### Frontend (`internarea/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=465
SMTP_USER=your_email@domain.com
SMTP_PASS=your_app_password
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /verify-login` - Verifies device limits and triggers OTPs if required.
- `POST /verify-otp` - Validates email OTPs for restricted browsers.
- `GET /history/:uid` - Retrieves the user's login audit trail.

### Community (`/api/users` & `/api/posts`)
- `POST /users/sync` - Synchronizes Firebase UID with MongoDB.
- `GET /users/search` - Search for users to add as friends.
- `POST /friends/request` - Send a friend request.
- `POST /posts` - Create a community post (Enforces dynamic rate limits based on friend count).
- `PUT /posts/:postId/like` - Toggle post like status.

## Authentication Flow

1. **Initiation:** User clicks "Login". Firebase `signInWithRedirect` executes.
2. **Provider Validation:** Google validates the user and redirects back to the Next.js app.
3. **Synchronization:** `onAuthStateChanged` fires. The frontend sends the Firebase `uid` to `/api/users/sync` to ensure the user exists in MongoDB.
4. **Device Verification:** Frontend calls `/api/auth/verify-login`. The backend parses the User-Agent.
   - *Mobile Restriction:* If the device is Mobile and the time is outside 10:00 AM - 1:00 PM, login is rejected (403).
   - *Browser Restriction:* If Chrome is detected, a 6-digit OTP is generated, saved to MongoDB (`LoginOtp`), sent via SMTP, and a 401 is returned. The frontend opens an OTP modal.
5. **Completion:** Upon success (or successful OTP validation), Redux `dispatch(login())` executes, updating the global UI.

## Database Models

- **User:** Stores `uid`, `name`, `email`, `photo`, and an array of `friends`.
- **Post:** Stores references to the `User`, media (`image`/`video`), `text`, array of `likes`, and references to `comments`.
- **Comment:** Belongs to a `Post` and a `User`.
- **FriendRequest:** Tracks `sender`, `receiver`, and `status` (pending, accepted, rejected).
- **LoginHistory:** Immutable audit trail recording `user`, `browser`, `os`, `ipAddress`, and `status`.
- **LoginOtp:** Temporary collection storing TTL-indexed OTP codes for 2FA.

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub.
2. Import the `internarea` directory into Vercel.
3. Add all `NEXT_PUBLIC_` environment variables in the Vercel Dashboard.
4. Click Deploy. Ensure your Vercel domains are added to the Firebase Authorized Domains list.

### Backend (Render)
1. Create a new Web Service on Render.
2. Connect the GitHub repository and set the root directory to `backend`.
3. Set the build command to `npm install` and start command to `node index.js`.
4. Add backend environment variables (MongoDB URI, SMTP credentials, etc.).

## Screenshots

![Homepage Slider](https://via.placeholder.com/800x400.png?text=Homepage+Slider+View)
![Job Filters](https://via.placeholder.com/800x400.png?text=Advanced+Job+Filtering)
![Community Forum](https://via.placeholder.com/800x400.png?text=Community+Forum+and+Posts)

## Future Improvements

- **Admin Dashboard:** A secure panel to approve, reject, or manually curate job and internship postings.
- **Server-Side Rendering (SSR):** Migrate job fetching to `getServerSideProps` to improve SEO ranking for individual job listings.
- **Real-Time Chat:** Integrate Socket.io to allow users to directly message their accepted friends.
- **Skeleton Loaders:** Replace simple CSS pulsing boxes with intricate skeleton loaders for better perceived performance during Axios calls.

## Challenges Solved

- **"Logout Loop" Prevention:** Architected a fail-safe Redux listener that gracefully handles backend network failures without crashing the application or improperly wiping Firebase authentication states.
- **Strict Security Constraints:** Built a custom device-fingerprinting middleware using `ua-parser-js` that intelligently gates access based on the user's specific browser and local time, creating an advanced layer of security entirely independent of Firebase.
- **Cross-Origin Configuration:** Resolved strict Mixed-Content policies by properly routing Vercel HTTPS frontend requests to a secured Render HTTPS backend API.

## Learning Outcomes

- Mastery of integrating serverless frontends (Vercel) with persistent backends (Render).
- Advanced handling of global state management using Redux Toolkit in tandem with asynchronous Firebase listeners.
- Expertise in creating robust, scalable MongoDB schemas with complex relational population (e.g., deeply populating users within comments within posts).
- Implementation of enterprise-level security paradigms including Device Fingerprinting, OTP-based 2FA, and Audit Trail logging.

## Author

**Senior Full Stack Engineer**  
Specializing in React, Next.js, Node.js, and Cloud Infrastructure. Passionate about building scalable, secure, and performant web applications.
