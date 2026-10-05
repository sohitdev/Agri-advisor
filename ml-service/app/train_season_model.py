"""
Season-Specific Crop Recommendation Model v3
- Filters crops by season (only recommends crops grown in that season)
- Considers temperature ranges for each crop
- Location-specific historical data
"""
import os
import json
import pickle
import sys
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report
from collections import defaultdict

try:
    from xgboost import XGBClassifier
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False
    from sklearn.ensemble import GradientBoostingClassifier

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Paths
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, '..')
MODEL_DIR = os.path.join(ROOT_DIR, 'app', 'models', 'trained')

# Crop categories (same as before)
CROP_CATEGORIES = {
    'CEREALS_WHEAT': ['WHEAT'],
    'CEREALS_RICE': ['RICE', 'PADDY'],
    'CEREALS_MAIZE': ['MAIZE'],
    'CEREALS_BARLEY': ['BARLEY'],
    'CEREALS_MILLETS': ['BAJRA', 'JOWAR', 'RAGI', 'SMALL MILLETS', 'KORRA', 'SAMAI', 'VARAGU'],
    'PULSES': ['MOONG', 'URAD', 'ARHAR/TUR', 'GRAM', 'MASOOR', 'LENTIL', 'HORSE-GRAM', 
               'KULTHI', 'MOTH', 'KHESARI', 'OTHER KHARIF PULSES', 'OTHER RABI PULSES',
               'PEAS & BEANS', 'COWPEA', 'LATHYRUS', 'BEANS & MUTTER'],
    'OILSEEDS': ['GROUNDNUT', 'SOYABEAN', 'SUNFLOWER', 'RAPESEED', 'MUSTARD', 'SESAMUM',
                 'CASTOR SEED', 'LINSEED', 'NIGER SEED', 'SAFFLOWER', 'OILSEEDS TOTAL'],
    'SUGARCANE': ['SUGARCANE'],
    'COTTON': ['COTTON', 'COTTON(LINT)'],
    'JUTE': ['JUTE', 'JUTE & MESTA', 'MESTA', 'SANNHAMP'],
    'TOBACCO': ['TOBACCO'],
    'VEGETABLES': ['POTATO', 'ONION', 'TOMATO', 'BRINJAL', 'CABBAGE', 'CAULIFLOWER',
                   'BHINDI', 'CUCUMBER', 'PUMPKIN', 'BITTER GOURD', 'BOTTLE GOURD',
                   'SWEET POTATO', 'TAPIOCA', 'DRUM STICK', 'JACK FRUIT', 'ASH GOURD'],
    'FRUITS': ['BANANA', 'MANGO', 'GRAPES', 'APPLE', 'ORANGE', 'CITRUS FRUIT', 'PAPAYA',
               'PINEAPPLE', 'POMEGRANATE', 'SAPOTA', 'LITCHI', 'GUAVA', 'PLUMS', 'PEAR',
               'PEACH', 'BER', 'LEMON', 'MOSAMBI', 'WATER MELON', 'MUSK MELON', 'KIWI'],
    'SPICES': ['TURMERIC', 'GINGER', 'CHILLIES', 'DRY CHILLIES', 'BLACK PEPPER', 
               'CARDAMOM', 'CORIANDER', 'GARLIC', 'ARECANUT', 'BETELVINE'],
    'PLANTATION': ['TEA', 'COFFEE', 'RUBBER', 'COCONUT'],
    'FIBER': ['KAPAS', 'HEMP', 'SUN HEMP']
}

# Temperature ranges for crop categories (optimal growing conditions)
CROP_TEMP_RANGES = {
    'CEREALS_WHEAT': (10, 25),      # Cool weather crop
    'CEREALS_RICE': (20, 35),       # Warm and humid
    'CEREALS_MAIZE': (18, 32),      # Moderate to warm
    'CEREALS_BARLEY': (8, 22),      # Cool weather
    'CEREALS_MILLETS': (25, 40),    # Hot and dry tolerant
    'PULSES': (15, 30),             # Moderate
    'OILSEEDS': (20, 35),           # Warm
    'SUGARCANE': (20, 35),          # Tropical
    'COTTON': (21, 35),             # Warm
    'JUTE': (24, 37),               # Hot and humid
    'TOBACCO': (18, 28),            # Moderate
    'VEGETABLES': (15, 30),         # Varies, moderate
    'FRUITS': (15, 35),             # Varies by fruit
    'SPICES': (20, 35),             # Warm
    'PLANTATION': (20, 30),         # Tropical
    'FIBER': (25, 35)               # Warm
}

