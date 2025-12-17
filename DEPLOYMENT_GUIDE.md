# 🚀 Deployment Guide

This guide explains how to make your School Software application accessible on the internet ("upload to browser") so that schools and students can access it from anywhere.

To go from "localhost" (your computer) to the "internet" (everyone's computer), you need to **Deploy** your application.

---

## 🏗️ Architecture Overview

Your application consists of three parts that need to be hosted:

1.  **Database (PostgreSQL)**: Stores all the data (students, teachers, grades).
2.  **Backend (Node.js/Express)**: The "brain" that talks to the database (runs on port 5000 locally).
3.  **Frontend (React/Vite)**: The visual part users see in the browser (runs on port 5173 locally).

---

## 📋 Prerequisites

- A **GitHub** account (to store your code).
- Accounts on hosting providers (Free tiers available):
    - **Frontend:** [Vercel](https://vercel.com) (Recommended) or Netlify.
    - **Backend & Database:** [Render](https://render.com) (Recommended) or Railway.app.

---

## 🛠️ Step 1: Prepare your Code

1.  **Commit your code to GitHub**:
    Ensure your project is pushed to a GitHub repository.

2.  **Updated Configuration**:
    We have already updated `frontend/src/api/axios.js` to use an environment variable:
    ```javascript
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    ```

---

## 🗄️ Step 2: Deploy Database & Backend (Render)

We recommend using **Render** as it can host both your Node.js backend and PostgreSQL database.

1.  **Create Database**:
    - Go to [Render Dashboard](https://dashboard.render.com/).
    - Click **New +** -> **PostgreSQL**.
    - Give it a name (e.g., `school-db`).
    - Copy the **Internal Database URL** (for backend) and **External Database URL** (for connecting from your PC).

2.  **Deploy Backend**:
    - Click **New +** -> **Web Service**.
    - Connect your GitHub repository.
    - Select the `backend` folder as the Root Directory (if asked).
        - **Build Command:** `npm install`
        - **Start Command:** `node src/server.js`
    - **Environment Variables**: Add these key-value pairs:
        - `DATABASE_URL`: (Paste the Internal Database URL from step 1)
        - `JWT_SECRET`: (Create a confusing random password, e.g., `s3cr3t_k3y_123`)
        - `PORT`: `5000` or `10000` (Render usually sets this automatically, but good to set).

3.  **Get Backend URL**:
    - Once deployed, Render will give you a URL like `https://school-backend.onrender.com`.
    - **Copy this URL.**

---

## 🎨 Step 3: Deploy Frontend (Vercel)

1.  **Create Project**:
    - Go to [Vercel Dashboard](https://vercel.com/dashboard).
    - Click **Add New...** -> **Project**.
    - Import your GitHub repository.

2.  **Configure Project**:
    - **Framework Preset:** Vite
    - **Root Directory:** Edit this to select `frontend`.
    - **Environment Variables:**
        - Key: `VITE_API_URL`
        - Value: `https://school-backend.onrender.com/api` (The URL you copied from Step 2, plus `/api`)

3.  **Deploy**:
    - Click **Deploy**.
    - Wait a minute, and Vercel will give you a domain like `https://school-software.vercel.app`.

---

## ✅ Step 4: Final Verification

1.  Open your new Vercel URL (e.g., `https://school-software.vercel.app`).
2.  Try to **Login** with the Super Admin credentials.
    - If it works, you have successfully deployed!
3.  **Share the Link**: You can now send this link to schools and students.

---

## 🏠 Option B: Local Network Access (WiFi)

If you only want to access it from other computers/phones on the **same WiFi network** (not the whole internet), you don't need to do the steps above.

1.  Find your computer's IP address (e.g., `192.168.1.5`).
2.  On frontend: Run `npm run dev -- --host`
3.  On other devices (phone/laptop): Open `http://192.168.1.5:5173` in the browser.
    *   *Note: Using this method, the frontend might struggle to talk to the backend unless you also configure the backend IP in `VITE_API_URL`.*

---

**Need specific help?**
If you need help setting up the database or have errors during deployment, ask for "Help with deployment errors".
