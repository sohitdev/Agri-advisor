"""
Aggregate all district-level data (soil, weather, crop) and store in MongoDB
Combines data from different sources into unified district records
"""
import json
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime
import pandas as pd

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/agri-advisor')
DATA_DIR = os.getenv('RAW_DATA_DIR', './data/raw')

def load_json_data(filename: str) -> list:
    """Load JSON data from file."""
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return []
    
    with open(filepath, 'r') as f:
        return json.load(f)

def merge_district_data(soil_data: list, weather_data: list, crop_data: list) -> list:
    """
    Merge soil, weather, and crop data by district.
    
    Returns:
        List of merged district records
    """
    # Create lookup dictionaries
    soil_lookup = {(item['state'], item['district']): item.get('soilData', {}) 
                   for item in soil_data}
    weather_lookup = {(item['state'], item['district']): item.get('weatherData', {}) 
                     for item in weather_data}
    crop_lookup = {}
    for item in crop_data:
        key = (item['state'], item['district'])
        if key not in crop_lookup:
            crop_lookup[key] = []
        crop_lookup[key].extend(item.get('cropHistory', []))
    
    # Get all unique districts
    all_districts = set()
    all_districts.update(soil_lookup.keys())
    all_districts.update(weather_lookup.keys())
    all_districts.update(crop_lookup.keys())
    
    # Merge data
    merged_records = []
    for state, district in all_districts:
        record = {
            'state': state,
            'district': district,
            'soilData': soil_lookup.get((state, district), {}),
            'weatherData': weather_lookup.get((state, district), {}),
            'cropYieldHistory': crop_lookup.get((state, district), []),
            'lastUpdated': datetime.now().isoformat()
        }
        merged_records.append(record)
    
    return merged_records

def store_in_mongodb(records: list):
    """Store aggregated district data in MongoDB."""
    try:
        client = MongoClient(MONGODB_URI)
        db = client.get_database()
        collection = db.locations
        
        # Upsert records
        for record in records:
            collection.update_one(
                {'state': record['state'], 'district': record['district']},
                {'$set': record},
                upsert=True
            )
        
        print(f"Stored {len(records)} district records in MongoDB")
        client.close()
    except Exception as e:
        print(f"Error storing in MongoDB: {str(e)}")

def save_to_json(records: list, output_file: str = "district_data_aggregated.json"):
    """Save aggregated data to JSON file."""
    processed_dir = os.getenv('PROCESSED_DATA_DIR', './data/processed')
    os.makedirs(processed_dir, exist_ok=True)
    
    filepath = os.path.join(processed_dir, output_file)
    with open(filepath, 'w') as f:
        json.dump(records, f, indent=2)
    
    print(f"Saved aggregated data to {filepath}")

def main():
    """Main aggregation function."""
    print("Loading data files...")
    
    # Load data from JSON files
    soil_data = load_json_data('soil_data.json')
    weather_data = load_json_data('weather_data.json')
    crop_data = load_json_data('crop_yield_data.json')
    
    print(f"Loaded {len(soil_data)} soil records")
    print(f"Loaded {len(weather_data)} weather records")
    print(f"Loaded {len(crop_data)} crop records")
    
    # Merge data
    print("Merging district data...")
    merged_records = merge_district_data(soil_data, weather_data, crop_data)
    
    print(f"Merged {len(merged_records)} district records")
    
    # Save to JSON
    save_to_json(merged_records)
    
    # Store in MongoDB
    print("Storing in MongoDB...")
    store_in_mongodb(merged_records)
    
    print("Aggregation complete!")

if __name__ == "__main__":
    main()


