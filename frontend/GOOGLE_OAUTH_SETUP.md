# 🔐 Google OAuth2 Setup Guide — Cartvix

This guide tells you exactly how to get your Google Client ID and wire it into the project.

---

## 📋 Overview — How It Works

```
User clicks "Continue with Google"
        │
        ▼
Google popup opens (Google's own UI — very secure)
        │
        ▼
User selects their Google account & consents
        │
        ▼
Google gives frontend a short-lived "ID Token" (a JWT)
        │
        ▼
Frontend POSTs the token to:  POST /api/auth/google
        │
        ▼
Backend verifies token with Google (https://oauth2.googleapis.com/tokeninfo)
        │
        ▼
Backend extracts: name, email, email_verified
        │
        ├── User exists?  → Login (issue our JWT)
        └── New user?     → Auto-register (no OTP!) → Login (issue our JWT)
        │
        ▼
Frontend receives our JWT + user data → logged in ✅
```

**For the user:** One click → done. No OTP, no password.

---

## 🛠️ STEP 1 — Get Google Client ID (5 minutes)

### 1.1  Go to Google Cloud Console
👉 https://console.cloud.google.com

### 1.2  Create / Select a Project
- Click the project dropdown at the top → **New Project**
- Name it: `Cartvix`
- Click **Create**

### 1.3  Enable the Google People API (optional but recommended)
- Left menu → **APIs & Services** → **Library**
- Search "Google People API" → **Enable**

### 1.4  Create OAuth 2.0 Credentials
- Left menu → **APIs & Services** → **Credentials**
- Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**

### 1.5  Configure the OAuth Consent Screen (first time only)
- Choose **External** → **Create**
- Fill in:
  - App name: `Cartvix`
  - User support email: your Gmail
  - Developer contact email: your Gmail
- Click **Save and Continue** through all steps
- At the end click **Back to Dashboard**

### 1.6  Create the Client ID
- Back to **Credentials** → **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**
- Application type: **Web application**
- Name: `Cartvix Web`
- **Authorised JavaScript origins** — Add:
  ```
  http://localhost:3000
  ```
- **Authorised redirect URIs** — Add:
  ```
  http://localhost:3000
  ```
- Click **Create**

### 1.7  Copy your credentials
A dialog appears with:
```
Client ID:      XXXXXXXX.apps.googleusercontent.com   ← COPY THIS
Client Secret:  GOCSPX-XXXXXXXXXXXX                  ← COPY THIS
```

---

## 🛠️ STEP 2 — Add to Frontend

Create a file called `.env` inside the `frontend/` folder:

```bash
# frontend/.env
VITE_GOOGLE_CLIENT_ID=XXXXXXXX.apps.googleusercontent.com
```

Replace `XXXXXXXX.apps.googleusercontent.com` with your actual Client ID.

> ⚠️ The file must be named exactly `.env` (with the dot).
> ⚠️ Never commit this file to GitHub (it's in `.gitignore`).

---

## 🛠️ STEP 3 — Add to Backend

Open:
```
backend/src/main/resources/application.properties
```

Replace these two lines:
```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
```

With your actual values:
```properties
spring.security.oauth2.client.registration.google.client-id=XXXXXXXX.apps.googleusercontent.com
spring.security.oauth2.client.registration.google.client-secret=GOCSPX-XXXXXXXXXXXX
```

---

## 📁 FILES TO REPLACE IN YOUR PROJECT

| File in this zip | Replace in your project |
|---|---|
| `frontend/src/pages/Login.jsx` | `frontend/src/pages/Login.jsx` |
| `frontend/src/pages/Register.jsx` | `frontend/src/pages/Register.jsx` |
| `frontend/src/components/GoogleAuthButton.jsx` | NEW FILE — add to `frontend/src/components/` |
| `frontend/.env.example` | Rename to `.env` and fill in Client ID |
| `backend/controller/AuthController.java` | `backend/src/main/java/com/cartvix/controller/AuthController.java` |
| `backend/service/GoogleAuthService.java` | NEW FILE — add to `backend/src/main/java/com/cartvix/service/` |
| `backend/dto/GoogleAuthRequest.java` | NEW FILE — add to `backend/src/main/java/com/cartvix/dto/` |
| `backend/config/SecurityConfig.java` | `backend/src/main/java/com/cartvix/config/SecurityConfig.java` |
| `backend/application.properties` | `backend/src/main/resources/application.properties` |

---

## 🧪 STEP 4 — Test It

1. Start backend: `mvn spring-boot:run`
2. Start frontend: `npm run dev`
3. Go to `http://localhost:3000/login`
4. You should see the Google button
5. Click it → Google popup appears → select your Gmail → done!

---

## ✅ What Happens for Different Users

| Scenario | Result |
|---|---|
| First time signing in with Google | Auto-registered instantly, no OTP needed |
| Already registered via OTP, now using Google | Logs in normally |
| Already registered via Google, logging in again | Logs in normally |
| Non-Gmail Google account | Blocked with error |

---

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| Google button not showing | Make sure `VITE_GOOGLE_CLIENT_ID` is set in `.env` and you restarted `npm run dev` |
| "Error 400: redirect_uri_mismatch" | Add `http://localhost:3000` to Authorised JavaScript origins in Cloud Console |
| "Token audience mismatch" | Your Client ID in `.env` doesn't match the one in `application.properties` |
| Popup blocked | Allow popups for localhost in your browser |
| Backend 400 error | Check backend console — the Google tokeninfo response will show the issue |

---

Made with ❤️ — Cartvix Team © 2026
