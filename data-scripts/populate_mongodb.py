"""
Populate MongoDB with location and crop data from CSV files.
This script uses the crop_production.csv, soil.csv, and data_core.csv
to create Location and Crop documents in MongoDB.
"""
import os
import pandas as pd
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://harshagarwal0412003:harshagarwal0412003@cluster0.ufibm.mongodb.net/?appName=Cluster0')

# Data paths - CSV files are in root project directory
ROOT_DIR = os.path.join(os.path.dirname(__file__), '..')
ML_DATA_DIR = os.path.join(ROOT_DIR, 'ml-service', 'app', 'data')

def load_data():
    """Load all CSV data files."""
    print("Loading CSV data...")
    
    # Crop production data (in root directory)
    crop_df = pd.read_csv(os.path.join(ROOT_DIR, 'crop_production.csv'))
    crop_df.columns = crop_df.columns.str.strip().str.lower()
    
    # Soil data (in root directory)
    soil_df = pd.read_csv(os.path.join(ROOT_DIR, 'soil.csv'))
    soil_df.columns = soil_df.columns.str.strip().str.lower().str.replace('%', '').str.replace(' ', '')
    
    # Environmental data (in root directory)
    env_df = pd.read_csv(os.path.join(ROOT_DIR, 'data_core.csv'))
    env_df.columns = env_df.columns.str.strip().str.lower()
    
    print(f"  Crop data: {len(crop_df)} records")
    print(f"  Soil data: {len(soil_df)} records")
    print(f"  Environmental data: {len(env_df)} records")
    
    return crop_df, soil_df, env_df

def create_location_documents(crop_df, soil_df, env_df):
    """Create Location documents from the data."""
    print("\nCreating Location documents...")
    
    locations = []
    
    # Get unique state-district combinations
    districts = crop_df.groupby(['state_name', 'district_name']).size().reset_index()
    
    # Soil lookup by district (handle duplicates by taking first)
    soil_df['district'] = soil_df['district'].str.strip().str.upper()
    soil_df_unique = soil_df.drop_duplicates(subset=['district'], keep='first')
    soil_lookup = soil_df_unique.set_index('district').to_dict('index')
    
    # Environmental defaults from data_core (these are general values, not state-specific)
    env_df.columns = env_df.columns.str.lower()
    default_env = {
        'temperature_mean': float(env_df['temparature'].mean()) if 'temparature' in env_df.columns else 28,
        'humidity_mean': float(env_df['humidity'].mean()) if 'humidity' in env_df.columns else 60,
        'nitrogen_mean': float(env_df['nitrogen'].mean()) if 'nitrogen' in env_df.columns else 100,
        'potassium_mean': float(env_df['potassium'].mean()) if 'potassium' in env_df.columns else 150,
        'phosphorous_mean': float(env_df['phosphorous'].mean()) if 'phosphorous' in env_df.columns else 25
    }
    
    for _, row in districts.iterrows():
        state = row['state_name']
        district = row['district_name']
        
        # Get soil data
        district_upper = district.upper()
        soil_data = soil_lookup.get(district_upper, {})
        
        # Use default environmental data
        env_data = default_env
        
        # Get crop history for this district
        district_crops = crop_df[
            (crop_df['state_name'] == state) & 
            (crop_df['district_name'] == district)
        ]
        
        # Aggregate crop data
        crop_history = []
        for crop_name in district_crops['crop'].unique():
            crop_data = district_crops[district_crops['crop'] == crop_name]
            crop_history.append({
                'cropName': crop_name,
                'avgYield': float(crop_data['yield'].mean()) if 'yield' in crop_data.columns else 0,
                'avgArea': float(crop_data['area'].mean()) if 'area' in crop_data.columns else 0,
                'seasons': crop_data['season'].unique().tolist() if 'season' in crop_data.columns else [],
                'yearsOfData': len(crop_data)
            })
        
        location = {
            'state': state,
            'district': district,
            'soilData': {
                'ph': {'mean': 6.5},  # Default pH
                'organicCarbon': {'mean': 0.8},
                'nitrogen': {'mean': float(env_data.get('nitrogen_mean', 100))},
                'phosphorus': {'mean': float(env_data.get('phosphorous_mean', 25))},
                'potassium': {'mean': float(env_data.get('potassium_mean', 150))},
                'micronutrients': {
                    'zn': float(soil_data.get('zn', 60)),
                    'fe': float(soil_data.get('fe', 80)),
                    'cu': float(soil_data.get('cu', 85)),
                    'mn': float(soil_data.get('mn', 75)),
                    'b': float(soil_data.get('b', 60)),
                    's': float(soil_data.get('s', 70))
                }
            },
            'weatherData': {
                'avgTemperature': {'mean': float(env_data.get('temperature_mean', 28))},
                'avgHumidity': {'mean': float(env_data.get('humidity_mean', 60))},
                'avgRainfall': {'mean': 800}  # Default rainfall
            },
            'cropYieldHistory': crop_history[:20],  # Top 20 crops
            'lastUpdated': datetime.now().isoformat()
        }
        
        locations.append(location)
    
    print(f"  Created {len(locations)} location documents")
    return locations

