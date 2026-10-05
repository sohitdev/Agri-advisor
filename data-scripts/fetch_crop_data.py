"""
Fetch crop production and yield data from government sources
Processes UPAg portal data or CSV files
"""
import pandas as pd
import numpy as np
from typing import Dict, List
import os
from dotenv import load_dotenv
import json
import requests

load_dotenv()

# UPAg portal API (if available) or use CSV downloads
# For now, we'll process CSV files

def load_crop_data_from_csv(csv_file: str) -> pd.DataFrame:
    """
    Load crop data from CSV file.
    
    Expected CSV format:
    state,district,crop,season,year,yield,area
    """
    if not os.path.exists(csv_file):
        print(f"CSV file not found: {csv_file}")
        print("Creating sample crop data...")
        return create_sample_crop_data()
    
    df = pd.read_csv(csv_file)
    return df

def create_sample_crop_data() -> pd.DataFrame:
    """Create sample crop yield data for testing."""
    states = ['Gujarat', 'Maharashtra', 'Punjab', 'Haryana', 'Rajasthan']
    districts = ['Ahmedabad', 'Surat', 'Pune', 'Ludhiana', 'Gurgaon', 'Jaipur']
    crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Soybean']
    seasons = ['Kharif', 'Rabi']
    years = [2018, 2019, 2020, 2021, 2022]
    
    data = []
    for state in states:
        for district in districts:
            for crop in crops:
                for season in seasons:
                    for year in years:
                        # Skip incompatible crop-season combinations
                        if crop == 'Rice' and season == 'Rabi':
                            continue
                        if crop == 'Wheat' and season == 'Kharif':
                            continue
                        
                        data.append({
                            'state': state,
                            'district': district,
                            'crop': crop,
                            'season': season,
                            'year': year,
                            'yield': np.random.uniform(2000, 5000),  # kg/hectare
                            'area': np.random.uniform(100, 1000)  # hectares
                        })
    
    return pd.DataFrame(data)

def aggregate_crop_yield_by_district(df: pd.DataFrame) -> Dict:
    """
    Aggregate crop yield data by district.
    
    Returns:
        Dictionary with district-wise crop yield history
    """
    results = {}
    
    for (state, district), group in df.groupby(['state', 'district']):
        key = f"{state}_{district}"
        crop_history = []
        
        for (crop, season), crop_group in group.groupby(['crop', 'season']):
            avg_yield = crop_group['yield'].mean()
            total_area = crop_group['area'].sum()
            years = crop_group['year'].tolist()
            
            crop_history.append({
                'crop': crop,
                'season': season,
                'years': years,
                'avgYield': float(avg_yield),
                'totalArea': float(total_area),
                'yieldRange': {
                    'min': float(crop_group['yield'].min()),
                    'max': float(crop_group['yield'].max())
                }
            })
        
        results[key] = {
            'state': state,
            'district': district,
            'cropHistory': crop_history
        }
    
    return results

def process_crop_data(csv_file: str = "crop_yield_data.csv"):
    """
    Process crop yield data from CSV and save aggregated results.
    """
    data_dir = os.getenv('RAW_DATA_DIR', './data/raw')
    os.makedirs(data_dir, exist_ok=True)
    
    print(f"Loading crop data from {csv_file}...")
    df = load_crop_data_from_csv(csv_file)
    
    print("Aggregating crop yield data by district...")
    aggregated = aggregate_crop_yield_by_district(df)
    
    # Convert to list format
    results = list(aggregated.values())
    
    # Save results
    output_file = os.path.join(data_dir, 'crop_yield_data.json')
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"Saved crop yield data to {output_file}")
    print(f"Processed {len(results)} districts")
    
    return results

def download_upag_data(state: str, district: str):
    """
    Download data from UPAg (Unified Portal for Agricultural Statistics) portal.
    This is a placeholder - actual implementation would require API access.
    """
    # UPAg portal URL structure (example)
    # upag_url = f"https://upag.gov.in/api/data?state={state}&district={district}"
    
    # For now, return None
    print("UPAg data download not implemented. Use CSV files instead.")
    return None

if __name__ == "__main__":
    print("Processing crop yield data...")
    process_crop_data()


