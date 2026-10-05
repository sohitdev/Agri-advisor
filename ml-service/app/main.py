from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

from app.models.predictor import CropPredictor

load_dotenv()

app = FastAPI(title="Agri-Advisor ML Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictor
predictor = CropPredictor()

@app.get("/")
async def root():
    return {"message": "Agri-Advisor ML Service", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

class PredictionRequest(BaseModel):
    state: str
    district: str
    season: str
    soil: dict
    weather: dict

class CropRecommendation(BaseModel):
    cropName: str
    suitabilityScore: float
    yieldPrediction: dict
    explanation: str
    environmentalFactors: dict

class PredictionResponse(BaseModel):
    recommendations: List[CropRecommendation]

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Predict crop recommendations based on location and environmental data.
    
    Returns top 3-5 suitable crops with yield predictions and explanations.
    """
    try:
        # Prepare features for prediction
        features = {
            'state': request.state,
            'district': request.district,
            'season': request.season,
            'soil_ph': request.soil.get('ph', 7.0),
            'soil_organic_carbon': request.soil.get('organicCarbon', 0.5),
            'soil_nitrogen': request.soil.get('nitrogen', 100),
            'soil_phosphorus': request.soil.get('phosphorus', 20),
            'soil_potassium': request.soil.get('potassium', 150),
            'avg_temperature': request.weather.get('avgTemperature', 25),
            'avg_rainfall': request.weather.get('avgRainfall', 800),
            'avg_humidity': request.weather.get('avgHumidity', 60)
        }
        
        # Get predictions
        recommendations = predictor.predict(features)
        
        return PredictionResponse(recommendations=recommendations)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


