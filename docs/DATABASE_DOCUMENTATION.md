# Database Schema Documentation

The platform uses MongoDB with Mongoose ODM.

## Collections

### Users
Stores user profiles, preferences, active subscription plan, and login histories.
- `uid` (String, Firebase ID)
- `email` (String)
- `subscriptionPlan` (Enum: Free, Bronze, Silver, Gold)
- `friends` (Array of ObjectIds)

### Jobs & Internships
Stores listings from employers.
- `title` (String)
- `company` (String)
- `stipend` (String)
- `location` (String)

### Applications
Links a User to a Job/Internship.
- `user` (ObjectId)
- `jobId` / `internshipId` (ObjectId)
- `status` (Enum: pending, accepted, rejected)

### PasswordResets
Tracks forgot-password requests to enforce the 1 request/day limit.
- `identifier` (String)
- `temporaryPassword` (String)
- `resetDate` (Date)
