# 🚀 Cartvix — Complete Step-by-Step Run Guide

---

## 📦 FILES TO REPLACE IN YOUR PROJECT

Before running, replace these files with the fixed versions:

| Fixed File | Replace In Your Project |
|---|---|
| `backend/model/User.java` | `backend/src/main/java/com/cartvix/model/User.java` |
| `backend/model/CartItem.java` | `backend/src/main/java/com/cartvix/model/CartItem.java` |
| `backend/model/Order.java` | `backend/src/main/java/com/cartvix/model/Order.java` |
| `backend/controller/TryOnController.java` | `backend/src/main/java/com/cartvix/controller/TryOnController.java` |
| `backend/AuthService.java` | `backend/src/main/java/com/cartvix/service/AuthService.java` |
| `backend/OtpService.java` | `backend/src/main/java/com/cartvix/service/OtpService.java` |
| `backend/application.properties` | `backend/src/main/resources/application.properties` |
| `frontend/index.css` | `frontend/src/index.css` |
| `frontend/vite.config.js` | `frontend/vite.config.js` |

---

## 🗑️ TAILWIND v4 — FILES TO DELETE

Since you're using **Tailwind CSS v4**, delete these files — they are only needed in v3:

```
frontend/tailwind.config.js      ← DELETE THIS
frontend/postcss.config.js       ← DELETE THIS
```

Keep these (they are still needed):
```
frontend/package.json            ✅ Keep
frontend/package-lock.json       ✅ Keep
frontend/vite.config.js          ✅ Keep (replace with fixed version)
frontend/src/index.css           ✅ Keep (replace with fixed version)
```

---

## 📦 TAILWIND v4 — UPDATE package.json

Open `frontend/package.json` and update the devDependencies to use v4 packages:

**Remove** these old v3 packages:
```json
"tailwindcss": "^3.4.0",
"autoprefixer": "^10.4.16",
"postcss": "^8.4.32"
```

**Add** these v4 packages instead:
```json
"tailwindcss": "^4.0.0",
"@tailwindcss/vite": "^4.0.0"
```

Your final `devDependencies` in package.json should look like:
```json
"devDependencies": {
  "@vitejs/plugin-react": "^4.2.1",
  "tailwindcss": "^4.0.0",
  "@tailwindcss/vite": "^4.0.0",
  "vite": "^5.0.8"
}
```

Then run:
```bash
cd frontend
npm install
```

---

## ⚙️ STEP 1 — Install Prerequisites

Make sure these are installed on your machine:

| Tool | Version | Check Command |
|---|---|---|
| **Java JDK** | 17+ | `java -version` |
| **Maven** | 3.8+ | `mvn -version` |
| **Node.js** | 18+ | `node -v` |
| **npm** | 9+ | `npm -v` |
| **MySQL** | 8.0+ | `mysql --version` |

---

## ⚙️ STEP 2 — Setup MySQL Database

Open MySQL (via MySQL Workbench, terminal, or any client) and run:

```sql
CREATE DATABASE IF NOT EXISTS cartvix_db;
```

That's it — Spring Boot will auto-create all tables on first run.

---

## ⚙️ STEP 3 — Configure Backend

Open this file:
```
backend/src/main/resources/application.properties
```

Edit only these two lines (minimum required):
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
```

The Google Apps Script URL is already set:
```properties
app.otp.apps-script-url=https://script.google.com/macros/s/AKfycbzjPmZEyU-Cg15g4mjxwiN_Tx2Kmj8EUz6iBsNY6H92kLVewdVGizAjLCYqEz9rvjco/exec
```
✅ OTP emails will be sent automatically via your deployed Apps Script.

---

## ⚙️ STEP 4 — Run the Backend

Open a terminal in VS Code or any terminal, navigate to the backend folder:

```bash
cd cartvix/backend
```

Run the Spring Boot app:
```bash
mvn spring-boot:run
```

**Expected output:**
```
✅ Sample products seeded successfully!
🚀 Cartvix Backend is running on http://localhost:8080
```

The backend is ready when you see:
```
Started CartvixApplication in X.XXX seconds
```

**Keep this terminal open.**

---

## ⚙️ STEP 5 — Run the Frontend

Open a **new terminal** (don't close the backend one), navigate to frontend:

```bash
cd cartvix/frontend
npm install
npm run dev
```

**Expected output:**
```
  VITE v5.x  ready in 300ms
  ➜  Local:   http://localhost:3000/
