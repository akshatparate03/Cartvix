# 🛍️ Cartvix — Full Stack E-Commerce Platform

A production-ready full-stack e-commerce website built with **React + Vite + TailwindCSS** (frontend) and **Spring Boot + JWT + MySQL** (backend).

---
Clieny ID: 583049937802-9sk9huoh4hsieig3jr0vj3nih23d5icm.apps.googleusercontent.com
Client Secret: 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
## 📁 Project Structure

```
cartvix/
├── frontend/                  # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/        # Navbar, Sidebar, ProductCard, Footer, FilterBar
│   │   ├── pages/             # Home, Login, Register, ProductDetail, Cart, Checkout, About, AdminProduct
│   │   ├── context/           # AuthContext, CartContext
│   │   └── utils/             # Axios instance
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # Spring Boot + JWT + MySQL
│   ├── src/main/java/com/cartvix/
│   │   ├── controller/        # AuthController, ProductController, CartController, OrderController, TryOnController
│   │   ├── service/           # AuthService, ProductService, CartService, OrderService, OtpService
│   │   ├── repository/        # JPA Repositories
│   │   ├── model/             # User, Product, CartItem, Order
│   │   ├── dto/               # Request/Response DTOs
│   │   ├── security/          # JwtUtil, JwtAuthFilter
│   │   ├── config/            # SecurityConfig, DataSeeder
│   │   └── exception/         # GlobalExceptionHandler
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── schema.sql
│   └── pom.xml
│
└── google-apps-script/
    └── CartvixOTP.js          # Google Apps Script for OTP email sending
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **Java** 17+
- **Maven** 3.8+
- **MySQL** 8.0+

---

## 🚀 Setup & Run

### 1. MySQL Database

```sql
CREATE DATABASE cartvix_db;
```

Or let Spring Boot auto-create it (configured in `application.properties`).

---

### 2. Backend Setup

```bash
cd cartvix/backend
```

Edit `src/main/resources/application.properties`:

```properties
# Update these values:
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Gmail SMTP (for OTP)
spring.mail.username=your_email@gmail.com
spring.mail.password=your_16_char_app_password

# AI Try-On (optional)
app.tryon.api-key=your_fashn_ai_key
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate

Run the backend:

```bash
mvn spring-boot:run
```

Backend starts at: `http://localhost:8080`

---

### 3. Frontend Setup

```bash
cd cartvix/frontend
npm install
npm run dev
```

Frontend starts at: `http://localhost:3000`

---

## 🔑 Admin Access

The admin account is hardcoded as:
```
Email: akshatparate@gmail.com
```

Login with this email to see the **Add Product** button and manage products.

---

## 📧 OTP Email Setup Options

### Option A: Gmail SMTP (Recommended)
Configure in `application.properties`:
```properties
spring.mail.username=your_email@gmail.com
spring.mail.password=your_16_char_app_password
```

### Option B: Google Apps Script
1. Go to https://script.google.com
2. Paste code from `google-apps-script/CartvixOTP.js`
3. Deploy as Web App (Execute as: Me, Access: Anyone)
4. Copy the URL to `application.properties`:
```properties
app.otp.apps-script-url=https://script.google.com/macros/s/YOUR_ID/exec
```

> **Note (Dev mode):** If email is not configured, OTPs are printed to the backend console.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/send-otp` | Send OTP to Gmail |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all (supports ?category, ?sort, ?minPrice, ?maxPrice) |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/search?q=` | Search products |
| POST | `/api/products` | Add product (Admin only) |
| PUT | `/api/products/{id}` | Update product (Admin only) |
| DELETE | `/api/products/{id}` | Delete product (Admin only) |

### Cart (Auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/add` | Add to cart |
| PUT | `/api/cart/update/{id}` | Update quantity |
| DELETE | `/api/cart/remove/{id}` | Remove item |
| DELETE | `/api/cart/clear` | Clear cart |

### Orders (Auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/place` | Place order |
| GET | `/api/orders/my` | Get my orders |

### AI Try-On (Auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tryon/generate` | Generate virtual try-on |

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Gmail-only Registration | ✅ |
| Email OTP Verification (6-digit, 5min expiry) | ✅ |
| JWT Authentication | ✅ |
| Admin Product Management | ✅ |
| Product Search | ✅ |
| Category Filtering | ✅ |
| Price Range Filter | ✅ |
| Shopping Cart (DB-backed) | ✅ |
| Fake Checkout (Card/UPI/Netbanking) | ✅ |
| Live Location Detection | ✅ |
| AI Virtual Try-On | ✅ |
| Mobile Responsive UI | ✅ |
| Sample Data Seeder | ✅ |

---

## 🤖 AI Virtual Try-On

The try-on feature uses [Fashn.ai](https://fashn.ai) API (or similar).

1. Get API key from https://fashn.ai
2. Set in `application.properties`:
```properties
app.tryon.api-url=https://api.fashn.ai/v1/run
app.tryon.api-key=your_api_key
```

Without an API key, the app runs in **demo mode** (shows a placeholder result).

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, React Router, Axios |
| Backend | Java 17, Spring Boot 3.2, Spring Security |
| Auth | JWT (jjwt 0.11.5) |
| Database | MySQL 8 + Spring Data JPA / Hibernate |
| Email | Spring Mail (Gmail SMTP) |
| AI | Fashn.ai Virtual Try-On API |

---

## 📦 Build for Production

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

### Backend
```bash
cd backend
mvn clean package
java -jar target/cartvix-backend-1.0.0.jar
```

---

Made with ❤️ — Cartvix Team © 2026
