# ZIVARA — Frontend E-Commerce Application

> **Status:** Frontend Only — All backend logic replaced with mock data and TODO comments.
> Connect a Node.js + Express + MongoDB backend to make it fully functional.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Guide](#setup-guide)
- [Demo Credentials](#demo-credentials)
- [Frontend Features](#frontend-features)
- [Connecting the Backend (MongoDB + Express)](#connecting-the-backend)
- [API Endpoint Reference](#api-endpoint-reference)

---

## Overview

ZIVARA is a premium fashion e-commerce platform with:
- **Customer storefront** — product browsing, search, cart, account
- **AI Virtual Try-On** — upload photo + select clothing = AI preview
- **Admin Panel** — full dashboard with products, orders, users, categories, coupons, sliders, flash sales, reviews, notifications, and settings

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | React 18 + TypeScript             |
| Build Tool  | Vite                              |
| Styling     | Tailwind CSS + shadcn/ui          |
| Routing     | React Router DOM v6               |
| State       | Context API (Auth + Cart)         |
| Animation   | Framer Motion                     |
| Icons       | Lucide React                      |
| Charts      | Recharts                          |

---

## Project Structure

```
src/
├── assets/              # Static images
├── components/
│   ├── admin/           # Admin panel components
│   │   ├── AdminLayout.tsx   # Auth guard + sidebar layout
│   │   ├── AdminSidebar.tsx  # Navigation sidebar
│   │   ├── DataTable.tsx     # Reusable data table
│   │   ├── StatsCard.tsx     # Dashboard stat card
│   │   └── charts/           # Revenue & sales charts
│   ├── home/            # Homepage section components
│   ├── layout/          # Navbar, Footer
│   └── ui/              # shadcn/ui components
├── data/
│   └── products.ts      # Static product mock data
├── hooks/
│   ├── useAuth.tsx      # Auth Context (mock — replace with JWT)
│   ├── useCart.tsx      # Cart Context (localStorage)
│   ├── useAITryOn.ts    # AI try-on hook (mock — connect backend)
│   └── use-toast.ts     # Toast notifications
├── lib/
│   ├── utils.ts         # Tailwind class helper
│   └── imageUtils.ts    # Image to base64 utility
├── pages/
│   ├── Index.tsx        # Homepage
│   ├── Products.tsx     # Product listing + filters
│   ├── ProductDetail.tsx # Single product page
│   ├── AITryOn.tsx      # AI Virtual Try-On page
│   ├── Login.tsx        # Customer login
│   ├── Register.tsx     # Customer registration
│   ├── Account.tsx      # User account/orders
│   ├── Cart.tsx         # Shopping cart
│   └── admin/           # Admin panel pages
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── Products.tsx
│       ├── Orders.tsx
│       ├── Users.tsx
│       ├── Categories.tsx
│       ├── Sliders.tsx
│       ├── Coupons.tsx
│       ├── Reviews.tsx
│       ├── Notifications.tsx
│       ├── FlashSales.tsx
│       └── Settings.tsx
├── App.tsx              # Routes definition
├── main.tsx             # Entry point
└── index.css            # Global styles + design tokens
```

---

## Setup Guide

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

#### Installing Node.js (Recommended: using nvm)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc  # or ~/.zshrc

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify
node --version  # v20.x.x
npm --version   # 10.x.x
```

#### Alternative: Direct Download
Download from [https://nodejs.org/](https://nodejs.org/) — choose the **LTS** version.

---

### Installing the Frontend

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd zivara-frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

### Available Scripts

```bash
npm run dev      # Start development server (hot reload)
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
npm test         # Run tests (Vitest)
```

---

## Demo Credentials

Since this is a **frontend-only** build, authentication uses mock localStorage-based sessions.

| Role         | Email                    | Password     |
|--------------|--------------------------|--------------|
| Super Admin  | admin@zivara.com         | any password |
| Moderator    | moderator@zivara.com     | any password |
| Customer     | customer@zivara.com      | any password |

> ⚠️ These are **demo-only** credentials. Replace with real auth when connecting the backend.

---

## Frontend Features

### Customer Panel
- ✅ Homepage with hero slider, featured categories, product grid
- ✅ Product listing with filters (category, price, sort) + search
- ✅ Product detail page with size/color selection
- ✅ AI Virtual Try-On interface (mock — connect backend AI service)
- ✅ Shopping cart with localStorage persistence
- ✅ Login / Register forms
- ✅ Account page with profile editing + order history (mock data)

### Admin Panel (`/admin`)
- ✅ Dashboard with stats cards + sales/revenue charts
- ✅ Products CRUD (create, edit, delete, SEO fields)
- ✅ Orders management with status updates
- ✅ Users management with role assignment + block/unblock
- ✅ Categories CRUD
- ✅ Sliders & Banners CRUD
- ✅ Coupons & Discounts CRUD
- ✅ Customer Reviews moderation
- ✅ Push Notifications management
- ✅ Flash Sales scheduler
- ✅ Website Settings (tax, shipping, site info)

---

## Connecting the Backend

### Step 1 — Set up Node.js + Express + MongoDB

```bash
mkdir zivara-backend
cd zivara-backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install -D nodemon
```

**Project structure:**
```
backend/
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Category.js
│   └── ...
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   └── ...
├── middleware/
│   └── auth.js          # JWT protection middleware
├── server.js
└── .env
```

**server.js:**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json({ limit: '10mb' })); // needed for base64 images

mongoose.connect(process.env.MONGODB_URI);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

app.listen(5000, () => console.log('Server running on port 5000'));
```

**.env:**
```
MONGODB_URI=mongodb://localhost:27017/zivara
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

---

### Step 2 — Auth Middleware

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const isAdmin = (req, res, next) => {
  if (!['admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { protect, isAdmin };
```

---

### Step 3 — Connect Frontend to Backend

In each file that contains `// TODO: Replace with:` comments, replace the mock code with real `fetch()` calls.

**Pattern:**
```typescript
// Example: fetching products
const res = await fetch('http://localhost:5000/api/products', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('zivara_token')}`,
  },
});
const data = await res.json();
setProducts(data.products);
```

**Key files to update:**
| File | TODO Action |
|------|-------------|
| `src/hooks/useAuth.tsx` | Replace mock signIn with POST /api/auth/login |
| `src/pages/Account.tsx` | Replace mock data with GET /api/users/me + GET /api/orders |
| `src/hooks/useAITryOn.ts` | Replace mock with POST /api/ai/tryon |
| `src/pages/admin/Products.tsx` | Replace mock with GET/POST/PUT/DELETE /api/admin/products |
| `src/pages/admin/Orders.tsx` | Replace mock with GET/PUT /api/admin/orders |
| `src/pages/admin/Users.tsx` | Replace mock with GET/PUT /api/admin/users |
| `src/pages/admin/Dashboard.tsx` | Replace mock with GET /api/admin/stats |

---

## API Endpoint Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user from token |
| POST | `/api/auth/logout` | Logout |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all active products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/admin/products` | Create product (admin) |
| PUT | `/api/admin/products/:id` | Update product (admin) |
| DELETE | `/api/admin/products/:id` | Delete product (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/me` | Get my orders |
| GET | `/api/admin/orders` | List all orders (admin) |
| PUT | `/api/admin/orders/:id` | Update order status (admin) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get my profile |
| PUT | `/api/users/me` | Update my profile |
| GET | `/api/admin/users` | List all users (admin) |
| PUT | `/api/admin/users/:id/role` | Update user role (admin) |
| PUT | `/api/admin/users/:id/block` | Block/unblock user (admin) |

### Categories, Coupons, Sliders, Flash Sales, Reviews, Notifications, Settings
All follow the same CRUD pattern:
```
GET    /api/admin/<resource>
POST   /api/admin/<resource>
PUT    /api/admin/<resource>/:id
DELETE /api/admin/<resource>/:id
```

---

## Production Build

```bash
# Build optimized production files
npm run build

# Output is in /dist folder
# Deploy to: Vercel, Netlify, AWS S3 + CloudFront, etc.
```

---

## License

MIT — Free to use and modify.