```

---

## ⚙️ STEP 6 — Open the Website

Open your browser and go to:
```
http://localhost:3000
```

🎉 Cartvix is live!

---

## 🔑 STEP 7 — Test the Website

### Register a new user:
1. Click **Login** → **Create one**
2. Enter your **Full Name** and **Gmail address**
3. Click **Send OTP**
4. Check your Gmail inbox — OTP email arrives via your Apps Script
5. Enter the 6-digit OTP
6. Set your password → **Create Account**

### Admin login:
- Login with: `akshatparate@gmail.com`
- You'll see the **Add Product** button in navbar

### Test OTP in dev (if email fails):
- Look at the backend terminal — OTP is printed there as fallback

---

## 🔍 WHAT EACH WARNING WAS AND HOW IT'S FIXED

### 1. `User.java` — Warning about `isVerified`
**Problem:** Lombok `@Data` + `boolean isVerified` creates getter `isVerified()` which conflicts with JPA column naming and builder pattern.
**Fix:** Renamed field to `verified` + added `@Column(name="is_verified")` + used `@Builder.Default` for the default `false` value.

### 2. `CartItem.java` — `@Builder will ignore the initializing expression`
**Problem:** `private int quantity = 1` — Lombok `@Builder` ignores default values unless annotated.
**Fix:** Added `@Builder.Default` → `@Builder.Default private int quantity = 1;`

### 3. `Order.java` — Same `@Builder.Default` issue
**Problem:** `private String status = "PLACED"` was being ignored by `@Builder`.
**Fix:** Added `@Builder.Default` to the `status` field.

### 4. `TryOnController.java` — `Map is a raw type`
**Problem:** `ResponseEntity<Map>` uses raw `Map` without type parameters.
**Fix:** Added `@SuppressWarnings("unchecked")` with proper cast comment since `RestTemplate` forces raw `Map.class` in `postForEntity`.

### 5. Both `CartItem.java` and `Order.java` — Replaced `@Data` with `@Getter @Setter`
**Why:** `@Data` on JPA entities can cause issues with `equals()`/`hashCode()` on lazy-loaded relationships. Using `@Getter @Setter` is safer for entities.

---

## 📁 Final Project Structure

```
cartvix/
├── frontend/                         ← React + Vite + Tailwind v4
│   ├── src/
│   │   ├── index.css                 ← Uses @import "tailwindcss" (v4 style)
│   │   └── ...
│   ├── vite.config.js                ← Uses @tailwindcss/vite plugin
│   ├── package.json                  ← tailwindcss ^4.0.0
│   └── [NO tailwind.config.js]       ← Deleted (not needed in v4)
│   └── [NO postcss.config.js]        ← Deleted (not needed in v4)
│
└── backend/
    └── src/main/resources/
        └── application.properties    ← Apps Script URL already set ✅
```

---

## ❓ Common Issues & Fixes

| Issue | Fix |
|---|---|
| `Port 8080 already in use` | Kill the process: `npx kill-port 8080` or change `server.port` in properties |
| `Access denied for MySQL` | Double-check `spring.datasource.password` in application.properties |
| OTP not received | Check backend console — OTP is printed there as fallback |
| `npm install` fails | Delete `node_modules` and `package-lock.json`, run `npm install` again |
| Frontend shows blank | Make sure backend is running first on port 8080 |
| Tailwind styles not applying | Make sure you deleted `tailwind.config.js` and `postcss.config.js` |

---

Made with ❤️ — Cartvix Team © 2026
