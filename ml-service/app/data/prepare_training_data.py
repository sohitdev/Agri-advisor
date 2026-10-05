"""
Data Preparation Script for Agri-Advisor ML Model
Merges crop production data (1997-2023), soil data, and environmental data
to create a comprehensive training dataset.
"""
import pandas as pd
import numpy as np
import os
import warnings
from typing import Tuple, Dict
import json

warnings.filterwarnings('ignore')

# Paths
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
DATA_DIR = os.path.dirname(os.path.abspath(__file__))

def load_crop_production_data(filepath: str = None) -> pd.DataFrame:
    """
    Load and clean crop production data (1997-2023).
    Fields: State_Name, District_Name, Crop_Year, Season, Crop, Area, Production
    """
    if filepath is None:
        filepath = os.path.join(ROOT_DIR, 'crop_production.csv')
    
    print(f"Loading crop production data from {filepath}...")
    df = pd.read_csv(filepath)
    
    # Clean column names
    df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')
    
    # Clean string columns
    for col in ['state_name', 'district_name', 'season', 'crop']:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().str.upper()
    
    # Remove rows with missing critical data
    df = df.dropna(subset=['area', 'production'])
    
    # Calculate yield (production per unit area)
    df['yield'] = np.where(df['area'] > 0, df['production'] / df['area'], 0)
    
    # Remove outliers (yield > 99th percentile within each crop)
    def remove_outliers(group):
        q99 = group['yield'].quantile(0.99)
        return group[group['yield'] <= q99]
    
    df = df.groupby('crop', group_keys=False).apply(remove_outliers)
    
    print(f"  Loaded {len(df)} records")
    print(f"  Years: {df['crop_year'].min()} - {df['crop_year'].max()}")
    print(f"  Unique crops: {df['crop'].nunique()}")
    print(f"  Unique states: {df['state_name'].nunique()}")
    
    return df

def load_soil_micronutrients_data(filepath: str = None) -> pd.DataFrame:
    """
    Load soil micronutrients data.
    Fields: District, Zn%, Fe%, Cu%, Mn%, B%, S%
    """
    if filepath is None:
        filepath = os.path.join(ROOT_DIR, 'soil.csv')
    
    print(f"Loading soil micronutrients data from {filepath}...")
    df = pd.read_csv(filepath)
    
    # Clean column names
    df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_').str.replace('%', '')
    
    # Rename district column
    if 'district' in df.columns:
        df['district_name'] = df['district'].str.strip().str.upper()
        df = df.drop(columns=['district'])
    
    # Fill missing values with median
    numeric_cols = ['zn', 'fe', 'cu', 'mn', 'b', 's']
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            df[col] = df[col].fillna(df[col].median())
    
    print(f"  Loaded {len(df)} districts")
    
    return df

def load_environmental_data(filepath: str = None) -> pd.DataFrame:
    """
    Load environmental/soil data with crop-specific conditions.
    Fields: Temperature, Humidity, Moisture, Soil Type, Crop Type, 
            Nitrogen, Potassium, Phosphorous, Fertilizer Name
    """
    if filepath is None:
        filepath = os.path.join(ROOT_DIR, 'data_core.csv')
    
    print(f"Loading environmental data from {filepath}...")
    df = pd.read_csv(filepath)
    
    # Clean column names
    df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')
    
    # Standardize crop names
    if 'crop_type' in df.columns:
        df['crop_type'] = df['crop_type'].str.strip().str.upper()
    
    # Standardize soil type
    if 'soil_type' in df.columns:
        df['soil_type'] = df['soil_type'].str.strip().str.upper()
    
    print(f"  Loaded {len(df)} records")
    print(f"  Unique crops: {df['crop_type'].nunique()}")
    print(f"  Soil types: {df['soil_type'].unique().tolist()}")
    
    return df

