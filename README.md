# ⚡ FieldOps — Field Service Management Platform

<div align="center">

![FieldOps Banner](https://img.shields.io/badge/FieldOps-Management%20Platform-1a5276?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkwyIDdsIDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNU0yIDEybDEwIDUgMTAtNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=)

**A modern full-stack Field Service Management Platform built with NestJS, Next.js, MongoDB, and Docker.**

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

[Live Demo](https://field-ops-nine-azure.vercel.app) · [Report Bug](https://github.com/Raheel-Collab968/fieldops/issues) · [Request Feature](https://github.com/Raheel-Collab968/fieldops/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Routes](#-api-routes)
- [Role Permissions](#-role-permissions)
- [Screenshots](#-screenshots)
- [Author](#-author)

---

## 🧠 About

FieldOps is a production-grade **Field Service Management Platform** that allows companies to manage field technicians, assign service jobs, and let clients track their job progress in real time.

The platform supports **three distinct user roles** — Admin, Client, and Technician — each with their own dashboard, permissions, and workflow.

> Built as a portfolio project to demonstrate real-world backend architecture using NestJS, MongoDB, JWT authentication, role-based access control, dynamic permission management, and Docker containerization.

---

## ✨ Features

### 👤 Authentication & Authorization
- JWT-based authentication with secure HTTP-only cookies
- Three roles: **Admin**, **Client**, **Technician**
- Role-based route protection (Guards + Decorators)
- Dynamic permission management (Admin controls per-user checkboxes)

### 🏢 Admin
- Full platform dashboard with stats overview
- View, verify, publish, reject, and assign all jobs
- Manage all users (view, deactivate)
- Dynamic permission panel — grant/revoke specific actions per user
- Audit log on every job action

### 👤 Client
- Create and manage service jobs
- Track job status in real time with full audit timeline
- Cancel jobs (only when PENDING or VERIFIED)
- View assigned technician details

### 🔧 Technician
- Browse all open (published) jobs
- Apply for jobs with a cover note
- View all assigned jobs
- Update job status (IN_PROGRESS → COMPLETED)

### 📦 Jobs Lifecycle
```
PENDING → VERIFIED → OPEN → ASSIGNED → IN_PROGRESS → COMPLETED
```

### 🔒 Fine-Grained Permissions
- Admin can toggle individual permissions per user
- Permissions: JOB_CREATE, JOB_VIEW, JOB_EDIT, JOB_DELETE, USER_VIEW, APP_CREATE, etc.
- Auto-created on registration with all false by default

### 📄 Pagination & Filtering
- All listing endpoints support pagination
- Filter by status, search by title/location/client name
- Sort by date ascending or descending

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, TypeScript, Ant Design, Tailwind CSS |
| **Backend** | NestJS, TypeScript |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication** | JWT, Passport.js, bcryptjs |
| **Containerization** | Docker, docker-compose |
| **Deployment** | Vercel (Frontend), Railway (Backend) |
| **HTTP Client** | Axios with interceptors |
| **State Management** | React Context API |
| **Cookie Management** | cookies-next |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Next.js)                  │
│   Admin Portal │ Client Portal │ Technician Portal   │
└─────────────────────────┬───────────────────────────┘
                          │ HTTP / REST API
                          ▼
┌─────────────────────────────────────────────────────┐
│                  NESTJS BACKEND                      │
│                                                      │
│  Auth Module  │  Jobs Module  │  Permission Module   │
│  Users Module │  Admin Module │  Technician Module   │
│                                                      │
│  JWT Guard ──► Roles Guard ──► Permission Guard      │
└─────────────────────────┬───────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                    MONGODB                           │
│  users │ jobs │ permissions                          │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org) v18+
- [Docker](https://docker.com) + Docker Compose
- [MongoDB](https://mongodb.com) (or use Docker)
- [Git](https://git-scm.com)

### Clone the repository

```bash
git clone https://github.com/Raheel-Collab968/fieldops.git
cd fieldops
```

---

### Option 1 — Run with Docker (Recommended)

```bash
# Copy environment files
cp backend/.env.example backend/.env
cp client/.env.example client/.env.local

# Start everything with one command
docker-compose up --build
```

Services will be available at:
- **Frontend** → http://localhost:3000
- **Backend API** → http://localhost:4000
- **MongoDB** → mongodb://localhost:27017

---

### Option 2 — Run Manually

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run start:dev
```

#### Frontend

```bash
cd client
npm install
cp .env.example .env.local
# Fill in your .env.local values
npm run dev
```

---

## 🔐 Environment Variables

### Backend `.env`

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/fieldops

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# App
PORT=4000
NODE_ENV=development
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 📡 API Routes

### Auth `/auth`

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login + get JWT |
| GET | `/auth/admin/all-users` | Admin | Get all users (paginated) |
| GET | `/auth/:id` | Admin | Get single user |
| DELETE | `/auth/:id` | Admin | Delete user |

### Jobs `/jobs`

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/jobs/create` | Client | Create new job |
| GET | `/jobs/client/my-all-jobs` | Client | My jobs (paginated) |
| GET | `/jobs/client/:id` | Client | Single job detail |
| PATCH | `/jobs/client/:id` | Client | Edit job (PENDING only) |
| DELETE | `/jobs/:id` | Client | Cancel job |
| GET | `/jobs` | Any Auth | All jobs (paginated) |
| GET | `/jobs/open` | Any Auth | Open jobs |
| GET | `/jobs/:id` | Any Auth | Single job |

### Admin `/admin`

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/admin/verify-job/:id` | Admin | Verify + publish job |
| PATCH | `/admin/assign/:id` | Admin | Assign technician |
| PATCH | `/admin/reject/:id` | Admin | Reject job |
| GET | `/admin/dashboard-data` | Admin | Platform stats |

### Technician `/technician`

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/technician/apply/:id` | Technician | Apply for job |
| PATCH | `/technician/update-status/:id` | Technician | Update job status |
| GET | `/technician/assigned` | Technician | My assigned jobs |
| GET | `/technician/applied` | Technician | Jobs I applied to |
| GET | `/technician/my-all-jobs` | Technician | All my jobs |

### Permissions `/permissions`

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/permissions` | Admin | All users' permissions |
| GET | `/permissions/user/:userId` | Admin | Single user permissions |
| PATCH | `/permissions/:id` | Admin | Update checkboxes |
| POST | `/permissions/grant` | Admin | Grant all permissions |
| DELETE | `/permissions/revoke/:userId/:module` | Admin | Revoke permission |
| POST | `/permissions/check` | Any Auth | Check permission |

---

## 👥 Role Permissions

| Action | Admin | Client | Technician |
|--------|-------|--------|-----------|
| Create Job | ❌ | ✅ | ❌ |
| View All Jobs | ✅ | ❌ | ❌ |
| View Own Jobs | ✅ | ✅ | ✅ |
| Verify Job | ✅ | ❌ | ❌ |
| Assign Technician | ✅ | ❌ | ❌ |
| Apply for Job | ❌ | ❌ | ✅ |
| Update Job Status | ✅ | ❌ | ✅ |
| Manage Users | ✅ | ❌ | ❌ |
| Manage Permissions | ✅ | ❌ | ❌ |
| View Dashboard | ✅ | ✅ | ✅ |

---

## 📊 Job Status Flow

```
CLIENT creates job
       │
       ▼
   PENDING ──────────────────────► CANCELLED (by client)
       │
       │ Admin verifies
       ▼
   VERIFIED ─────────────────────► REJECTED (by admin)
       │
       │ Admin publishes
       ▼
    OPEN (technicians can apply)
       │
       │ Admin assigns technician
       ▼
   ASSIGNED
       │
       │ Technician starts
       ▼
  IN_PROGRESS
       │
       │ Technician completes
       ▼
  COMPLETED ✅
```

---

## 📸 Screenshots

### Admin Dashboard
> Platform overview with total jobs, users, and recent activity

### Client Dashboard
> Job creation and status tracking with audit timeline

### Technician Dashboard
> Browse open jobs, apply, and manage assigned work

### Permission Panel
> Admin controls fine-grained permissions per user with checkboxes

---

## 👨‍💻 Author

**Raheel Ahmed**

> Full Stack Developer | MERN · NestJS · TypeScript · Docker · Claude AI

[![Portfolio](https://img.shields.io/badge/Portfolio-raheelcollab.vercel.app-1a5276?style=flat-square&logo=vercel)](https://raheelcollab.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-raheel--ahmed-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/raheel-ahmed-301853315)
[![GitHub](https://img.shields.io/badge/GitHub-Raheel--Collab968-181717?style=flat-square&logo=github)](https://github.com/Raheel-Collab968)
[![Email](https://img.shields.io/badge/Email-raheelcollab@gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:raheelcollab@gmail.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by [Raheel Ahmed](https://raheelcollab.vercel.app)

</div>
