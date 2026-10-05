# Agri-Advisor - Complete Startup Script
# This script starts all services: MongoDB, Backend, ML Service, and Frontend

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Agri-Advisor - Starting All Services" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env files exist, create them if missing
Write-Host "[1/10] Checking environment files..." -ForegroundColor Yellow

$backendEnv = "backend\.env"
$frontendEnv = "frontend\.env.local"

if (-not (Test-Path $backendEnv)) {
    Write-Host "  ⚠ Creating backend/.env file..." -ForegroundColor Yellow
    @"
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agri-advisor
JWT_SECRET=agri-advisor-super-secret-jwt-key-2024
JWT_EXPIRE=7d
ML_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
"@ | Out-File -FilePath $backendEnv -Encoding utf8
    Write-Host "  ✓ Created backend/.env" -ForegroundColor Green
} else {
    Write-Host "  ✓ backend/.env exists" -ForegroundColor Green
}

if (-not (Test-Path $frontendEnv)) {
    Write-Host "  ⚠ Creating frontend/.env.local file..." -ForegroundColor Yellow
    @"
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ML_SERVICE_URL=http://localhost:8000
"@ | Out-File -FilePath $frontendEnv -Encoding utf8
    Write-Host "  ✓ Created frontend/.env.local" -ForegroundColor Green
} else {
    Write-Host "  ✓ frontend/.env.local exists" -ForegroundColor Green
}

Write-Host ""

# Check MongoDB
Write-Host "[2/10] Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoCheck = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue
    if ($mongoCheck.TcpTestSucceeded) {
        Write-Host "  ✓ MongoDB is running on port 27017" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ MongoDB is not running on port 27017" -ForegroundColor Yellow
        Write-Host "  Please start MongoDB: mongod" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ⚠ Could not check MongoDB status" -ForegroundColor Yellow
    Write-Host "  Please ensure MongoDB is running" -ForegroundColor Yellow
}

Write-Host ""

# Install Backend Dependencies
Write-Host "[3/10] Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
if (-not (Test-Path "node_modules")) {
    Write-Host "  Running npm install..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed to install backend dependencies" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
} else {
    Write-Host "  ✓ Backend dependencies already installed" -ForegroundColor Green
}
Set-Location ..

Write-Host ""

# Install Frontend Dependencies
Write-Host "[4/10] Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
if (-not (Test-Path "node_modules")) {
    Write-Host "  Running npm install..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Frontend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed to install frontend dependencies" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
} else {
    Write-Host "  ✓ Frontend dependencies already installed" -ForegroundColor Green
}
Set-Location ..

Write-Host ""

# Install ML Service Dependencies
Write-Host "[5/10] Installing ML service dependencies..." -ForegroundColor Yellow
Set-Location ml-service

# Check Python version
$pythonVersion = python --version 2>&1
Write-Host "  Python: $pythonVersion" -ForegroundColor Cyan

# Upgrade pip, setuptools, wheel first
Write-Host "  Upgrading pip, setuptools, wheel..." -ForegroundColor Yellow
python -m pip install --upgrade pip setuptools wheel --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ⚠ Warning: pip upgrade had issues, continuing anyway..." -ForegroundColor Yellow
}

# Check if virtual environment exists
if (-not (Test-Path "venv") -and -not (Test-Path ".venv")) {
    Write-Host "  Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment if it exists
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "  Activating virtual environment..." -ForegroundColor Yellow
    & "venv\Scripts\Activate.ps1"
}

Write-Host "  Installing ML service packages..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ ML service dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to install ML service dependencies" -ForegroundColor Red
    Write-Host "  You may need to use Python 3.10 or 3.11 instead of Python 3.13" -ForegroundColor Yellow
    Set-Location ..
}
Set-Location ..

Write-Host ""

# Start Backend Server
Write-Host "[6/10] Starting backend server..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location backend
    npm run dev
}
Start-Sleep -Seconds 3
Write-Host "  ✓ Backend server started (Job ID: $($backendJob.Id))" -ForegroundColor Green
Write-Host "  Backend should be running on http://localhost:5000" -ForegroundColor Cyan

Write-Host ""

# Wait a bit and check backend health
Write-Host "[7/10] Checking backend health..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
try {
    $backendHealth = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    if ($backendHealth.StatusCode -eq 200) {
        Write-Host "  ✓ Backend is healthy and responding" -ForegroundColor Green
    }
} catch {
    Write-Host "  ⚠ Backend health check failed, but it may still be starting..." -ForegroundColor Yellow
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# Start ML Service
Write-Host "[8/10] Starting ML service..." -ForegroundColor Yellow
$mlJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location ml-service
    
    # Activate venv if it exists
    if (Test-Path "venv\Scripts\Activate.ps1") {
        & "venv\Scripts\Activate.ps1"
    }
    
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}
Start-Sleep -Seconds 3
Write-Host "  ✓ ML service started (Job ID: $($mlJob.Id))" -ForegroundColor Green
Write-Host "  ML service should be running on http://localhost:8000" -ForegroundColor Cyan

Write-Host ""

# Wait a bit and check ML service health
Write-Host "[9/10] Checking ML service health..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
try {
    $mlHealth = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    if ($mlHealth.StatusCode -eq 200) {
        Write-Host "  ✓ ML service is healthy and responding" -ForegroundColor Green
    }
} catch {
    Write-Host "  ⚠ ML service health check failed, but it may still be starting..." -ForegroundColor Yellow
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# Start Frontend
Write-Host "[10/10] Starting frontend..." -ForegroundColor Yellow
Write-Host "  Starting React dev server (this will open in your browser)..." -ForegroundColor Cyan
Set-Location frontend
$frontendProcess = Start-Process -FilePath "npm" -ArgumentList "start" -PassThru -WindowStyle Normal
Set-Location ..

Write-Host ""

# Summary
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Startup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services Status:" -ForegroundColor Yellow
Write-Host "  ✓ Backend:     http://localhost:5000" -ForegroundColor Green
Write-Host "  ✓ ML Service:  http://localhost:8000" -ForegroundColor Green
Write-Host "  ✓ Frontend:    http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Backend Job ID: $($backendJob.Id)" -ForegroundColor Cyan
Write-Host "ML Service Job ID: $($mlJob.Id)" -ForegroundColor Cyan
Write-Host "Frontend Process ID: $($frontendProcess.Id)" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop all services:" -ForegroundColor Yellow
Write-Host "  Stop-Job $($backendJob.Id), $($mlJob.Id)" -ForegroundColor Cyan
Write-Host "  Stop-Process -Id $($frontendProcess.Id)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Or press Ctrl+C and then manually stop each service" -ForegroundColor Yellow
Write-Host ""

# Wait for user input
Write-Host "Press Enter to view service logs, or Ctrl+C to exit..." -ForegroundColor Yellow
Read-Host

# Show job outputs
Write-Host ""
Write-Host "Backend Server Output:" -ForegroundColor Cyan
Receive-Job -Job $backendJob

Write-Host ""
Write-Host "ML Service Output:" -ForegroundColor Cyan
Receive-Job -Job $mlJob

