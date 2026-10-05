# Backend API - Agri-Advisor AI

Express.js backend API for Agri-Advisor AI application.

## Features

- RESTful API endpoints
- JWT authentication
- Role-based access control (Farmer/Admin)
- MongoDB integration
- ML service integration
- File upload support (CSV/Excel)
- CORS enabled

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Run the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Protected)
- `PUT /api/users/:id` - Update user (Protected)

### Crops
- `GET /api/crops` - Get all crops
- `GET /api/crops?season=Kharif` - Get crops by season
- `GET /api/crops/:id` - Get crop by ID
- `POST /api/crops` - Create crop (Admin only)

### Recommendations
- `POST /api/recommendations` - Get crop recommendations (Protected)
- `GET /api/recommendations` - Get recommendation history (Protected)
- `GET /api/recommendations/:id` - Get single recommendation (Protected)

### Agro Data
- `GET /api/agro-data` - List all locations (Admin only)
- `POST /api/agro-data` - Create/Update location data (Admin only)
- `GET /api/agro-data/:state/:district` - Get location data (Protected)
- `POST /api/agro-data/upload` - Upload CSV/Excel file (Admin only)

### Locations
- `GET /api/locations/states` - Get all states
- `GET /api/locations/districts/:state` - Get districts by state

### Market Prices
- `GET /api/market-prices?crop=Rice&state=Punjab&district=Ludhiana&timeRange=1month` - Get current district mandi prices via Gemini (Protected)

## Environment Variables

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agri-advisor
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
ML_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key
```

## Testing

```bash
npm test
```

## Docker

```bash
docker build -t agri-backend .
docker run -p 5000:5000 agri-backend
```


