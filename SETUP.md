# Setup Guide - Agri-Advisor AI

## Prerequisites
- Node.js (v18 or higher recommended)
- Python (v3.10 or higher recommended)
- MongoDB (running locally or a cloud URI)
- Docker (optional)

## 1. Backend Setup (Node.js)

```bash
cd backend
npm install
cp .env.example .env
```
Edit `backend/.env` with your values (using MongoDB defaults):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agri-advisor
JWT_SECRET=super_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
ML_SERVICE_URL=http://localhost:8000
```
Start the backend:
```bash
npm run dev
```

## 2. ML Service Setup (Python/FastAPI)

```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
cp .env.example .env
```
Start the ML service:
```bash
uvicorn app.main:app --reload --port 8000
```

## 3. Frontend Setup (React/Vite)

```bash
cd frontend
npm install
cp .env.example .env
```
Edit `frontend/.env` with your API URLs (must use VITE_ prefix):
```env
VITE_API_URL=http://localhost:5000/api
VITE_ML_SERVICE_URL=http://localhost:8000
```
Start the frontend:
```bash
npm run start
```
Frontend will run on `http://localhost:3000` (or another port if 3000 is busy).

## 4. Docker Setup (Alternative)
You can run the entire stack using Docker Compose from the root directory:
```bash
docker-compose up --build
```
This starts MongoDB, Backend, ML Service, and Frontend together.

## 5. Model Training (Optional)
If you want to train the models locally from data scripts:
```bash
cd ml-service
python run_training.py
```
This regenerates the `.pkl` and `.json` model files in `app/models/trained/`.
