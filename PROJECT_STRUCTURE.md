# Project Structure

Complete directory structure of the Agri-Advisor AI application.

```
Agri-advisor/
│
├── README.md                 # Main project README
├── SETUP.md                  # Detailed setup instructions
├── DEPLOYMENT.md             # Cloud deployment guide
├── PROJECT_STRUCTURE.md      # This file
├── .gitignore               # Git ignore rules
├── docker-compose.yml        # Docker orchestration
│
├── frontend/                 # React.js Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.js
│   │   │   │   ├── Register.js
│   │   │   │   └── Auth.css
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.js
│   │   │   │   └── Navbar.css
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── Dashboard.css
│   │   │   │   ├── RecommendationHistory.js
│   │   │   │   └── RecommendationHistory.css
│   │   │   └── recommendations/
│   │   │       ├── RecommendationResults.js
│   │   │       ├── RecommendationResults.css
│   │   │       ├── RecommendationCard.js
│   │   │       ├── RecommendationCard.css
│   │   │       ├── EnvironmentalSnapshot.js
│   │   │       └── EnvironmentalSnapshot.css
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── i18n/
│   │   │   └── index.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .env.example
│   └── README.md
│
├── backend/                  # Node.js/Express.js Backend
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── recommendationController.js
│   │   └── agroDataController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Crop.js
│   │   ├── Location.js
│   │   └── Recommendation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── crops.js
│   │   ├── recommendations.js
│   │   ├── agroData.js
│   │   └── locations.js
│   ├── tests/
│   │   └── auth.test.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── README.md
│
├── ml-service/               # Python FastAPI ML Service
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   └── models/
│   │       ├── __init__.py
│   │       ├── predictor.py
│   │       └── train_model.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── README.md
│
└── data-scripts/              # Data Acquisition Scripts
    ├── fetch_soil_data.py
    ├── fetch_weather_data.py
    ├── fetch_crop_data.py
    ├── aggregate_district_data.py
    ├── requirements.txt
    ├── districts.csv
    ├── .env.example
    └── README.md
```

## Component Overview

### Frontend (React.js)
- **Components**: Reusable UI components for authentication, dashboard, and recommendations
- **Context**: Global state management for authentication
- **i18n**: Internationalization support (English, Hindi)
- **Utils**: API client and helper functions

### Backend (Express.js)
- **Models**: MongoDB schemas for User, Crop, Location, Recommendation
- **Controllers**: Business logic for authentication, recommendations, and data management
- **Routes**: API endpoint definitions
- **Middleware**: Authentication and authorization middleware
- **Tests**: Unit tests for API endpoints

### ML Service (FastAPI)
- **Main**: FastAPI application with prediction endpoints
- **Models**: ML prediction logic (currently rule-based, extensible to trained models)
- **Training**: Script for training ML models from historical data

### Data Scripts (Python)
- **Soil Data**: Fetches from ISRIC SoilGrids API
- **Weather Data**: Fetches from OpenWeatherMap/WeatherAPI
- **Crop Data**: Processes government crop yield data
- **Aggregation**: Combines all data sources into district-level records

## Data Flow

1. **User Input**: Farmer selects State, District, Season on frontend
2. **API Request**: Frontend sends request to backend API
3. **Data Retrieval**: Backend fetches location environmental data from MongoDB
4. **ML Prediction**: Backend calls ML service with features
5. **ML Processing**: ML service calculates crop recommendations and yield predictions
6. **Response**: Results sent back through backend to frontend
7. **Display**: Frontend displays recommendations with explanations and environmental snapshot

## Database Collections

- **users**: User accounts (farmers, admins)
- **crops**: Crop information and requirements
- **locations**: District-level environmental data (soil, weather, crop history)
- **recommendations**: Historical recommendation records

## API Integration Points

- **ISRIC SoilGrids**: Soil property data
- **OpenWeatherMap/WeatherAPI**: Historical weather data
- **UPAg Portal**: Government crop yield statistics (CSV/manual)
- **ML Service**: Crop recommendation predictions

## Extension Points

The architecture supports easy extension for:
- Additional ML models (fertilizer recommendations, pest prediction)
- New data sources (NDVI satellite data, market prices)
- Additional languages
- Mobile app API
- Real-time weather integration
- IoT sensor data integration