def create_crop_environmental_profiles(env_df: pd.DataFrame) -> Dict:
    """
    Create environmental profiles for each crop based on data_core.csv.
    Returns average conditions suitable for each crop.
    """
    profiles = {}
    
    for crop in env_df['crop_type'].unique():
        crop_data = env_df[env_df['crop_type'] == crop]
        
        profiles[crop] = {
            'avg_temperature': crop_data['temparature'].mean(),
            'temp_range': (crop_data['temparature'].min(), crop_data['temparature'].max()),
            'avg_humidity': crop_data['humidity'].mean(),
            'humidity_range': (crop_data['humidity'].min(), crop_data['humidity'].max()),
            'avg_moisture': crop_data['moisture'].mean(),
            'avg_nitrogen': crop_data['nitrogen'].mean(),
            'avg_potassium': crop_data['potassium'].mean(),
            'avg_phosphorus': crop_data['phosphorous'].mean(),
            'suitable_soil_types': crop_data['soil_type'].value_counts().head(3).index.tolist(),
            'recommended_fertilizers': crop_data['fertilizer_name'].value_counts().head(3).index.tolist()
        }
    
    return profiles

def map_crop_names(crop_production_df: pd.DataFrame, env_df: pd.DataFrame) -> pd.DataFrame:
    """
    Map crop names between crop_production and data_core datasets.
    """
    # Create mapping dictionary for similar crop names
    crop_mapping = {
        'RICE': 'PADDY',
        'GROUNDNUT': 'GROUND NUTS',
        'MAIZE': 'MAIZE',
        'WHEAT': 'WHEAT',
        'COTTON(LINT)': 'COTTON',
        'COTTON': 'COTTON',
        'SUGARCANE': 'SUGARCANE',
        'BAJRA': 'MILLETS',
        'JOWAR': 'MILLETS',
        'RAGI': 'MILLETS',
        'BARLEY': 'BARLEY',
        'TOBACCO': 'TOBACCO',
        'SESAMUM': 'OIL SEEDS',
        'RAPESEED &MUSTARD': 'OIL SEEDS',
        'SUNFLOWER': 'OIL SEEDS',
        'CASTOR SEED': 'OIL SEEDS',
        'LINSEED': 'OIL SEEDS',
        'SAFFLOWER': 'OIL SEEDS',
        'SOYABEAN': 'OIL SEEDS',
        'NIGER SEED': 'OIL SEEDS',
        'GRAM': 'PULSES',
        'TUR': 'PULSES',
        'URAD': 'PULSES',
        'MOONG': 'PULSES',
        'MASOOR': 'PULSES',
        'ARHAR/TUR': 'PULSES',
        'OTHER KHARIF PULSES': 'PULSES',
        'OTHER RABI PULSES': 'PULSES',
    }
    
    # Apply mapping
    crop_production_df['crop_mapped'] = crop_production_df['crop'].map(
        lambda x: crop_mapping.get(x, x)
    )
    
    # Get list of crops in environmental data
    env_crops = set(env_df['crop_type'].unique())
    
    # Filter to only crops we have environmental data for
    crop_production_df['has_env_data'] = crop_production_df['crop_mapped'].isin(env_crops)
    
    return crop_production_df

def aggregate_crop_statistics(df: pd.DataFrame) -> pd.DataFrame:
    """
    Aggregate crop statistics by state, district, crop, and season.
    """
    # Group by location, crop, and season
    agg_df = df.groupby(['state_name', 'district_name', 'crop', 'season']).agg({
        'yield': ['mean', 'std', 'min', 'max', 'count'],
        'area': ['mean', 'sum'],
        'production': ['mean', 'sum'],
        'crop_year': ['min', 'max']
    }).reset_index()
    
    # Flatten column names
    agg_df.columns = ['_'.join(col).strip('_') for col in agg_df.columns]
    
    # Rename columns
    agg_df = agg_df.rename(columns={
        'yield_mean': 'avg_yield',
        'yield_std': 'yield_std',
        'yield_min': 'min_yield',
        'yield_max': 'max_yield',
        'yield_count': 'num_records',
        'area_mean': 'avg_area',
        'area_sum': 'total_area',
        'production_mean': 'avg_production',
        'production_sum': 'total_production',
        'crop_year_min': 'first_year',
        'crop_year_max': 'last_year'
    })
    
    return agg_df

