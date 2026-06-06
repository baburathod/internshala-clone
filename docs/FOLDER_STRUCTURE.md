# Folder Structure Documentation

```
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
```
