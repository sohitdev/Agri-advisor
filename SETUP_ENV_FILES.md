# Environment Files Setup

Please create these files manually:

## 1. Backend Environment File

Create `backend/.env` with:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agri-advisor
JWT_SECRET=agri-advisor-super-secret-jwt-key-2024
JWT_EXPIRE=7d
ML_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
```

## 2. Frontend Environment File

Create `frontend/.env.local` with:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ML_SERVICE_URL=http://localhost:8000
```

**Note:** React automatically loads `.env.local` files. After creating these files, restart your React dev server.

## Quick PowerShell Commands

Run these in PowerShell:

```powershell
# Backend .env
@"
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agri-advisor
JWT_SECRET=agri-advisor-super-secret-jwt-key-2024
JWT_EXPIRE=7d
ML_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
"@ | Out-File -FilePath backend\.env -Encoding utf8

# Frontend .env.local
@"
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ML_SERVICE_URL=http://localhost:8000
"@ | Out-File -FilePath frontend\.env.local -Encoding utf8
```

