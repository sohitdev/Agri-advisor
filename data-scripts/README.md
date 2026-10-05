# Data Acquisition Scripts

Scripts for fetching and processing agricultural data from various sources.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment:
```bash
cp .env.example .env
# Add your API keys and MongoDB URI
```

## Scripts

### 1. fetch_soil_data.py
Fetches soil properties from ISRIC SoilGrids API.

```bash
python fetch_soil_data.py
```

Requires:
- Districts CSV file (state, district columns)
- Internet connection for API access

Output: `data/raw/soil_data.json`

### 2. fetch_weather_data.py
Fetches historical weather data from OpenWeatherMap or WeatherAPI.

```bash
python fetch_weather_data.py
```

Requires:
- API key (OpenWeatherMap or WeatherAPI)
- Districts CSV file

Output: `data/raw/weather_data.json`

### 3. fetch_crop_data.py
Processes crop yield data from CSV files or UPAg portal.

```bash
python fetch_crop_data.py
```

Input: `crop_yield_data.csv` (state, district, crop, season, year, yield, area)

Output: `data/raw/crop_yield_data.json`

### 4. aggregate_district_data.py
Aggregates all district-level data and stores in MongoDB.

```bash
python aggregate_district_data.py
```

This script:
- Merges soil, weather, and crop data by district
- Calculates descriptive statistics (mean, median, stdDev)
- Stores aggregated data in MongoDB
- Saves to `data/processed/district_data_aggregated.json`

## Data Sources

### ISRIC SoilGrids
- Global soil property maps
- Free API access
- Properties: pH, organic carbon, nitrogen, phosphorus, potassium, etc.

### OpenWeatherMap / WeatherAPI
- Historical weather data
- Requires API key (some features require paid plan)
- Properties: temperature, rainfall, humidity

### UPAg Portal
- Indian government agricultural statistics
- Crop production and yield data
- May require manual CSV downloads

## Data Format

### District Data Structure
```json
{
  "state": "Gujarat",
  "district": "Ahmedabad",
  "soilData": {
    "ph": {"mean": 6.5, "median": 6.4, "stdDev": 0.3},
    "organicCarbon": {"mean": 0.8, "median": 0.75, "stdDev": 0.2},
    ...
  },
  "weatherData": {
    "avgTemperature": {"mean": 28.5, "median": 28.0, "stdDev": 3.2},
    "avgRainfall": {"mean": 900, "median": 850, "stdDev": 200},
    ...
  },
  "cropYieldHistory": [...]
}
```

## Notes

- API rate limits may apply - scripts include delays
- Some APIs require paid subscriptions for historical data
- For production, use actual district polygon boundaries instead of point sampling
- Consider caching API responses to avoid repeated requests


