# Setup Guide - Agri-Advisor AI

Complete setup instructions for the Agri-Advisor AI application.

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (v5 or higher)
- Docker (optional, for containerized deployment)
- Git

## Step-by-Step Setup

### 1. Clone/Download the Project

```bash
cd Agri-advisor
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agri-advisor
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
ML_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key
```

Start MongoDB (if running locally):
```bash
mongod
```

Start backend:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. ML Service Setup

```bash
cd ml-service
pip install -r requirements.txt
cp .env.example .env
```

Edit `ml-service/.env`:
```
MODEL_PATH=./models/crop_model.pkl
DEBUG=True
```

Start ML service:
```bash
uvicorn app.main:app --reload
```

ML service will run on `http://localhost:8000`

### 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ML_SERVICE_URL=http://localhost:8000
```

Start frontend:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

### 5. Data Acquisition (Optional)

To fetch and process agricultural data:

```bash
cd data-scripts
pip install -r requirements.txt
cp .env.example .env
```

Add API keys to `data-scripts/.env`:
```
OPENWEATHER_API_KEY=your-key
WEATHERAPI_KEY=your-key
MONGODB_URI=mongodb://localhost:27017/agri-advisor
```

Run data acquisition scripts:
```bash
# Fetch soil data
python fetch_soil_data.py

# Fetch weather data
python fetch_weather_data.py

# Process crop data
python fetch_crop_data.py

# Aggregate all data
python aggregate_district_data.py
```

## Docker Setup (Alternative)

### Using Docker Compose

```bash
# From project root
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend on port 5000
- ML Service on port 8000
- Frontend on port 3000

### Individual Docker Containers

```bash
# Backend
cd backend
docker build -t agri-backend .
docker run -p 5000:5000 agri-backend

# ML Service
cd ml-service
docker build -t agri-ml-service .
docker run -p 8000:8000 agri-ml-service

# Frontend
cd frontend
docker build -t agri-frontend .
docker run -p 3000:80 agri-frontend
```

## Initial Data Setup

### Create Admin User

You can create an admin user through the registration API or directly in MongoDB:

```javascript
// In MongoDB shell or Compass
use agri-advisor
db.users.insertOne({
  name: "Admin",
  email: "admin@agriadvisor.com",
  password: "$2a$12$...", // bcrypt hash of password
  role: "admin"
})
```

### Seed Crop Data

Create some initial crop records:

```javascript
db.crops.insertMany([
  {
    name: "Rice",
    scientificName: "Oryza sativa",
    season: "Kharif",
    minTemperature: 20,
    maxTemperature: 35,
    minRainfall: 1000,
    maxRainfall: 2500,
    soilTypes: ["Clay", "Loam"],
    phRange: { min: 5.5, max: 7.0 }
  },
  // Add more crops...
])
```

### Seed Location Data

After running data acquisition scripts, location data will be automatically stored in MongoDB.

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Manual Testing

1. Register a new user at `http://localhost:3000/register`
2. Login at `http://localhost:3000/login`
3. Select State, District, and Season
4. Get crop recommendations

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod` or check service status
- Verify connection string in `.env`
- Check firewall settings

### ML Service Not Responding

- Verify ML service is running on port 8000
- Check `ML_SERVICE_URL` in backend `.env`
- Review ML service logs

### CORS Errors

- Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL
- Check browser console for specific CORS errors

### Port Conflicts

- Change ports in respective `.env` files if conflicts occur
- Update `docker-compose.yml` if using Docker

## Next Steps

1. Train ML model with actual data (see `ml-service/app/models/train_model.py`)
2. Add more districts and location data
3. Integrate with actual government APIs
4. Deploy to cloud (see `DEPLOYMENT.md`)

## Support

For issues or questions, refer to individual component README files:
- `backend/README.md`
- `frontend/README.md`
- `ml-service/README.md`
- `data-scripts/README.md`


