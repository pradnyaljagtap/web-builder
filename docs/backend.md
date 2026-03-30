# Backend Documentation — Web Builder

## Overview

This document outlines the backend architecture, API design, database schema, and tech stack required to support the Web Builder frontend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT (JSON Web Tokens) |
| File Storage | Cloudinary (images/assets) |
| Password Hashing | bcrypt |
| Validation | Zod |

---

## Project Structure

```
backend/
├── src/
│   ├── index.ts                  # Entry point
│   ├── app.ts                    # Express app setup
│   ├── config/
│   │   └── env.ts                # Environment variables
│   ├── middleware/
│   │   ├── auth.ts               # JWT auth middleware
│   │   └── errorHandler.ts       # Global error handler
│   ├── routes/
│   │   ├── auth.routes.ts        # /auth endpoints
│   │   ├── project.routes.ts     # /projects endpoints
│   │   └── asset.routes.ts       # /assets endpoints
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── project.controller.ts
│   │   └── asset.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── project.service.ts
│   │   └── asset.service.ts
│   └── prisma/
│       └── schema.prisma         # Database schema
├── package.json
├── tsconfig.json
└── .env
```

---

## Database Schema (Prisma)

```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  name      String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  projects  Project[]
  assets    Asset[]
}

model Project {
  id          String   @id @default(uuid())
  name        String
  description String?
  tree        Json     // Component tree (the builder JSON)
  published   Boolean  @default(false)
  publishedAt DateTime?
  slug        String?  @unique  // for public URL e.g. /pages/my-landing-page
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}

model Asset {
  id        String   @id @default(uuid())
  name      String
  url       String   // Cloudinary URL
  publicId  String   // Cloudinary public ID (for deletion)
  type      String   // image, video, etc.
  size      Int      // file size in bytes
  createdAt DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/webbuilder

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## API Reference

### Authentication

#### Register
```
POST /auth/register
```
**Request Body:**
```json
{
  "name": "Pradnya",
  "email": "pradnya@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Pradnya",
    "email": "pradnya@example.com"
  }
}
```

---

#### Login
```
POST /auth/login
```
**Request Body:**
```json
{
  "email": "pradnya@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Pradnya",
    "email": "pradnya@example.com"
  }
}
```

---

#### Get Current User
```
GET /auth/me
Authorization: Bearer <token>
```
**Response:**
```json
{
  "id": "uuid",
  "name": "Pradnya",
  "email": "pradnya@example.com",
  "createdAt": "2026-03-30T00:00:00.000Z"
}
```

---

### Projects

> All project endpoints require `Authorization: Bearer <token>` header.

#### List All Projects
```
GET /projects
```
**Response:**
```json
[
  {
    "id": "uuid",
    "name": "My Landing Page",
    "description": "A homepage design",
    "published": false,
    "createdAt": "2026-03-30T00:00:00.000Z",
    "updatedAt": "2026-03-30T00:00:00.000Z"
  }
]
```

---

#### Create Project
```
POST /projects
```
**Request Body:**
```json
{
  "name": "My Landing Page",
  "description": "A homepage design",
  "tree": []
}
```
**Response:**
```json
{
  "id": "uuid",
  "name": "My Landing Page",
  "tree": [],
  "published": false,
  "createdAt": "2026-03-30T00:00:00.000Z"
}
```

---

#### Get Project by ID
```
GET /projects/:id
```
**Response:**
```json
{
  "id": "uuid",
  "name": "My Landing Page",
  "tree": [ ... ],
  "published": false,
  "createdAt": "2026-03-30T00:00:00.000Z"
}
```

---

#### Update Project (Auto-save)
```
PUT /projects/:id
```
**Request Body:**
```json
{
  "name": "My Landing Page",
  "tree": [ ... ]
}
```
**Response:**
```json
{
  "id": "uuid",
  "name": "My Landing Page",
  "tree": [ ... ],
  "updatedAt": "2026-03-30T12:00:00.000Z"
}
```

---

#### Delete Project
```
DELETE /projects/:id
```
**Response:**
```json
{
  "message": "Project deleted successfully"
}
```

---

#### Publish Project
```
POST /projects/:id/publish
```
**Response:**
```json
{
  "id": "uuid",
  "published": true,
  "slug": "my-landing-page",
  "publishedUrl": "https://yoursite.com/pages/my-landing-page"
}
```

---

### Assets

> All asset endpoints require `Authorization: Bearer <token>` header.

#### Upload Asset
```
POST /assets/upload
Content-Type: multipart/form-data
```
**Request Body:**
```
file: <image file>
```
**Response:**
```json
{
  "id": "uuid",
  "name": "logo.png",
  "url": "https://res.cloudinary.com/yourcloud/image/upload/v123/logo.png",
  "type": "image",
  "size": 204800
}
```

---

#### List Assets
```
GET /assets
```
**Response:**
```json
[
  {
    "id": "uuid",
    "name": "logo.png",
    "url": "https://res.cloudinary.com/...",
    "type": "image",
    "size": 204800,
    "createdAt": "2026-03-30T00:00:00.000Z"
  }
]
```

---

#### Delete Asset
```
DELETE /assets/:id
```
**Response:**
```json
{
  "message": "Asset deleted successfully"
}
```

---

## Authentication Flow

```
1. User registers / logs in
2. Server returns JWT token
3. Frontend stores token in localStorage
4. Every request includes: Authorization: Bearer <token>
5. Auth middleware validates token on protected routes
6. Token expires in 7 days → user must log in again
```

---

## Auto-Save Flow

```
1. User makes changes in the builder
2. Frontend debounces changes (wait 2 seconds after last change)
3. Frontend calls PUT /projects/:id with updated tree JSON
4. Server saves to PostgreSQL
5. Frontend shows "Saved" indicator
```

---

## Publish Flow

```
1. User clicks "Publish" in the builder
2. Frontend calls POST /projects/:id/publish
3. Server generates HTML from the tree JSON
4. HTML is saved as a static file or stored in DB
5. Server returns a public URL
6. User can share the URL
```

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "statusCode": 401
}
```

| Status Code | Meaning |
|---|---|
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (not your resource) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Getting Started (Backend Setup)

```bash
# 1. Create project
mkdir web-builder-backend && cd web-builder-backend
npm init -y
npm install express prisma @prisma/client bcrypt jsonwebtoken zod multer cloudinary

# 2. Setup Prisma
npx prisma init
# Add schema, then:
npx prisma migrate dev --name init

# 3. Run dev server
npm run dev
```

---

## Frontend Integration

In the Vue frontend, add an API service:

```typescript
// src/services/api.ts
const BASE_URL = 'http://localhost:3000'

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

export const api = {
  // Auth
  register: (data: object) =>
    fetch(`${BASE_URL}/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }),

  login: (data: object) =>
    fetch(`${BASE_URL}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }),

  // Projects
  getProjects: () =>
    fetch(`${BASE_URL}/projects`, { headers: headers() }),

  saveProject: (id: string, tree: object) =>
    fetch(`${BASE_URL}/projects/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify({ tree }) }),

  // Assets
  uploadAsset: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return fetch(`${BASE_URL}/assets/upload`, { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, body: form })
  },
}
```
