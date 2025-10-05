# 🔐 Password Generator + Secure Vault

A privacy-focused web application to generate strong passwords and store them securely in an encrypted personal vault.  
This repository contains both **frontend (Next.js + TypeScript)** and **backend (Node.js + Express + MongoDB)** components.

---

## 🧭 Project Overview

- **Frontend:** Built using **Next.js**, **TypeScript**, and **Tailwind CSS**.  
  Provides a clean UI for:
  - Sign up / login  
  - Password generator (length, symbols, numbers, avoid look-alikes)  
  - Vault management (add / edit / delete / search)  
  - Client-side encryption and clipboard copy with auto-clear  

- **Backend:** **Node.js**, **Express**, **TypeScript**, **MongoDB (Mongoose)**.  
  Provides secure REST APIs with JWT authentication.

- **Encryption:** Vault entries are encrypted **on the client** before sending to the server. The server never stores plaintext passwords.

---

## 🛠 Tech Stack

| Layer | Tech |
|:------|:------|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Atlas or Local) |
| Auth | JWT (JSON Web Token) |
| Optional | 2FA (TOTP), Dark mode, Encrypted export/import |

---

## 🗂 Repository Structure

password-generator-vault/
frontend/ # Next.js + Tailwind frontend
backend/ # Express + TypeScript backend


## ⚙️ Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB URI (Atlas or local)
- Git

---

## 🌱 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|:----------|:-------------|
| `MONGODB_URI` | MongoDB connection URI |
| `JWT_SECRET` | Secret key for JWT signing |
| `PORT` | Backend port (default: 5000) |

### Frontend (`frontend/.env.local`)
| Variable | Description |
|:----------|:-------------|
| `NEXT_PUBLIC_API_BASE` | Backend base URL (e.g., `http://localhost:5000`) |

> ⚠️ Frontend variables must start with `NEXT_PUBLIC_` to be available in the browser.

---

## 🚀 Running Locally

### Backend
```bash
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev

```
Frontend runs on port 3000 and connects to the backend using NEXT_PUBLIC_API_BASE.

🧪 API Quick Test (cURL)

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","password":"StrongPass123!"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","password":"StrongPass123!"}'

# Add Vault Item
curl -X POST http://localhost:5000/api/vault \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{"title":"GitHub","username":"me","password":"ENCRYPTED_STRING","url":"https://github.com"}'

# Get Vault Items
curl -H "Authorization: Bearer <TOKEN>" http://localhost:5000/api/vault

```

## 📦 Building for Production
Backend
cd backend
npm run build
npm start

Frontend
cd frontend
npm run build
npm start

## ☁️ Deployment

Frontend: Deploy on Vercel, set NEXT_PUBLIC_API_BASE to your backend URL.

Backend: Deploy on Render, Railway, or Cyclic. Ensure env vars are set.

## 🔍 Features Summary

✅ Password generator (length, symbols, numbers, avoid look-alikes)
✅ Client-side AES encryption/decryption
✅ Secure authentication with JWT
✅ Vault CRUD (create / edit / delete / search)
✅ Copy password to clipboard with auto-clear
✅ Minimal and responsive UI

## 🧩 Security Notes

1- Vault data is encrypted in the browser; server never stores plaintext.

2- Do not commit secrets (.env) to Git.

3- Clipboard clears automatically after 10–20 seconds.

## 🪪 License

MIT License © 2025
