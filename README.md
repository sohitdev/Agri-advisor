# Agri-Advisor AI

Agri-Advisor AI is a full-stack web application that provides personalized crop and yield recommendations for Indian farmers at the district level. It aggregates high-resolution soil data, historical weather statistics, and government crop yield records to power its recommendations.

## Features

- **Personalized Recommendations**: Generates top 3-5 suitable crops with yield predictions.
- **District-Level Analysis**: Interactive dashboards for high-resolution soil and weather data aggregation.
- **Role-Based Access**: Farmer and Admin roles authenticated securely with JWT.
- **ML-Powered Predictions**: Backed by a FastAPI service running XGBoost and scikit-learn models.

## Tech Stack

| Layer | Technology | Version |
| --- | --- | --- |
| **Frontend** | React (Vite), TailwindCSS | 18.2.0 (Vite 8.x) |
| **Backend** | Node.js, Express, Mongoose | 16.x (Express 5.2.1) |
| **ML Service** | Python, FastAPI, XGBoost, scikit-learn | 3.9 (FastAPI 0.111.0) |
| **Database** | MongoDB | 5.0 |

## Architecture

A React frontend communicates with an Express Node.js backend. The backend manages users, handles authentication, and stores recommendation history in MongoDB. When a user requests a recommendation, the backend fetches weather data (via OpenWeather API) and district soil data, then sends this payload to the Python FastAPI ML Service. The ML Service runs the data through trained scikit-learn and XGBoost models to predict crop suitability and yields. It returns the results to the backend, which saves them and passes them back to the frontend for display.

## Project Structure

```text
Agri-advisor/
├── backend/               # Node.js Express API server and MongoDB schemas
├── frontend/              # React Vite application and UI components
├── ml-service/            # Python FastAPI service for machine learning predictions
├── data-scripts/          # Python scripts for fetching and preparing agricultural data
├── data/                  # Raw CSV data files used for model training
└── docker-compose.yml     # Orchestration for MongoDB, backend, frontend, and ml-service
```

## Prerequisites

- **Node.js**: v16.x (recommended)
- **Python**: v3.9.x (recommended)
- **MongoDB**: v5.0 (if running locally)
- **Docker & Docker Compose** (optional but recommended for a seamless full-stack run)

## Quick Start (Docker)

You can run the entire stack using Docker Compose from the root directory:

```bash
docker-compose up --build
```

**Service Ports & Health Checks:**
- **Frontend**: http://localhost:3000 (Wait, Note: Due to a current port-mapping configuration, you may need to map this directly to `3000:80` in `docker-compose.yml` or access the nginx container directly if it fails on 3000).
- **Backend API**: http://localhost:5000/api
- **ML Service**: http://localhost:8000/health
- **MongoDB**: localhost:27017

## Manual Setup

If you prefer to run the services individually without Docker, you must start MongoDB and then follow these steps in order.

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. ML Service Setup

```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run start
```
*Note: Vite runs on port `3000` by default in this project via `vite.config.mjs`.*

## Environment Variables

Each service requires its own environment configuration. Please duplicate the `.env.example` files into `.env` and fill in the secrets.

### Backend (`backend/.env`)
| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `PORT` | No | 5000 | Server listening port |
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Secret key for JWT signing |
| `JWT_EXPIRE` | No | 30d | JWT token expiration time |
| `CORS_ORIGIN` | No | * | Allowed CORS origin (e.g., frontend URL) |
| `ML_SERVICE_URL` | Yes | - | Internal URL to reach the ML Service |
| `FRONTEND_URL` | Yes | - | URL used in email templates (password reset) |
| `EMAIL_SERVICE` | Yes | - | Email provider for nodemailer |
| `EMAIL_USER` | Yes | - | SMTP username |
| `EMAIL_PASS` | Yes | - | SMTP password |
| `DATA_GOV_API_KEY` | Yes | - | Government data API key (from data.gov.in) |
| `MAX_FILE_SIZE` | No | 5MB | Maximum limit for file uploads |
| `UPLOAD_PATH` | No | /uploads | Path where uploaded files are stored |
| `NODE_ENV` | No | development | Application environment state |

### Frontend (`frontend/.env`)
| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `VITE_API_URL` | Yes | - | Base URL for the Backend API |
| `VITE_ML_SERVICE_URL` | Yes | - | Base URL for the ML Service API |

### ML-Service (`ml-service/.env`)
| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `OPENWEATHER_API_KEY` | Yes | "" | API key for fetching real-time weather data |
| `RUN_SEASON_CV` | No | false | Flag to toggle cross-validation during training |

## API Overview

- **Backend API**: Handles authentication, profile management, and stores historical data. See [backend/README.md](./backend/README.md) for full endpoint references.
- **ML Service**: Exposes a `/predict` endpoint that takes environmental context and returns crop suggestions. See [ml-service/README.md](./ml-service/README.md) for ML documentation.

## Running Tests

**Backend**:
```bash
cd backend
npm run test
```

**ML Service**:
```bash
cd ml-service
pytest
```
*(Note: There are currently no explicit frontend test scripts defined in `package.json`.)*

## Deployment Notes

- **Frontend**: The `frontend/Dockerfile` utilizes a two-stage build, generating static files via Node and serving them via `nginx:alpine` on port 80.
- **Backend**: Uses a lightweight `node:16-alpine` image serving the Express API. 
- **ML Service**: Deploys via a `python:3.9-slim` image using Uvicorn. 

## Troubleshooting

- **Frontend fails to load via Docker Compose**: The `docker-compose.yml` maps `3000:3000` for the frontend, but the internal Nginx server exposes port `80`. Edit `docker-compose.yml` to use `ports: - "3000:80"` for the frontend service to resolve this.
- **Ghost ML Model Path**: The docker compose file sets `MODEL_PATH=/app/models/crop_model.pkl`. This variable is not actually used by the code; the predictor hardcodes the load paths inside `app/models/trained/`.
- **Missing ML Models**: If the FastAPI server complains about missing models on startup, manually generate them by running `python run_training.py` inside the `ml-service` directory.
- **Vite Port Drift**: If you migrate away from `vite.config.mjs`, Vite will fall back to its default port `5173`. Ensure your `CORS_ORIGIN` in the backend `.env` matches the active frontend port.

## Contributing

1. Create a descriptively named branch for your feature or bug fix.
2. Ensure you've run the test suites (`npm run test` and `pytest`) before opening a pull request.
3. Verify that new environment variables are documented in `.env.example` and the README.