# Season-specific recommendations
SEASON_CROPS = {
    'KHARIF': ['CEREALS_RICE', 'CEREALS_MAIZE', 'CEREALS_MILLETS', 'PULSES', 'OILSEEDS', 
               'COTTON', 'JUTE', 'SUGARCANE', 'VEGETABLES', 'FRUITS'],
    'RABI': ['CEREALS_WHEAT', 'CEREALS_BARLEY', 'PULSES', 'OILSEEDS', 'VEGETABLES', 
             'SPICES', 'TOBACCO'],
    'SUMMER': ['CEREALS_MAIZE', 'PULSES', 'VEGETABLES', 'FRUITS', 'OILSEEDS'],
    'WINTER': ['CEREALS_WHEAT', 'CEREALS_BARLEY', 'VEGETABLES', 'SPICES', 'OILSEEDS'],
    'AUTUMN': ['CEREALS_RICE', 'PULSES', 'VEGETABLES', 'OILSEEDS'],
    'WHOLE YEAR': ['SUGARCANE', 'VEGETABLES', 'FRUITS', 'PLANTATION', 'SPICES']
}

def load_data():
    """Load crop production data."""
    print("Loading data...")
    crop_df = pd.read_csv(os.path.join(DATA_DIR, 'crop_production.csv'))
    crop_df.columns = crop_df.columns.str.strip().str.lower()
    
    # Clean season values
    crop_df['season'] = crop_df['season'].str.strip().str.upper()
    
    return crop_df

def create_season_crop_mapping(crop_df):
    """Create mapping of which crops are grown in which season per district."""
    print("\nCreating season-crop mapping from historical data...")
    
    # Map crops to categories
    crop_to_cat = {}
    for cat, crops in CROP_CATEGORIES.items():
        for crop in crops:
            crop_to_cat[crop.upper()] = cat
    
    crop_df['crop_upper'] = crop_df['crop'].str.upper().str.strip()
    crop_df['crop_category'] = crop_df['crop_upper'].map(crop_to_cat)
    crop_df = crop_df.dropna(subset=['crop_category'])
    
    # Create season-district-crop mapping
    season_district_crops = defaultdict(lambda: defaultdict(set))
    
    for _, row in crop_df.iterrows():
        season = row['season']
        state = row['state_name']
        district = row['district_name']
        category = row['crop_category']
        
        key = f"{state}_{district}".upper()
        season_district_crops[season][key].add(category)
    
    # Convert to regular dict with lists
    result = {}
    for season, districts in season_district_crops.items():
        result[season] = {k: list(v) for k, v in districts.items()}
    
    print(f"  Seasons covered: {list(result.keys())}")
    
    return result, crop_df

def create_crop_stats(crop_df):
    """Create statistics for each crop category per state-district-season."""
    print("\nCreating crop statistics...")
    
    # Calculate yield = production / area
    crop_df['yield'] = crop_df['production'] / crop_df['area'].replace(0, np.nan)
    crop_df['yield'] = crop_df['yield'].fillna(0)
    
    stats = crop_df.groupby(['state_name', 'district_name', 'season', 'crop_category']).agg({
        'production': 'mean',
        'area': 'mean',
        'yield': ['mean', 'std', 'count']
    }).reset_index()
    
    stats.columns = ['state', 'district', 'season', 'crop_category', 
                     'avg_production', 'avg_area', 'yield_mean', 'yield_std', 'record_count']
    
    return stats

