<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,12,30&height=200&section=header&text=Cartvix&fontSize=90&fontColor=fff&animation=fadeIn&fontAlignY=35&desc=Next-Generation%20Fashion%20E-Commerce%20Platform&descAlignY=60&descSize=20" width="100%"/>

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-cartvix.netlify.app-ff3621?style=for-the-badge&logoColor=white)](https://cartvix.netlify.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Cartvix-181717?style=for-the-badge&logo=github)](https://github.com/akshatparate03/Cartvix)
[![Instagram](https://img.shields.io/badge/Instagram-@akshat__parate__2803-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/akshat_parate_2803)

<br/>

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?style=flat-square&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google-OAuth2-4285F4?style=flat-square&logo=google&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=flat-square&logo=netlify&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat-square&logo=render&logoColor=white)

</div>

---

## 📖 Table of Contents

- [✨ About Cartvix](#-about-cartvix)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [⚡ Tech Stack](#-tech-stack)
- [🛍️ Core Features](#️-core-features)
- [🔐 Security Features](#-security-features)
- [📁 Project Structure](#-project-structure)
- [🗄️ Database Schema](#️-database-schema)
- [🔌 API Endpoints](#-api-endpoints)
- [🚀 Setup & Installation](#-setup--installation)
- [🐳 Docker Setup](#-docker-setup)
- [🔑 Environment Variables](#-environment-variables)
- [🌐 Deployment](#-deployment)
- [⚙️ Performance Optimization](#️-performance-optimization)
- [🛡️ Security Considerations](#️-security-considerations)
- [🔧 Troubleshooting](#-troubleshooting)
- [👨‍💻 Owner](#-owner)

---

## ✨ About Cartvix

<br/>

> **Cartvix** is a production-ready, full-stack **fashion e-commerce platform** built for modern Indian shoppers. Powered by Spring Boot, React, PostgreSQL, and Redis — it delivers a blazing-fast shopping experience with OTP-verified registration, Google OAuth, cart management, Razorpay payments, and a powerful admin panel — all wrapped in a premium dark UI with red accent aesthetics.

Whether you're a shopper browsing curated collections, an admin managing inventory, or a developer exploring a clean full-stack architecture — Cartvix is built to impress.

```
🌍 Live at  →  https://cartvix.netlify.app
📧 Contact  →  akshatparate@gmail.com
```

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     CARTVIX ARCHITECTURE                      │
├──────────────┬───────────────────┬───────────────────────────┤
│   Frontend   │      Backend      │        Data Layer          │
│  React 18    │  Spring Boot 3    │  PostgreSQL 16 + Redis 7  │
│  Vite 5      │  REST API         │  Neon (Cloud PostgreSQL)  │
│  TailwindCSS │  JWT + OAuth2     │  Upstash (Cloud Redis)    │
│  Netlify     │  Render           │  Google Apps Script (OTP) │
└──────────────┴───────────────────┴───────────────────────────┘
        │                │                      │
        └────────────────┴──────────────────────┘
                    REST API + JWT Auth
```

```
Cartvix/
├── backend/              # Spring Boot 3 REST API
├── frontend/             # React 18 + Vite + TailwindCSS
├── .gitignore
└── README.md
```

---

## ⚡ Tech Stack

### 🖥️ Backend

| Technology          | Version        | Purpose                        |
| ------------------- | -------------- | ------------------------------ |
| **Java**            | 17 LTS         | Core language                  |
| **Spring Boot**     | 3.2.0          | Application framework          |
| **Spring Security** | 6.x            | Authentication & authorization |
| **Spring Data JPA** | 3.x            | ORM & database access          |
| **PostgreSQL**      | 16             | Primary relational database    |
| **Redis**           | 7.0            | OTP storage, session caching   |
| **JWT (JJWT)**      | 0.11.5         | Token-based authentication     |
| **BCrypt**          | Spring default | Password hashing               |
| **HikariCP**        | Bundled        | Database connection pooling    |
| **Maven**           | 3.9+           | Build & dependency management  |
| **Lombok**          | 1.18.x         | Boilerplate reduction          |
| **Jackson**         | 2.x            | JSON serialization             |
| **Google OAuth2**   | 3.x            | Social authentication          |

### 🎨 Frontend

| Technology                          | Version      | Purpose                 |
| ----------------------------------- | ------------ | ----------------------- |
| **React**                           | 18.2.0       | UI component library    |
| **Vite**                            | 5.x          | Build tool & dev server |
| **TailwindCSS**                     | 3.3.x        | Utility-first styling   |
| **React Router**                    | v6.x         | Client-side routing     |
| **Axios**                           | 1.x          | HTTP client             |
| **React Hot Toast**                 | 2.x          | Notification toasts     |
| **Lucide React**                    | Latest       | Icon library            |
| **Clash Display / Cabinet Grotesk** | Google Fonts | Premium typography      |
| **Node.js**                         | 18+          | Runtime for build tools |

### 🔧 External Services

| Service                | Purpose                          |
| ---------------------- | -------------------------------- |
| **Google OAuth2**      | One-click social login/register  |
| **Google Apps Script** | OTP email delivery via Gmail API |
| **Razorpay**           | Payment gateway for checkout     |
| **Neon.tech**          | Serverless cloud PostgreSQL      |
| **Upstash**            | Serverless cloud Redis           |
| **Netlify**            | Frontend hosting & CDN           |
| **Render**             | Backend hosting                  |

---

## 🛍️ Core Features

<details>
<summary><b>🔐 OTP-Verified Registration</b></summary>

- 3-step registration flow: **Details → Verify OTP → Set Password**
- OTP sent to Gmail via Google Apps Script (custom HTML email template)
- OTP stored in Redis with **5-minute TTL** — no DB writes needed
- Only `@gmail.com` addresses accepted — validated on frontend + backend
- One-click **Google OAuth** registration — no OTP required
- Regex-validated email, minimum 6-character password enforcement

</details>

<details>
<summary><b>🛒 Shopping Cart & Checkout</b></summary>

- Add, remove, and update product quantities in real-time
- **Optimistic UI updates** — quantity changes instantly, no page refresh
- Persistent cart stored server-side — synced across devices
- Cart count badge updates live in the Navbar
- Checkout with full order summary and Razorpay payment integration
- Guest cart shows login prompt; authenticated users get full cart access

</details>

<details>
<summary><b>🏪 Product Catalog & Filtering</b></summary>

- 13+ product categories: Shoes, Shirts, T-Shirts, Caps, Goggles, Jewellery, Jeans, Pants, Tops, Froks, Watches, Bags, and more
- **Category sidebar** with instant navigation — any page → click category → lands on home with filtered products
- Sort by: Latest, Price Low to High, Price High to Low
- Filter by price range (min/max)
- Real-time search from Navbar with product suggestions dropdown
- Product detail page with 3D tilt image, category badge redirect

</details>

<details>
<summary><b>🔍 Smart Search</b></summary>

- Navbar search with debounced API calls
- Live dropdown showing top 6 matching products
- Clicking a result navigates directly to product detail
- Search results include product image, title, and price

</details>

<details>
<summary><b>👑 Admin Panel</b></summary>

- Add new products with title, category, price, image URL, and description
- Edit existing product details with live image preview
- Delete products with confirmation prompt
- Custom category support — select "Other" to enter any category name
- Admin-only routes protected via `isAdmin` auth check
- Admin email hardcoded as access control — no role management needed

</details>

<details>
<summary><b>🌑 Premium Dark UI</b></summary>

- Full dark theme — `#0d0d0f` base, `#141416` cards, `#ff3621` accent
- Glass morphism cards with backdrop blur and subtle borders
- 3D tilt effects on product cards and detail images using mouse tracking
- Smooth animations: fadeIn, slideUp, scaleIn, float, shimmer, glowPulse
- `Clash Display` for headings, `Cabinet Grotesk` for body text
- Fully responsive — mobile sidebar with overlay, desktop always-visible
- Gradient borders, glow buttons, shimmer text — premium aesthetic throughout

</details>

---

## 🔐 Security Features

<details>
<summary><b>🔑 JWT Authentication</b></summary>

- Stateless auth using HS256-signed JWT tokens
- Token verified on every protected API request via `JwtAuthenticationFilter`
- Token stored in `localStorage` — auto-attached to all Axios requests
- Auto-redirect to login on 401 response
- Google OAuth tokens validated server-side via Google API

</details>

<details>
<summary><b>🔒 OTP Security</b></summary>

- OTPs generated server-side — never exposed to client
- Stored in Redis with strict **5-minute TTL** — auto-expires
- Single-use: OTP invalidated after successful verification
- Rate limiting on `/send-otp` endpoint via Redis counters
- Gmail-only restriction prevents disposable email abuse

</details>

<details>
<summary><b>🛡️ Input Validation</b></summary>

- Frontend regex validation on email, password length, required fields
- Backend Bean Validation (`@NotNull`, `@Email`, `@Size`) on all DTOs
- SQL injection prevention via Spring Data JPA parameterized queries
- React auto-escapes all rendered content (XSS safe by default)
- CORS whitelist — only `cartvix.netlify.app` accepted in production

</details>

<details>
<summary><b>🔏 Admin Access Control</b></summary>

- Admin routes (`/admin/*`) protected at both frontend and backend
- `isAdmin` computed from authenticated user's email
- Unauthorized access redirects to home page instantly
- Admin-only product endpoints require Bearer token validation

</details>

---

## 📁 Project Structure

### Backend

```
backend/
├── src/main/java/com/cartvix/
│   ├── CartvixApplication.java
│   ├── config/
│   │   └── SecurityConfig.java         # JWT filter, CORS, auth config
│   ├── controller/
│   │   ├── AuthController.java         # Register, login, OTP, Google OAuth
│   │   ├── ProductController.java      # CRUD for products, search
│   │   ├── CartController.java         # Cart add, update, remove, clear
│   │   └── OrderController.java        # Checkout & Razorpay integration
│   ├── dto/
│   │   ├── AuthRequest.java
│   │   ├── AuthResponse.java
│   │   ├── ProductDTO.java
│   │   └── CartItemDTO.java
│   ├── entity/
│   │   ├── User.java
│   │   ├── Product.java
│   │   ├── CartItem.java
│   │   └── Order.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── ProductRepository.java
│   │   ├── CartItemRepository.java
│   │   └── OrderRepository.java
│   ├── security/
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JwtUtil.java
│   │   └── SecurityConfig.java
│   └── service/
│       ├── AuthService.java
│       ├── ProductService.java
│       ├── CartService.java
│       └── OtpService.java             # Redis OTP storage & verification
├── src/main/resources/
│   ├── application.properties          # App config (DB, Redis, JWT, CORS)
│   └── schema.sql
├── .env
├── Dockerfile
└── pom.xml
```

### Frontend

```
frontend/
├── public/
│   ├── _redirects                      # Netlify SPA routing
│   ├── favicon.ico
│   └── Cartvix.png                     # Brand logo
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                  # Search, cart badge, user dropdown
│   │   ├── Sidebar.jsx                 # Category navigation with auto-redirect
│   │   ├── Footer.jsx                  # Links, brand, copyright
│   │   ├── ProductCard.jsx             # 3D tilt card with add-to-cart
│   │   ├── FilterBar.jsx               # Sort + price range filters
│   │   └── GoogleAuthButton.jsx        # GIS SDK Google sign-in button
│   ├── context/
│   │   ├── AuthContext.jsx             # Auth state, login, logout
│   │   └── CartContext.jsx             # Cart state with optimistic updates
│   ├── pages/
│   │   ├── Home.jsx                    # Product grid with hero section
│   │   ├── ProductDetail.jsx           # Detail page, 3D image, category badge
│   │   ├── Cart.jsx                    # Cart items, quantity controls, summary
│   │   ├── Checkout.jsx                # Order form + Razorpay payment
│   │   ├── Login.jsx                   # Sign in with email or Google
│   │   ├── Register.jsx                # 3-step OTP registration
│   │   ├── About.jsx                   # Brand story, stats, feature cards
│   │   └── AdminProduct.jsx            # Add / edit product (admin only)
│   ├── utils/
│   │   └── axios.js                    # Axios instance with base URL + auth header
│   ├── App.jsx                         # Routes, layout, category state
│   ├── index.css                       # Global styles, animations, CSS vars
│   └── main.jsx                        # Entry point
├── .env
├── index.html
├── package.json
└── vite.config.js
```

---

## 🗄️ Database Schema

### 👤 Users Table

| Column       | Type           | Description                   |
| ------------ | -------------- | ----------------------------- |
| `id`         | BIGSERIAL PK   | Auto-incremented user ID      |
| `full_name`  | VARCHAR        | User's full name              |
| `email`      | VARCHAR UNIQUE | Login identifier (Gmail only) |
| `password`   | VARCHAR        | BCrypt hashed password        |
| `is_google`  | BOOLEAN        | Registered via Google OAuth   |
| `created_at` | TIMESTAMP      | Registration timestamp        |

### 🛍️ Products Table

| Column        | Type         | Description                    |
| ------------- | ------------ | ------------------------------ |
| `id`          | BIGSERIAL PK | Auto-incremented product ID    |
| `title`       | VARCHAR      | Product name                   |
| `category`    | VARCHAR      | Category (Shoes, Shirts, etc.) |
| `price`       | DECIMAL      | Price in INR                   |
| `description` | TEXT         | Product description            |
| `image_url`   | VARCHAR      | Product image URL              |
| `created_at`  | TIMESTAMP    | Date added                     |

### 🛒 Cart Items Table

| Column       | Type         | Description                 |
| ------------ | ------------ | --------------------------- |
| `id`         | BIGSERIAL PK | Cart item ID                |
| `user_id`    | BIGINT FK    | Owner of the cart item      |
| `product_id` | BIGINT FK    | Product reference           |
| `quantity`   | INT          | Item quantity (min 1)       |
| `added_at`   | TIMESTAMP    | When item was added to cart |

### 📦 Orders Table

| Column       | Type         | Description                |
| ------------ | ------------ | -------------------------- |
| `id`         | BIGSERIAL PK | Order ID                   |
| `user_id`    | BIGINT FK    | Ordering user              |
| `total`      | DECIMAL      | Total order amount         |
| `status`     | VARCHAR      | PENDING / PAID / FAILED    |
| `payment_id` | VARCHAR      | Razorpay payment reference |
| `created_at` | TIMESTAMP    | Order timestamp            |

---

## 🔌 API Endpoints

### 🔑 Authentication — `/api/auth`

| Method | Endpoint      | Auth | Description                                  |
| ------ | ------------- | ---- | -------------------------------------------- |
| `POST` | `/send-otp`   | ❌   | Generate & send OTP to Gmail via Apps Script |
| `POST` | `/verify-otp` | ❌   | Verify OTP stored in Redis                   |
| `POST` | `/register`   | ❌   | Complete registration after OTP verify       |
| `POST` | `/login`      | ❌   | Login → returns JWT token                    |
| `POST` | `/google`     | ❌   | Google OAuth — login or auto-register        |

### 🛍️ Products — `/api/products`

| Method   | Endpoint     | Auth     | Description                                         |
| -------- | ------------ | -------- | --------------------------------------------------- |
| `GET`    | `/`          | ❌       | Get all products (with category/sort/price filters) |
| `GET`    | `/{id}`      | ❌       | Get single product by ID                            |
| `GET`    | `/search?q=` | ❌       | Search products by title                            |
| `POST`   | `/`          | ✅ Admin | Add new product                                     |
| `PUT`    | `/{id}`      | ✅ Admin | Edit product details                                |
| `DELETE` | `/{id}`      | ✅ Admin | Delete product                                      |

### 🛒 Cart — `/api/cart`

| Method   | Endpoint           | Auth | Description                   |
| -------- | ------------------ | ---- | ----------------------------- |
| `GET`    | `/`                | ✅   | Get current user's cart items |
| `POST`   | `/add`             | ✅   | Add product to cart           |
| `PUT`    | `/update/{itemId}` | ✅   | Update quantity of cart item  |
| `DELETE` | `/remove/{itemId}` | ✅   | Remove item from cart         |
| `DELETE` | `/clear`           | ✅   | Clear entire cart             |

### 📦 Checkout — `/api/checkout`

| Method | Endpoint        | Auth | Description                    |
| ------ | --------------- | ---- | ------------------------------ |
| `POST` | `/create-order` | ✅   | Create Razorpay order          |
| `POST` | `/verify`       | ✅   | Verify payment & confirm order |

---

## 🚀 Setup & Installation

### 📋 Prerequisites

| Requirement       | Version | Download                                     |
| ----------------- | ------- | -------------------------------------------- |
| Java JDK          | 17+     | [adoptium.net](https://adoptium.net)         |
| Maven             | 3.9+    | [maven.apache.org](https://maven.apache.org) |
| Node.js           | 18+     | [nodejs.org](https://nodejs.org)             |
| PostgreSQL        | 16+     | [postgresql.org](https://www.postgresql.org) |
| Redis             | 7.0+    | [redis.io](https://redis.io)                 |
| Docker (optional) | 24+     | [docker.com](https://docker.com)             |

### 📦 Port Reference

| Service               | Port | URL                   |
| --------------------- | ---- | --------------------- |
| Frontend (Vite)       | 5173 | http://localhost:5173 |
| Backend (Spring Boot) | 8080 | http://localhost:8080 |
| PostgreSQL            | 5432 | localhost:5432        |
| Redis                 | 6379 | localhost:6379        |

---

### 🗄️ PostgreSQL Setup

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE cartvix;
\c cartvix

-- Reset tables if needed (dev only)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

\q
```

---

### ⚙️ Backend Setup

```bash
# Navigate to backend
cd backend

# Clean previous build
rm -rf target          # Linux/Mac
rm -r -fo target       # Windows PowerShell

# Install dependencies & build
mvn clean install

# Run the application
mvn spring-boot:run
```

> Backend starts at → **http://localhost:8080**

---

### 🎨 Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

> Frontend starts at → **http://localhost:5173**

---

## 🐳 Docker Setup

```bash
# Start Redis container
docker run -d --name cartvix-redis -p 6379:6379 redis:7

# Start existing Redis container
docker start cartvix-redis

# Check running containers
docker ps

# Connect to Redis CLI and verify
docker exec -it cartvix-redis redis-cli
ping     # Should return PONG
exit

# Start all services via docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

---

## 🔑 Environment Variables

### Backend — `backend/.env` or `application.properties`

```env
# ===== DATABASE (Neon.tech) =====
DB_HOST=your-neon-host.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SSL_MODE=require

# ===== REDIS (Upstash) =====
REDIS_HOST=your-upstash-host.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your_upstash_password
REDIS_SSL=true

# ===== JWT =====
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRATION=86400000

# ===== GOOGLE OAUTH =====
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# ===== OTP (Google Apps Script) =====
APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# ===== RAZORPAY =====
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# ===== SERVER =====
PORT=8080
FRONTEND_URL=https://cartvix.netlify.app
```

### Frontend — `frontend/.env`

```env
# Local development
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Production (Netlify Dashboard)

```env
VITE_API_URL=https://cartvix-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## 🌐 Deployment

### 🎨 Frontend → Netlify

```bash
# Build the project
npm run build

# Deploy options:
# Option 1 — Drag & drop the /dist folder on netlify.app
# Option 2 — Connect GitHub repo on netlify.app
#   Build command:     npm run build
#   Publish directory: dist
#   Add env vars in Netlify dashboard

# Live URL
https://cartvix.netlify.app
```

**Netlify `_redirects`** file in `public/`:

```
/*    /index.html   200
```

---

### ⚙️ Backend → Render

```bash
# 1. Push backend to GitHub
# 2. Create Web Service on render.com
# 3. Runtime: Docker  (uses ./backend/Dockerfile)
# 4. Add all env variables in Render dashboard
# 5. Health check path: /api/health
```

---

### 🗄️ Database → Neon

```bash
# 1. Sign up at neon.tech
# 2. Create a new project → copy connection string
# 3. Update DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in Render env vars
# 4. Neon requires SSL → sslmode=require in JDBC URL
# 5. Use pooler endpoint for better connection management
```

---

### 🔴 Redis → Upstash

```bash
# 1. Sign up at upstash.com
# 2. Create Redis database → choose region near your Render backend
# 3. Copy endpoint, port, and password
# 4. Update REDIS_HOST, REDIS_PORT, REDIS_PASSWORD in Render env vars
# 5. REDIS_SSL=true required (Upstash enforces TLS)
```

---

### 📧 OTP Email → Google Apps Script

```bash
# 1. Go to script.google.com → New Project
# 2. Paste the CartvixOTP.gs script
# 3. Deploy → New Deployment → Web App
#    Execute as: Me
#    Who has access: Anyone
# 4. Copy the deployment URL
# 5. Set APPS_SCRIPT_URL in backend env vars
# Note: Logo loads from https://cartvix.netlify.app/Cartvix.png (must be deployed first)
```

---

## ⚙️ Performance Optimization

<details>
<summary><b>🗃️ Database Indexing</b></summary>

- Indexed: `user_id`, `email`, `product_id`, `category`
- Composite index on `(user_id, product_id)` for cart lookups
- Foreign key indexes auto-created by JPA
- Neon connection pooler reduces cold-start latency

</details>

<details>
<summary><b>⚡ Redis Caching</b></summary>

- OTP stored in Redis with 5-min TTL — zero DB writes for OTP flow
- Cart session cached to reduce repeated DB calls
- Redis counters for rate-limiting OTP send requests per email

</details>

<details>
<summary><b>🌐 Frontend Optimization</b></summary>

- Vite code splitting — each page loaded as separate chunk
- Optimistic UI updates in CartContext — instant quantity changes
- Debounced Navbar search (300ms delay) — fewer API calls
- CSS-only animations — no heavy JS animation libraries
- Lazy loading on product images with `onError` fallback
- `useCallback` on heavy cart handlers to prevent re-renders

</details>

<details>
<summary><b>🎨 Asset Optimization</b></summary>

- Fonts loaded via Google Fonts CDN with `display=swap`
- SVG icons via Lucide React (tree-shaken, no full bundle)
- `will-change: transform` on 3D tilt elements for GPU acceleration
- Tailwind purges unused CSS in production build
- Images served from external CDN URLs — no self-hosting overhead

</details>

<details>
<summary><b>🏊 Connection Pooling</b></summary>

- HikariCP connection pool (bundled with Spring Boot)
- Max pool size tuned for Neon free tier (max 5 connections)
- `connectionTimeout`, `idleTimeout`, `socketTimeout` configured for cloud DB
- Render backend wakes in ~15s — health endpoint used for monitoring

</details>

---

## 🛡️ Security Considerations

<details>
<summary><b>🔐 JWT Token Security</b></summary>

- HS256-signed tokens — secret never sent to client
- 24-hour access token expiry — short enough for most breach scenarios
- Token validated on every request by `JwtAuthenticationFilter`
- Invalid/expired tokens return 401 — frontend auto-redirects to login

</details>

<details>
<summary><b>🌐 CORS Configuration</b></summary>

- Only `https://cartvix.netlify.app` whitelisted in production
- No wildcard `*` in production CORS config
- Explicit allowed methods: GET, POST, PUT, DELETE
- Preflight OPTIONS handled automatically by Spring Security

</details>

<details>
<summary><b>💉 Injection Prevention</b></summary>

- All queries via Spring Data JPA — no raw SQL string concatenation
- Input sanitized and validated via Bean Validation annotations
- React renders all user content safely (no `dangerouslySetInnerHTML`)
- File inputs not accepted — product images are URLs only

</details>

<details>
<summary><b>🔒 Google OAuth Security</b></summary>

- ID token verified server-side via Google's public keys
- `aud` claim validated against registered client ID
- No plaintext credentials stored for OAuth users (`is_google = true`)
- Separate code path for Google vs email/password users

</details>

---

## 🔧 Troubleshooting

<details>
<summary><b>❌ OTP not received</b></summary>

- Verify Apps Script is deployed with "Anyone" access
- Check `APPS_SCRIPT_URL` in backend env matches deployed script URL
- Confirm the email ends with `@gmail.com` — only Gmail supported
- Check Apps Script execution logs for error messages
- Ensure the Google account running the script has Gmail API enabled

</details>

<details>
<summary><b>❌ Google login not working</b></summary>

- Confirm `VITE_GOOGLE_CLIENT_ID` matches the OAuth app's client ID
- Add `https://cartvix.netlify.app` to Authorized JavaScript Origins in Google Cloud Console
- Add `http://localhost:5173` for local development
- Check browser console for GIS SDK errors
- Ensure `GOOGLE_CLIENT_ID` in backend matches frontend

</details>

<details>
<summary><b>❌ Cart not updating without refresh</b></summary>

- This is fixed — `CartContext` uses optimistic updates
- `updateQuantity` and `removeFromCart` update state instantly
- If still happening, ensure you are using the latest `CartContext.jsx`
- Check browser console for API errors causing rollback

</details>

<details>
<summary><b>❌ Database connection error</b></summary>

- Verify PostgreSQL running: `psql -U postgres`
- Check DB credentials in `.env` / `application.properties`
- For Neon: ensure `sslmode=require` in JDBC URL
- Neon free tier has 5 connection limit — check HikariCP pool size

</details>

<details>
<summary><b>❌ Redis connection error</b></summary>

- Start local Redis: `docker start cartvix-redis`
- Test: `docker exec -it cartvix-redis redis-cli ping` → `PONG`
- For Upstash: verify `REDIS_SSL=true` and correct host/password
- Ensure port 6379 is not blocked by firewall

</details>

<details>
<summary><b>❌ Admin routes showing blank / redirecting</b></summary>

- Ensure logged-in user's email matches admin email in `AuthContext.jsx`
- Clear `localStorage` and re-login to get fresh token
- Check `isAdmin` value in browser React DevTools
- Verify the `/admin/*` routes exist in `App.jsx`

</details>

<details>
<summary><b>❌ Render backend slow on first request</b></summary>

- Free tier sleeps after 15 minutes of inactivity
- First cold start takes 30–60 seconds — this is expected
- Add a keep-alive ping in frontend (`setInterval` to `/api/health` every 1 min)
- Check Render logs for startup exceptions

</details>

<details>
<summary><b>❌ Build errors (Maven)</b></summary>

```bash
# Full clean rebuild
rm -rf target
mvn clean install -DskipTests

# Check Java version (must be 17+)
java -version

# Check Maven version (must be 3.9+)
mvn -version
```

</details>

---

## 👨‍💻 Owner

<div align="center">

<img src="https://avatars.githubusercontent.com/akshatparate03" alt="Akshat Parate" width="100" style="border-radius: 50%"/>

### **Akshat Parate**

_Full Stack Developer · UI Designer · Builder_

[![Portfolio](https://img.shields.io/badge/🌐%20Portfolio-akshatparate.netlify.app-ff3621?style=for-the-badge)](https://akshatparate.netlify.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-akshatparate03-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/akshatparate03)
[![Instagram](https://img.shields.io/badge/Instagram-akshat__parate__2803-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/akshat_parate_2803)
[![GitHub](https://img.shields.io/badge/GitHub-akshatparate03-181717?style=for-the-badge&logo=github)](https://github.com/akshatparate03)

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,12,30&height=120&section=footer&animation=fadeIn" width="100%"/>

**Built with passion for the future of Indian fashion e-commerce.**

_Shop smart. Shop fast. Shop Cartvix._

[![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-ff3621?style=flat-square)](https://cartvix.netlify.app)
[![GitHub Stars](https://img.shields.io/github/stars/akshatparate03/Cartvix?style=flat-square&color=yellow&logo=github)](https://github.com/akshatparate03/Cartvix)

</div>