def create_training_dataset(
    crop_df: pd.DataFrame,
    soil_df: pd.DataFrame,
    env_df: pd.DataFrame
) -> Tuple[pd.DataFrame, Dict]:
    """
    Create the final training dataset by merging all data sources.
    """
    print("\nCreating training dataset...")
    
    # Create crop environmental profiles
    crop_profiles = create_crop_environmental_profiles(env_df)
    
    # Map crop names
    crop_df = map_crop_names(crop_df, env_df)
    
    # Aggregate crop statistics
    agg_df = aggregate_crop_statistics(crop_df)
    
    # Merge with soil data
    merged_df = agg_df.merge(
        soil_df,
        on='district_name',
        how='left'
    )
    
    # Add environmental data based on crop mapping
    def add_env_features(row):
        crop_mapped = row.get('crop', '')
        
        # Try to find matching crop in profiles
        for crop_name, profile in crop_profiles.items():
            if crop_name in crop_mapped or crop_mapped in crop_name:
                return pd.Series({
                    'opt_temperature': profile['avg_temperature'],
                    'opt_humidity': profile['avg_humidity'],
                    'opt_moisture': profile['avg_moisture'],
                    'opt_nitrogen': profile['avg_nitrogen'],
                    'opt_potassium': profile['avg_potassium'],
                    'opt_phosphorus': profile['avg_phosphorus']
                })
        
        # Default values if no match
        return pd.Series({
            'opt_temperature': 28.0,
            'opt_humidity': 55.0,
            'opt_moisture': 45.0,
            'opt_nitrogen': 20.0,
            'opt_potassium': 10.0,
            'opt_phosphorus': 20.0
        })
    
    env_features = merged_df.apply(add_env_features, axis=1)
    merged_df = pd.concat([merged_df, env_features], axis=1)
    
    # Fill missing soil values with median
    soil_cols = ['zn', 'fe', 'cu', 'mn', 'b', 's']
    for col in soil_cols:
        if col in merged_df.columns:
            merged_df[col] = merged_df[col].fillna(merged_df[col].median())
    
    # Encode season
    season_mapping = {
        'KHARIF': 0,
        'RABI': 1,
        'WHOLE YEAR': 2,
        'SUMMER': 3,
        'WINTER': 4,
        'AUTUMN': 5
    }
    merged_df['season_encoded'] = merged_df['season'].map(
        lambda x: season_mapping.get(x.strip(), 2)
    )
    
    print(f"  Training dataset shape: {merged_df.shape}")
    print(f"  Columns: {merged_df.columns.tolist()}")
    
    return merged_df, crop_profiles

def prepare_features_and_labels(df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray, np.ndarray, Dict]:
    """
    Prepare feature matrix and labels for model training.
    """
    from sklearn.preprocessing import LabelEncoder
    
    # Feature columns for training
    feature_cols = [
        'season_encoded',
        'zn', 'fe', 'cu', 'mn', 'b', 's',  # Soil micronutrients
        'opt_temperature', 'opt_humidity', 'opt_moisture',
        'opt_nitrogen', 'opt_potassium', 'opt_phosphorus'
    ]
    
    # Ensure all feature columns exist
    for col in feature_cols:
        if col not in df.columns:
            df[col] = 0.0
    
    # Fill any remaining NaN values
    df[feature_cols] = df[feature_cols].fillna(df[feature_cols].median())
    
    # Encode state and district
    le_state = LabelEncoder()
    le_district = LabelEncoder()
    le_crop = LabelEncoder()
    
    df['state_encoded'] = le_state.fit_transform(df['state_name'].astype(str))
    df['district_encoded'] = le_district.fit_transform(df['district_name'].astype(str))
    df['crop_encoded'] = le_crop.fit_transform(df['crop'].astype(str))
    
    # Add encoded columns to features
    feature_cols.extend(['state_encoded', 'district_encoded'])
    
    # Create feature matrix
    X = df[feature_cols].values
    
    # Labels
    y_crop = df['crop_encoded'].values
    y_yield = df['avg_yield'].values
    
    # Handle infinite or very large yield values
    y_yield = np.clip(y_yield, 0, np.percentile(y_yield, 99))
    
    # Encoders dictionary
    encoders = {
        'state_encoder': le_state,
        'district_encoder': le_district,
        'crop_encoder': le_crop,
        'feature_columns': feature_cols
    }
    
    print(f"\nFeature matrix shape: {X.shape}")
    print(f"Number of unique crops: {len(le_crop.classes_)}")
    print(f"Crops: {le_crop.classes_[:20].tolist()}...")
    
    return X, y_crop, y_yield, encoders

