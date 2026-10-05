"""
Fetch soil data from ISRIC SoilGrids API
Aggregates soil properties for districts in India
"""
import requests
import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
import os
from dotenv import load_dotenv
import json
from geopy.geocoders import Nominatim
import time

load_dotenv()

# ISRIC SoilGrids API endpoint
SOILGRIDS_BASE_URL = "https://rest.isric.org/soilgrids/v2.0/properties/query"

def get_district_coordinates(district_name: str, state_name: str) -> Tuple[float, float]:
    """
    Get approximate coordinates for a district using geocoding.
    In production, use official district boundary polygons.
    """
    geolocator = Nominatim(user_agent="agri-advisor")
    location = geolocator.geocode(f"{district_name}, {state_name}, India")
    
    if location:
        return (location.latitude, location.longitude)
    else:
        # Default to state center if district not found
        state_location = geolocator.geocode(f"{state_name}, India")
        if state_location:
            return (state_location.latitude, state_location.longitude)
        return None

def fetch_soil_properties(lat: float, lon: float, depth: str = "0-5cm") -> Dict:
    """
    Fetch soil properties from ISRIC SoilGrids API for given coordinates.
    
    Args:
        lat: Latitude
        lon: Longitude
        depth: Soil depth (0-5cm, 5-15cm, etc.)
    
    Returns:
        Dictionary with soil properties
    """
    params = {
        "lon": lon,
        "lat": lat,
        "property": "phh2o,ocd,soc,clay,sand,silt,nitrogen,phosphorus,potassium",
        "depth": depth,
        "value": "mean"
    }
    
    try:
        response = requests.get(SOILGRIDS_BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Extract properties from response
        properties = {}
        if 'properties' in data:
            for prop in data['properties']:
                prop_name = prop.get('name', '')
                prop_value = prop.get('depths', [{}])[0].get('values', {}).get('mean', None)
                properties[prop_name] = prop_value
        
        return {
            'ph': properties.get('phh2o', None),
            'organicCarbon': properties.get('ocd', None) or properties.get('soc', None),
            'clay': properties.get('clay', None),
            'sand': properties.get('sand', None),
            'silt': properties.get('silt', None),
            'nitrogen': properties.get('nitrogen', None),
            'phosphorus': properties.get('phosphorus', None),
            'potassium': properties.get('potassium', None)
        }
    except Exception as e:
        print(f"Error fetching soil data for ({lat}, {lon}): {str(e)}")
        return {}

def aggregate_soil_data(district_name: str, state_name: str, num_samples: int = 5) -> Dict:
    """
    Aggregate soil data for a district by sampling multiple points.
    In production, use actual district polygon boundaries.
    
    Args:
        district_name: Name of the district
        state_name: Name of the state
        num_samples: Number of sample points to fetch
    
    Returns:
        Aggregated soil data with mean, median, stdDev
    """
    coords = get_district_coordinates(district_name, state_name)
    if not coords:
        print(f"Could not get coordinates for {district_name}, {state_name}")
        return {}
    
    lat, lon = coords
    
    # Sample points around the district center (simplified approach)
    # In production, sample from actual district polygon
    samples = []
    for i in range(num_samples):
        # Add small random offset
        offset_lat = lat + np.random.uniform(-0.1, 0.1)
        offset_lon = lon + np.random.uniform(-0.1, 0.1)
        
        soil_data = fetch_soil_properties(offset_lat, offset_lon)
        if soil_data:
            samples.append(soil_data)
        
        time.sleep(0.5)  # Rate limiting
    
    if not samples:
        return {}
    
    # Aggregate statistics
    df = pd.DataFrame(samples)
    
    aggregated = {}
    for col in df.columns:
        values = df[col].dropna()
        if len(values) > 0:
            aggregated[col] = {
                'mean': float(values.mean()),
                'median': float(values.median()),
                'stdDev': float(values.std())
            }
    
    return aggregated

def process_districts(districts_file: str = "districts.csv"):
    """
    Process soil data for multiple districts from a CSV file.
    
    CSV format: state,district
    """
    data_dir = os.getenv('RAW_DATA_DIR', './data/raw')
    os.makedirs(data_dir, exist_ok=True)
    
    if not os.path.exists(districts_file):
        print(f"Districts file not found: {districts_file}")
        print("Creating sample districts file...")
        sample_districts = pd.DataFrame({
            'state': ['Gujarat', 'Maharashtra', 'Punjab'],
            'district': ['Ahmedabad', 'Pune', 'Ludhiana']
        })
        sample_districts.to_csv(districts_file, index=False)
    
    df = pd.read_csv(districts_file)
    results = []
    
    for idx, row in df.iterrows():
        print(f"Processing {row['district']}, {row['state']}...")
        soil_data = aggregate_soil_data(row['district'], row['state'])
        
        if soil_data:
            result = {
                'state': row['state'],
                'district': row['district'],
                'soilData': soil_data
            }
            results.append(result)
        
        time.sleep(1)  # Rate limiting between districts
    
    # Save results
    output_file = os.path.join(data_dir, 'soil_data.json')
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"Saved soil data to {output_file}")
    return results

if __name__ == "__main__":
    print("Fetching soil data from ISRIC SoilGrids...")
    process_districts()