def create_crop_documents(crop_df):
    """Create Crop documents from unique crops."""
    print("\nCreating Crop documents...")
    
    # Define crop categories
    CROP_CATEGORIES = {
        'CEREALS': ['RICE', 'WHEAT', 'MAIZE', 'BARLEY', 'BAJRA', 'JOWAR', 'RAGI', 'SMALL MILLETS'],
        'PULSES': ['MOONG', 'URAD', 'ARHAR/TUR', 'GRAM', 'MASOOR', 'LENTIL', 'HORSE-GRAM'],
        'OILSEEDS': ['GROUNDNUT', 'SOYABEAN', 'SUNFLOWER', 'MUSTARD', 'SESAMUM', 'CASTOR SEED'],
        'CASH CROPS': ['SUGARCANE', 'COTTON', 'JUTE', 'TOBACCO'],
        'VEGETABLES': ['POTATO', 'ONION', 'TOMATO', 'BRINJAL'],
        'FRUITS': ['BANANA', 'MANGO', 'GRAPES', 'APPLE', 'ORANGE'],
        'SPICES': ['TURMERIC', 'GINGER', 'CHILLIES', 'BLACK PEPPER', 'CARDAMOM']
    }
    
    # Reverse lookup
    crop_to_category = {}
    for category, crops in CROP_CATEGORIES.items():
        for crop in crops:
            crop_to_category[crop] = category
    
    crops = []
    unique_crops = crop_df['crop'].unique()
    
    for crop_name in unique_crops:
        crop_data = crop_df[crop_df['crop'] == crop_name]
        
        # Get seasons
        seasons = crop_data['season'].unique().tolist() if 'season' in crop_data.columns else ['Kharif']
        
        # Get category
        category = crop_to_category.get(crop_name.upper(), 'OTHER')
        
        crop_doc = {
            'name': crop_name,
            'category': category,
            'seasons': seasons,
            'avgYieldNational': float(crop_data['yield'].mean()) if 'yield' in crop_data.columns else 2000,
            'description': f'{crop_name} is a {category.lower()} crop grown in {", ".join(seasons)} season.',
            'createdAt': datetime.now().isoformat()
        }
        crops.append(crop_doc)
    
    print(f"  Created {len(crops)} crop documents")
    return crops

def store_in_mongodb(locations, crops):
    """Store documents in MongoDB."""
    print("\nConnecting to MongoDB...")
    
    try:
        client = MongoClient(MONGODB_URI)
        db = client['agri-advisor']  # Use explicit database name
        
        # Store locations
        print("Storing locations...")
        locations_collection = db.locations
        for loc in locations:
            locations_collection.update_one(
                {'state': loc['state'], 'district': loc['district']},
                {'$set': loc},
                upsert=True
            )
        print(f"  ✅ Stored {len(locations)} locations")
        
        # Store crops
        print("Storing crops...")
        crops_collection = db.crops
        for crop in crops:
            crops_collection.update_one(
                {'name': crop['name']},
                {'$set': crop},
                upsert=True
            )
        print(f"  ✅ Stored {len(crops)} crops")
        
        # Verify
        loc_count = locations_collection.count_documents({})
        crop_count = crops_collection.count_documents({})
        print(f"\n✅ MongoDB now has:")
        print(f"   - {loc_count} locations")
        print(f"   - {crop_count} crops")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        raise

def main():
    print("="*60)
    print("POPULATING MONGODB WITH AGRI-ADVISOR DATA")
    print("="*60)
    
    # Load data
    crop_df, soil_df, env_df = load_data()
    
    # Create documents
    locations = create_location_documents(crop_df, soil_df, env_df)
    crops = create_crop_documents(crop_df)
    
    # Store in MongoDB
    store_in_mongodb(locations, crops)
    
    print("\n" + "="*60)
    print("✅ DATABASE POPULATION COMPLETE!")
    print("="*60)

if __name__ == "__main__":
    main()
