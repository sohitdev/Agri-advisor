import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Agri-Advisor ML Service", "status": "running"}

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_predict_success():
    payload = {
        "state": "Punjab",
        "district": "Ludhiana",
        "season": "Kharif",
        "soil": {
            "ph": 7.0,
            "organicCarbon": 0.5,
            "nitrogen": 100,
            "phosphorus": 30,
            "potassium": 150
        },
        "weather": {
            "avgTemperature": 32.0,
            "avgRainfall": 800,
            "avgHumidity": 70.0
        }
    }
    
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
    assert len(data["recommendations"]) > 0
    assert "cropName" in data["recommendations"][0]

def test_predict_validation_error():
    payload = {
        "state": "Punjab"
        # missing district, season, etc.
    }
    
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
