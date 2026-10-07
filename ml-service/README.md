# Agri-Advisor ML Service

The ML Service is a Python-based FastAPI application responsible for generating personalized crop and yield recommendations. It relies on trained machine learning models (XGBoost and scikit-learn) to map district-level soil profiles and real-time weather data into crop suitability scores.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Python 3.9** | Runtime environment (via Docker slim image) |
| **FastAPI** | High-performance web framework for the API |
| **Uvicorn** | ASGI server to run the FastAPI app |
| **scikit-learn** | Machine learning preprocessing and fallback models |
| **XGBoost** | Gradient boosting for primary prediction and yield regression |
| **Pandas / Numpy**| Data manipulation and feature extraction |
| **pytest** | Testing framework |

## Project Structure

```text
ml-service/
├── app/
│   ├── data/                 # Raw data extraction scripts and arrays (.npy, .csv)
│   ├── models/
│   │   ├── trained/          # Serialized models (.pkl) and JSON encoders
│   │   ├── predictor.py      # Core prediction logic and model loader
│   │   └── train_model.py    # Training logic and cross-validation
│   └── main.py               # FastAPI application endpoints
├── tests/                    # Pytest suites
├── Dockerfile                # Production Docker configuration
├── pytest.ini                # Pytest config
├── requirements.txt          # Python dependencies
└── run_training.py           # Entry point to execute model training locally
```

## Available Commands

In the `ml-service` directory, you can run:

```bash
uvicorn app.main:app --reload --port 8000  # Start the dev server
python run_training.py                     # Retrain the machine learning models
pytest                                     # Run the test suite
```

## Environment Variables

Copy `.env.example` to `.env`:

```env
# OpenWeather API Key for live weather ingestion (Required)
OPENWEATHER_API_KEY=your_openweather_api_key

# Set to "true" to perform full cross-validation during run_training.py (Optional)
RUN_SEASON_CV=false
```

## Model Architecture & Loading

The `predictor.py` script automatically loads the highest available model version from `app/models/trained/` on startup. 

- **v3 Models (Current)**: Season-specific models trained on extensive datasets. Internally, the predictor checks for `crop_classifier_v3.pkl`. If found, it uses these for highly accurate (roughly ~96% Top-5 accuracy in training) recommendations.
- **v2 & v1 Models**: Provided as transparent fallbacks in the code. If v3 is missing, it attempts to load v2, then v1, gracefully falling back to rule-based constraints if all models are absent.

**Note on Docker**: The `docker-compose.yml` mounts a volume to `/app/models` and sets an environment variable `MODEL_PATH=/app/models/crop_model.pkl`. *This variable is safely ignored by the code*; the `predictor.py` class hardcodes the paths relatively to the `app/models/trained/` directory to ensure version safety.

## Training the Models

You can generate fresh `.pkl` files and `.json` encoders by running the training script:

```bash
python run_training.py
```
This script:
1. Reads `app/data/training_data.csv`.
2. Fits the scikit-learn standard scalers and XGBoost classifiers.
3. Performs season-specific split evaluations (if `RUN_SEASON_CV` is true).
4. Saves the outputs into `app/models/trained/`.

*(Note: There is no `evaluate_model.py` script; evaluation logic is deeply integrated into `train_model.py` which runs via `run_training.py`)*

## API Endpoints

The API serves on port `8000`. 

### `GET /` and `GET /health`
Returns the status and health of the API.

### `POST /predict`
The primary prediction engine.

**Request Body (`PredictionRequest`)**:
```json
{
  "state": "Maharashtra",
  "district": "Pune",
  "season": "Kharif",
  "soil": {
    "ph": 6.5,
    "organicCarbon": 0.8,
    "nitrogen": 120,
    "phosphorus": 45,
    "potassium": 210
  },
  "weather": {
    "temperature": 25.5,
    "humidity": 65,
    "rainfall": 120
  }
}
```

**Response (`PredictionResponse`)**:
```json
{
  "recommendations": [
    {
      "cropName": "Soybean",
      "suitabilityScore": 92.5,
      "yieldPrediction": {
        "expected": 2400,
        "unit": "kg/ha"
      },
      "explanation": "Highly suitable for Kharif season based on optimal pH (6.5).",
      "environmentalFactors": {
        "temp_match": "optimal",
        "soil_match": "good"
      }
    }
  ]
}
```

## Known Limitations

- **Unseen Districts**: If a district was not present in `training_data.csv` during `run_training.py`, the model may log a warning `unable to load district crop candidates` and rely heavily on macro-level state or generalized weather parameters.
- **Model Files**: If `app/models/trained/` is completely empty, the service will boot but fall back to less accurate rule-based heuristics. Always run `python run_training.py` first if cloning freshly without model files.
