# 🎟️ TGB Event Booking System

A secure full-stack web application for managing events, tickets, and reservations.  
Implements **JWT authentication**, **role-based access control (RBAC)**, **relational data modeling**, and is packaged for deployment with Docker.

---

## 🚀 Features
- **Authentication & Authorization**
  - JWT access + refresh tokens (rotation & revocation supported).
  - Password hashing with bcrypt.
  - Role-based access control (Admin, Organizer, Customer).
- **Event Management**
  - Organizers/Admins can create, update, and delete events.
  - Customers can browse events and book tickets.
- **Reservations & Payments**
  - Customers can create and cancel reservations.
  - Payments entity scaffolded for integration.
- **Frontend**
  - React (Vite) with role-based dashboards.
  - Secure login/logout flow with token refresh.
  - Protected routes (Admin/Organizer/Customer views).
- **Backend**
  - Node.js + Express + Prisma ORM.
  - Relational database schema (SQLite demo → PostgreSQL ready).
  - Validation, error handling, and logging middleware.
- **Deployment**
  - Dockerized frontend and backend.
  - `docker-compose.yml` for local orchestration.
  - Ready for cloud deployment (Render/Heroku/Vercel/AWS).
- **Testing**
  - Jest setup for unit/integration tests (backend).
- **CI/CD (Bonus)**
  - GitHub Actions workflow (sample config included).

---

## 📂 Project Structure
```
tgb-event-booking/
│── backend/        # Express + Prisma backend
│── frontend/       # React (Vite) frontend
│── docker-compose.yml
│── README.md
```

---

## 🛠️ Quick Start (Local)

### 1. Clone and enter project
```bash
git clone <repo-url> tgb-event-booking
cd tgb-event-booking
```

### 2. Backend (API)
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```
👉 Runs at **http://localhost:4000**

### 3. Frontend (UI)
```bash
cd ../frontend
npm install
npm run dev
```
👉 Runs at **http://localhost:5173**

---

## 🌐 API Endpoints (Sample)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Events
- `GET /api/events`
- `POST /api/events` *(Organizer/Admin only)*

### Reservations
- `POST /api/reservations` *(Customer only)*
- `DELETE /api/reservations/:id`

---

## 🗄️ Database (Prisma Schema)
Entities:
- **User** (role: Admin/Organizer/Customer)  
- **Event**  
- **Ticket**  
- **Reservation**  
- **Payment**  
- **RefreshToken**

SQLite is used for demo.  
👉 For production:
- Update `datasource` in `prisma/schema.prisma` to PostgreSQL.
- Run `npx prisma migrate deploy`.

---

## 🐳 Run with Docker
```bash
docker-compose up --build
```
- Backend → http://localhost:4000  
- Frontend → http://localhost:5173  

---
