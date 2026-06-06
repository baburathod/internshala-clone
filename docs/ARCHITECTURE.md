# System Architecture

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
2. Client sends POST to `/applications`.
3. Server validates Subscription usage limits.
4. Server inserts Application document.
5. Server sends email notification to employer via SMTP.
6. Server returns 201 Created.
