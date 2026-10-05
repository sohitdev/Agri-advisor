"""
Fetch historical weather data from OpenWeatherMap or WeatherAPI
Aggregates weather statistics for districts
"""
import requests
import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
import os
from dotenv import load_dotenv
import json
from datetime import datetime, timedelta
from geopy.geocoders import Nominatim
import time

load_dotenv()

OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
WEATHERAPI_KEY = os.getenv('WEATHERAPI_KEY')

def get_district_coordinates(district_name: str, state_name: str) -> Tuple[float, float]:
    """Get coordinates for a district."""
    geolocator = Nominatim(user_agent="agri-advisor")
    location = geolocator.geocode(f"{district_name}, {state_name}, India")
    
    if location:
        return (location.latitude, location.longitude)
    else:
        state_location = geolocator.geocode(f"{state_name}, India")
        if state_location:
            return (state_location.latitude, state_location.longitude)
        return None

def fetch_historical_weather_openweather(lat: float, lon: float, days: int = 365) -> List[Dict]:
    """
    Fetch historical weather data from OpenWeatherMap (requires paid plan for historical).
    For free tier, use current weather and forecast.
    """
    if not OPENWEATHER_API_KEY:
        print("OpenWeatherMap API key not found")
        return []
    
    # Current weather (free tier)
    current_url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        'lat': lat,
        'lon': lon,
        'appid': OPENWEATHER_API_KEY,
        'units': 'metric'
    }
    
    try:
        response = requests.get(current_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        return [{
            'date': datetime.now().isoformat(),
            'temperature': data['main']['temp'],
            'humidity': data['main']['humidity'],
            'rainfall': data.get('rain', {}).get('1h', 0) if 'rain' in data else 0,
            'pressure': data['main']['pressure']
        }]
    except Exception as e:
        print(f"Error fetching weather data: {str(e)}")
        return []

def fetch_historical_weather_weatherapi(lat: float, lon: float, days: int = 365) -> List[Dict]:
    """
    Fetch historical weather data from WeatherAPI.com
    """
    if not WEATHERAPI_KEY:
        print("WeatherAPI key not found")
        return []
    
    # Historical API endpoint (requires subscription)
    # For demo, use forecast API
    forecast_url = "https://api.weatherapi.com/v1/forecast.json"
    params = {
        'key': WEATHERAPI_KEY,
        'q': f"{lat},{lon}",
        'days': 10,
        'aqi': 'no',
        'alerts': 'no'
    }
    
    try:
        response = requests.get(forecast_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        weather_data = []
        if 'forecast' in data and 'forecastday' in data['forecast']:
            for day in data['forecast']['forecastday']:
                weather_data.append({
                    'date': day['date'],
                    'temperature': day['day']['avgtemp_c'],
                    'humidity': day['day']['avghumidity'],
                    'rainfall': day['day']['totalprecip_mm'],
                    'maxTemp': day['day']['maxtemp_c'],
                    'minTemp': day['day']['mintemp_c']
                })
        
        return weather_data
    except Exception as e:
        print(f"Error fetching weather data: {str(e)}")
        return []

def aggregate_weather_data(district_name: str, state_name: str) -> Dict:
    """
    Aggregate weather data for a district.
    """
    coords = get_district_coordinates(district_name, state_name)
    if not coords:
        print(f"Could not get coordinates for {district_name}, {state_name}")
        return {}
    
    lat, lon = coords
    
    # Try WeatherAPI first, then OpenWeatherMap
    weather_data = []
    if WEATHERAPI_KEY:
        weather_data = fetch_historical_weather_weatherapi(lat, lon)
    elif OPENWEATHER_API_KEY:
        weather_data = fetch_historical_weather_openweather(lat, lon)
    
    if not weather_data:
        # Use sample data if API unavailable
        print("Using sample weather data")
        weather_data = generate_sample_weather_data()
    
    # Aggregate statistics
    df = pd.DataFrame(weather_data)
    
    aggregated = {}
    if 'temperature' in df.columns:
        temps = df['temperature'].dropna()
        if len(temps) > 0:
            aggregated['avgTemperature'] = {
                'mean': float(temps.mean()),
                'median': float(temps.median()),
                'stdDev': float(temps.std())
            }
    
    if 'rainfall' in df.columns:
        rainfall = df['rainfall'].dropna()
        if len(rainfall) > 0:
            aggregated['avgRainfall'] = {
                'mean': float(rainfall.mean()),
                'median': float(rainfall.median()),
                'stdDev': float(rainfall.std())
            }
    
    if 'humidity' in df.columns:
        humidity = df['humidity'].dropna()
        if len(humidity) > 0:
            aggregated['avgHumidity'] = {
                'mean': float(humidity.mean()),
                'median': float(humidity.median()),
                'stdDev': float(humidity.std())
            }
    
    aggregated['lastUpdated'] = datetime.now().isoformat()
    
    return aggregated

def generate_sample_weather_data() -> List[Dict]:
    """Generate sample weather data for testing."""
    data = []
    base_date = datetime.now() - timedelta(days=365)
    
    for i in range(365):
        date = base_date + timedelta(days=i)
        data.append({
            'date': date.isoformat(),
            'temperature': np.random.normal(25, 5),
            'humidity': np.random.normal(60, 10),
            'rainfall': max(0, np.random.exponential(5))
        })
    
    return data

def process_districts(districts_file: str = "districts.csv"):
    """Process weather data for multiple districts."""
    data_dir = os.getenv('RAW_DATA_DIR', './data/raw')
    os.makedirs(data_dir, exist_ok=True)
    
    if not os.path.exists(districts_file):
        print(f"Districts file not found: {districts_file}")
        return
    
    df = pd.read_csv(districts_file)
    results = []
    
    for idx, row in df.iterrows():
        print(f"Processing {row['district']}, {row['state']}...")
        weather_data = aggregate_weather_data(row['district'], row['state'])
        
        if weather_data:
            result = {
                'state': row['state'],
                'district': row['district'],
                'weatherData': weather_data
            }
            results.append(result)
        
        time.sleep(1)  # Rate limiting
    
    # Save results
    output_file = os.path.join(data_dir, 'weather_data.json')
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"Saved weather data to {output_file}")
    return results

if __name__ == "__main__":
    print("Fetching weather data...")
    process_districts()