def save_processed_data(
    df: pd.DataFrame,
    X: np.ndarray,
    y_crop: np.ndarray,
    y_yield: np.ndarray,
    encoders: Dict,
    crop_profiles: Dict,
    output_dir: str = None
):
    """
    Save all processed data for model training.
    """
    if output_dir is None:
        output_dir = DATA_DIR
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Save training data
    df.to_csv(os.path.join(output_dir, 'training_data.csv'), index=False)
    
    # Save numpy arrays
    np.save(os.path.join(output_dir, 'X_features.npy'), X)
    np.save(os.path.join(output_dir, 'y_crop.npy'), y_crop)
    np.save(os.path.join(output_dir, 'y_yield.npy'), y_yield)
    
    # Save encoders (need to save class labels separately for JSON)
    encoder_info = {
        'state_classes': encoders['state_encoder'].classes_.tolist(),
        'district_classes': encoders['district_encoder'].classes_.tolist(),
        'crop_classes': encoders['crop_encoder'].classes_.tolist(),
        'feature_columns': encoders['feature_columns']
    }
    
    with open(os.path.join(output_dir, 'encoders.json'), 'w') as f:
        json.dump(encoder_info, f, indent=2)
    
    # Save crop profiles
    # Convert numpy types to Python types for JSON serialization
    def convert_to_serializable(obj):
        if isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, tuple):
            return list(obj)
        elif isinstance(obj, dict):
            return {k: convert_to_serializable(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_to_serializable(i) for i in obj]
        return obj
    
    crop_profiles_serializable = convert_to_serializable(crop_profiles)
    
    with open(os.path.join(output_dir, 'crop_profiles.json'), 'w') as f:
        json.dump(crop_profiles_serializable, f, indent=2)
    
    print(f"\n✅ Data saved to {output_dir}")
    print(f"  - training_data.csv")
    print(f"  - X_features.npy")
    print(f"  - y_crop.npy")
    print(f"  - y_yield.npy")
    print(f"  - encoders.json")
    print(f"  - crop_profiles.json")

def main():
    """Main data preparation pipeline."""
    print("=" * 60)
    print("AGRI-ADVISOR DATA PREPARATION PIPELINE")
    print("=" * 60)
    
    # Load all data sources
    crop_df = load_crop_production_data()
    soil_df = load_soil_micronutrients_data()
    env_df = load_environmental_data()
    
    # Create training dataset
    merged_df, crop_profiles = create_training_dataset(crop_df, soil_df, env_df)
    
    # Prepare features and labels
    X, y_crop, y_yield, encoders = prepare_features_and_labels(merged_df)
    
    # Save processed data
    save_processed_data(merged_df, X, y_crop, y_yield, encoders, crop_profiles)
    
    print("\n" + "=" * 60)
    print("DATA PREPARATION COMPLETE!")
    print("=" * 60)
    
    return merged_df, X, y_crop, y_yield, encoders, crop_profiles

if __name__ == "__main__":
    main()