def prepare_training_data(crop_df, crop_stats):
    """Prepare features for training."""
    print("\nPreparing training data...")
    
    # Load soil data
    soil_df = pd.read_csv(os.path.join(DATA_DIR, 'soil.csv'))
    soil_df.columns = soil_df.columns.str.strip().str.lower().str.replace('%', '').str.replace(' ', '')
    soil_df = soil_df.rename(columns={'district': 'district_name'})
    soil_df['district_name'] = soil_df['district_name'].str.strip().str.upper()
    soil_df = soil_df.drop_duplicates(subset=['district_name'], keep='first')
    
    # Load environmental data
    env_df = pd.read_csv(os.path.join(DATA_DIR, 'data_core.csv'))
    env_df.columns = env_df.columns.str.strip().str.lower()
    
    # Get average environmental conditions
    env_means = {
        'temp_mean': env_df['temparature'].mean() if 'temparature' in env_df.columns else 28,
        'humidity_mean': env_df['humidity'].mean() if 'humidity' in env_df.columns else 60,
        'nitrogen_mean': env_df['nitrogen'].mean() if 'nitrogen' in env_df.columns else 100,
        'potassium_mean': env_df['potassium'].mean() if 'potassium' in env_df.columns else 150,
        'phosphorus_mean': env_df['phosphorous'].mean() if 'phosphorous' in env_df.columns else 25
    }
    
    # Merge with soil data
    crop_stats['district_upper'] = crop_stats['district'].str.upper()
    merged = crop_stats.merge(soil_df, left_on='district_upper', right_on='district_name', how='left')
    
    # Fill missing soil values
    for col in ['zn', 'fe', 'cu', 'mn', 'b', 's']:
        if col in merged.columns:
            merged[col] = merged[col].fillna(merged[col].median())
        else:
            merged[col] = 60  # default
    
    # Encode categorical features
    le_state = LabelEncoder()
    le_district = LabelEncoder()
    le_season = LabelEncoder()
    le_crop = LabelEncoder()
    
    merged['state_enc'] = le_state.fit_transform(merged['state'])
    merged['district_enc'] = le_district.fit_transform(merged['district'])
    merged['season_enc'] = le_season.fit_transform(merged['season'])
    merged['crop_enc'] = le_crop.fit_transform(merged['crop_category'])
    
    # Add environmental features
    merged['temp_mean'] = env_means['temp_mean']
    merged['humidity_mean'] = env_means['humidity_mean']
    merged['nitrogen_mean'] = env_means['nitrogen_mean']
    merged['potassium_mean'] = env_means['potassium_mean']
    merged['phosphorus_mean'] = env_means['phosphorus_mean']
    
    # Feature columns
    feature_cols = [
        'state_enc', 'district_enc', 'season_enc',
        'zn', 'fe', 'cu', 'mn', 'b', 's',
        'yield_mean', 'avg_area',
        'temp_mean', 'humidity_mean', 'nitrogen_mean', 'potassium_mean', 'phosphorus_mean'
    ]
    
    # Handle missing values
    for col in feature_cols:
        if col in merged.columns:
            merged[col] = merged[col].fillna(merged[col].median())
    
    X = merged[feature_cols].values
    y = merged['crop_enc'].values
    
    encoders = {
        'state_encoder': le_state,
        'district_encoder': le_district,
        'season_encoder': le_season,
        'crop_encoder': le_crop,
        'feature_columns': feature_cols,
        'crop_classes': le_crop.classes_.tolist()
    }
    
    print(f"  Training samples: {len(X)}")
    print(f"  Crop categories: {len(le_crop.classes_)}")
    print(f"  Seasons: {le_season.classes_.tolist()}")
    
    return X, y, merged, encoders

