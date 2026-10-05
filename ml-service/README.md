# ML Service - Agri-Advisor AI

Python FastAPI service for crop recommendation and yield prediction.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your settings
```

3. Run the service:
```bash
uvicorn app.main:app --reload
```

## API Endpoints

### Health Check
- `GET /` - Service info
- `GET /health` - Health status

### Prediction
- `POST /predict` - Get crop recommendations

### Request Format
```json
{
  "state": "Gujarat",
  "district": "Ahmedabad",
  "season": "Kharif",
  "soil": {
    "ph": 6.5,
    "organicCarbon": 0.8,
    "nitrogen": 120,
    "phosphorus": 25,
    "potassium": 180
  },
  "weather": {
    "avgTemperature": 28,
    "avgRainfall": 900,
    "avgHumidity": 65
  }
}
```

### Response Format
```json
{
  "recommendations": [
    {
      "cropName": "Rice",
      "suitabilityScore": 85.5,
      "yieldPrediction": {
        "min": 2400,
        "max": 3600,
        "expected": 3000
      },
      "explanation": "...",
      "environmentalFactors": {
        "soilMatch": 90,
        "weatherMatch": 85,
        "historicalYield": 70
      }
    }
  ]
}
```

## Model Training

The current implementation uses rule-based predictions. To use a trained ML model:

1. Train your model using `train_model.py` (to be implemented)
2. Save the model to `models/crop_model.pkl`
3. Update `CropPredictor` to load and use the trained model

## Docker

Build and run with Docker:
```bash
docker build -t agri-ml-service .
docker run -p 8000:8000 agri-ml-service
```


