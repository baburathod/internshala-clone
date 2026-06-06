# API Documentation

## Base URL
`https://api.internarea.com/api`

## Authentication
All protected routes require a Firebase ID Token passed in the `Authorization: Bearer <token>` header.

## Core Endpoints

### Users
- `POST /users/sync` - Sync Firebase UID to MongoDB.
- `GET /users/search?q={query}` - Search users by name.

### Jobs & Internships
- `GET /jobs` - Fetch all active jobs.
- `GET /internships` - Fetch all active internships.
- `POST /applications` - Apply to an opportunity.

### Subscriptions
- `POST /subscriptions/create-order` - Generates Razorpay Order (10 AM to 11 AM IST ONLY).
- `POST /subscriptions/verify-payment` - Verifies Razorpay signature and provisions plan.

### Community
- `POST /community/posts` - Create post (Validates Friend limits dynamically).
- `PUT /community/posts/:id/like` - Toggle like on a post.

### Password Reset
- `POST /password/reset` - Generates temporary alphabet-only password. Rate limited to 1 per 24 hours.