def train_model(X, y, encoders):
    """Train the crop classifier."""
    print("\n" + "="*60)
    print("TRAINING SEASON-AWARE MODEL v3")
    print("="*60)
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )
    
    if HAS_XGBOOST:
        print("\nUsing XGBoost...")
        classifier = XGBClassifier(
            n_estimators=300,
            max_depth=10,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            n_jobs=-1,
            use_label_encoder=False,
            eval_metric='mlogloss'
        )
    else:
        print("\nUsing Gradient Boosting...")
        classifier = GradientBoostingClassifier(
            n_estimators=300,
            max_depth=10,
            learning_rate=0.1,
            random_state=42
        )
    
    print("Training...")
    classifier.fit(X_train, y_train)
    
    # Evaluate
    y_pred = classifier.predict(X_test)
    y_proba = classifier.predict_proba(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    top3_acc = np.mean([y_test[i] in np.argsort(y_proba[i])[-3:] for i in range(len(y_test))])
    top5_acc = np.mean([y_test[i] in np.argsort(y_proba[i])[-5:] for i in range(len(y_test))])
    
    print(f"\n{'='*60}")
    print("MODEL PERFORMANCE")
    print('='*60)
    print(f"✅ Top-1 Accuracy: {accuracy*100:.2f}%")
    print(f"✅ Top-3 Accuracy: {top3_acc*100:.2f}%")
    print(f"✅ Top-5 Accuracy: {top5_acc*100:.2f}%")
    
    if os.getenv('RUN_SEASON_CV', '0') == '1':
        cv_scores = cross_val_score(classifier, X_scaled, y, cv=5)
        print(f"✅ Cross-validation: {cv_scores.mean()*100:.2f}% (+/- {cv_scores.std()*100:.2f}%)")
    else:
        print("Cross-validation skipped (set RUN_SEASON_CV=1 to enable).")
    
    return classifier, scaler, accuracy

def save_models(classifier, scaler, encoders, season_crop_map, crop_stats):
    """Save all model artifacts."""
    print("\nSaving models...")
    
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # Save classifier
    with open(os.path.join(MODEL_DIR, 'crop_classifier_v3.pkl'), 'wb') as f:
        pickle.dump(classifier, f)
    
    # Save scaler
    with open(os.path.join(MODEL_DIR, 'scaler_v3.pkl'), 'wb') as f:
        pickle.dump(scaler, f)
    
    # Save encoders
    encoder_data = {
        'state_classes': encoders['state_encoder'].classes_.tolist(),
        'district_classes': encoders['district_encoder'].classes_.tolist(),
        'season_classes': encoders['season_encoder'].classes_.tolist(),
        'crop_classes': encoders['crop_classes'],
        'feature_columns': encoders['feature_columns']
    }
    with open(os.path.join(MODEL_DIR, 'encoders_v3.json'), 'w') as f:
        json.dump(encoder_data, f, indent=2)
    
    # Save season-crop mapping
    with open(os.path.join(MODEL_DIR, 'season_crop_map_v3.json'), 'w') as f:
        json.dump(season_crop_map, f, indent=2)
    
    # Save crop temperature ranges
    with open(os.path.join(MODEL_DIR, 'crop_temp_ranges_v3.json'), 'w') as f:
        json.dump(CROP_TEMP_RANGES, f, indent=2)
    
    # Save season-specific crop lists
    with open(os.path.join(MODEL_DIR, 'season_crops_v3.json'), 'w') as f:
        json.dump(SEASON_CROPS, f, indent=2)
    
    # Create and save crop profiles per season
    crop_profiles = {}
    for _, row in crop_stats.iterrows():
        key = f"{row['state']}_{row['district']}_{row['season']}".upper()
        if key not in crop_profiles:
            crop_profiles[key] = {}
        crop_profiles[key][row['crop_category']] = {
            'yield_mean': float(row['yield_mean']) if pd.notna(row['yield_mean']) else 2000,
            'yield_std': float(row['yield_std']) if pd.notna(row['yield_std']) else 500,
            'avg_area': float(row['avg_area']) if pd.notna(row['avg_area']) else 1000,
            'record_count': int(row['record_count'])
        }
    
    with open(os.path.join(MODEL_DIR, 'crop_profiles_v3.json'), 'w') as f:
        json.dump(crop_profiles, f)
    
    print(f"✅ Models saved to {MODEL_DIR}")

def main():
    print("="*60)
    print("SEASON-SPECIFIC CROP MODEL TRAINING v3")
    print("="*60)
    
    # Load data
    crop_df = load_data()
    
    # Create season-crop mapping
    season_crop_map, crop_df = create_season_crop_mapping(crop_df)
    
    # Create crop statistics
    crop_stats = create_crop_stats(crop_df)
    
    # Prepare training data
    X, y, merged, encoders = prepare_training_data(crop_df, crop_stats)
    
    # Train model
    classifier, scaler, accuracy = train_model(X, y, encoders)
    
    # Save everything
    save_models(classifier, scaler, encoders, season_crop_map, crop_stats)
    
    print("\n" + "="*60)
    if accuracy >= 0.85:
        print("🎉 SUCCESS! Season-specific model trained!")
    else:
        print("✅ Model trained. Consider more data for better accuracy.")
    print("="*60)

if __name__ == "__main__":
    main()
