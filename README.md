# Agri-Advisor AI

A full-stack web application that provides personalized crop and yield recommendations for Indian farmers at the district level, using high-resolution soil data, historical weather statistics, and government crop yield records.

## Project Structure

```text
Agri-advisor/
├── frontend/              # React 18 + Vite + Tailwind v4
├── backend/               # Node + Express v5 + Mongoose + Jest
├── ml-service/            # FastAPI + XGBoost/sklearn
├── data-scripts/          # Data acquisition and processing scripts
└── docker-compose.yml     # Docker orchestration
```

## Features
- **Personalized Recommendations**: Top 3-5 suitable crops with yield predictions.
- **District-Level Analysis**: High-resolution soil and weather data aggregation.
- **Role-Based Access**: Farmer and Admin roles with JWT authentication.
- **ML-Powered Predictions**: Python FastApi service.

## Documentation
- See **[SETUP.md](./SETUP.md)** for local development and Docker instructions.
