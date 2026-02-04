# 🚀 How to Run the Disaster Management System

## Prerequisites

Before running the application, ensure you have:

- **Python 3.9+** installed
- **Node.js 16+** and npm installed
- Terminal/Command Prompt access

---

## Quick Start Guide

### 1️⃣ Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (first time only)
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies (first time only)
pip install fastapi uvicorn requests

# Start backend server
uvicorn main:app --reload
```

**✅ Backend running at:** `http://127.0.0.1:8000`

---

### 2️⃣ Frontend Setup (React)

Open a **new terminal window** and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm start
```

**✅ Frontend running at:** `http://localhost:3000`

Browser will automatically open to the application.

---

## 🎮 Using the Application

### Live Feed Mode
1. Click **📡 Live Feed** button (top-right)
2. Allow geolocation when prompted
3. View real-time monitoring data

### Simulation Mode
1. Click **🎮 Elite Sim** button (top-right)
2. Place disasters by clicking the map (select hazard type first)
3. Set **INSERTION POINT** and **SAFE ZONES** in LOGISTICS tab
4. Click **▶ INITIATE ROUTING PROTOCOL** to run Dijkstra's algorithm
5. Click **🏃 EXECUTE VISUAL TRAVERSAL** to simulate the journey

---

## 🛠️ Troubleshooting

### Backend won't start
- **Error**: `Module not found`
  - **Fix**: Run `pip install fastapi uvicorn requests`

- **Error**: `Address already in use`
  - **Fix**: Port 8000 is busy. Use: `uvicorn main:app --reload --port 8001`
  - Update frontend API calls to `http://localhost:8001`

### Frontend won't start
- **Error**: `npm not found`
  - **Fix**: Install Node.js from [nodejs.org](https://nodejs.org/)

- **Error**: Port 3000 already in use
  - **Fix**: Kill existing process or use different port when prompted

- **Error**: `Failed to fetch graph`
  - **Fix**: Ensure backend is running first at `http://127.0.0.1:8000`

### CORS Errors
- **Fix**: Ensure frontend is at `http://localhost:3000`
- Backend CORS is configured for this exact origin

---

## 📍 API Endpoints (for testing)

- **Health Check**: http://127.0.0.1:8000/
- **Graph Data**: http://127.0.0.1:8000/graph
- **Swagger Docs**: http://127.0.0.1:8000/docs

---

## 🔄 Stopping the Application

- **Backend**: Press `Ctrl+C` in the backend terminal
- **Frontend**: Press `Ctrl+C` in the frontend terminal

---

## 📦 Fresh Install (Clean Setup)

If you encounter persistent issues:

```bash
# Backend
cd backend
rm -rf .venv
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install fastapi uvicorn requests

# Frontend
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

---

## ✨ Next Steps

After running the application:

1. Read `README.md` for comprehensive technical documentation
2. Test both Live Feed and Simulation modes
3. Explore the interactive Dijkstra visualization
4. Export routes to Google Maps

**Enjoy your disaster management simulation!** 🚨
