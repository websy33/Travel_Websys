# Project Master Analysis

## 1. Project Overview
**Traveligo** is a comprehensive travel booking platform built with modern web technologies. It allows users to browse and book flights, hotels, trains, cabs, and holiday packages.

## 2. Technology Stack
| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Deployment** | Vercel (Frontend), Node.js Server (Backend) |

## 3. Project Structure

### Frontend (`/src`)
- `Pages/` - Main views (Home, Hotels, Flights, Trains, Cabs)
- `Components/` - Reusable UI components
- `Footer/` - Static pages (About, Destinations, Policies)
- `auth/` - Authentication context and protected routes
- `services/api.js` - **NEW** API client for backend communication
- `hooks/useHotelStorage.js` - **REFACTORED** Hotel data management hook

### Backend (`/backend`) - **NEW**
```
backend/
├── server.js           # Express entry point
├── config/db.js        # MongoDB connection
├── models/
│   ├── Hotel.js        # Hotel schema with reviews, rooms, approval
│   └── User.js         # User schema with roles and password hashing
├── routes/
│   ├── authRoutes.js   # /api/auth/* endpoints
│   └── hotelRoutes.js  # /api/hotels/* endpoints
├── controllers/        # Business logic
├── middleware/         # JWT auth middleware
└── seed.js             # Database seeder
```

## 4. API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register new user |
| POST | `/login` | Login and get JWT token |
| GET | `/me` | Get current user profile |
| GET | `/users` | Get all users (Admin) |
| PUT | `/users/:id/approve` | Approve user (Admin) |

### Hotels (`/api/hotels`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all approved hotels (with filters) |
| GET | `/:id` | Get single hotel details |
| POST | `/` | Register new hotel (Auth required) |
| PUT | `/:id` | Update hotel (Owner/Admin) |
| DELETE | `/:id` | Delete hotel (Owner/Admin) |
| GET | `/admin/pending` | Get pending hotels (Admin) |
| PUT | `/:id/approve` | Approve hotel (Admin) |
| PUT | `/:id/reject` | Reject hotel (Admin) |
| POST | `/:id/reviews` | Add review (Auth required) |

## 5. Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (Local or Atlas)

### Backend Setup
```bash
cd backend
npm install
# Edit .env with your MongoDB URI
npm run dev
```

### Frontend Setup
```bash
cd frontend  # (root directory)
npm install
npm run dev
```

### Seed Database
```bash
cd backend
node seed.js
```
**Default Admin:** `admin@traveligo.com` / `admin123`

## 6. What's Next
- [ ] Remove remaining Firebase dependencies from Hotels.jsx
- [ ] Add booking system with Razorpay integration
- [ ] Deploy backend to production server
