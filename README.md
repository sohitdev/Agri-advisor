# Agri-Advisor AI

A full-stack MERN web application that provides personalized crop and yield recommendations for Indian farmers at the district level, using high-resolution soil data, historical weather statistics, and government crop yield records.

## Project Structure

```
Agri-advisor/
├── frontend/              # React.js frontend application
├── backend/               # Node.js/Express.js backend API
├── ml-service/            # Python ML service (FastAPI)
├── data-scripts/          # Data acquisition and processing scripts
└── docker-compose.yml     # Docker orchestration
```

## Features

- **Personalized Recommendations**: Top 3-5 suitable crops with yield predictions
- **District-Level Analysis**: High-resolution soil and weather data aggregation
- **Multi-Language Support**: UI structure for multiple languages
- **Role-Based Access**: Farmer and Admin roles with JWT authentication
- **Environmental Snapshot**: Summary of soil and weather values
- **ML-Powered Predictions**: Python service for crop recommendations

## Quick Start

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- MongoDB (v5+)

### Environment Setup

1. **Backend Setup**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

2. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your backend API URL
   npm start
   ```

3. **ML Service Setup**
   ```bash
   cd ml-service
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your configuration
   uvicorn app.main:app --reload
   ```

## Data Acquisition

Run data acquisition scripts to fetch and process:

- Soil data from ISRIC SoilGrids API
- Historical weather from OpenWeatherMap/WeatherAPI
- Crop yield statistics from government sources

```bash
cd data-scripts
python fetch_soil_data.py
python fetch_weather_data.py
python fetch_crop_data.py
python aggregate_district_data.py
```

## API Documentation

Backend API runs on `http://localhost:5000`
ML Service runs on `http://localhost:8000`

See individual README files in each directory for detailed documentation.

## Cloud Deployment

See `DEPLOYMENT.md` for AWS/GCP/Heroku deployment instructions.
