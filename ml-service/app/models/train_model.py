"""
Model Training Script for Agri-Advisor
Trains ML models for crop recommendation and yield prediction using prepared data.

Uses:
- crop_production.csv (1997-2023 historical data)
- soil.csv (micronutrient data by district)
- data_core.csv (environmental conditions per crop)
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error, r2_score
import pickle
import json
import os
import warnings
from typing import Dict, Tuple

warnings.filterwarnings('ignore')

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), 'data')
MODEL_DIR = os.path.join(SCRIPT_DIR, 'trained')

def load_prepared_data() -> Tuple[np.ndarray, np.ndarray, np.ndarray, Dict, Dict]:
    """Load prepared training data from data preparation pipeline."""
    print("Loading prepared training data...")
    
    X = np.load(os.path.join(DATA_DIR, 'X_features.npy'))
    y_crop = np.load(os.path.join(DATA_DIR, 'y_crop.npy'))
    y_yield = np.load(os.path.join(DATA_DIR, 'y_yield.npy'))
    
    with open(os.path.join(DATA_DIR, 'encoders.json'), 'r') as f:
        encoders = json.load(f)
    
    with open(os.path.join(DATA_DIR, 'crop_profiles.json'), 'r') as f:
        crop_profiles = json.load(f)
    
    print(f"  Features shape: {X.shape}")
    print(f"  Number of samples: {len(y_crop)}")
    print(f"  Number of crop classes: {len(encoders['crop_classes'])}")
    
    return X, y_crop, y_yield, encoders, crop_profiles

def train_crop_classifier(X_train, X_test, y_train, y_test, encoders: Dict) -> RandomForestClassifier:
    """
    Train a Random Forest classifier for crop recommendation.
    """
    print("\n" + "=" * 50)
    print("TRAINING CROP CLASSIFIER")
    print("=" * 50)
    
    # Initialize classifier with optimized parameters
    classifier = RandomForestClassifier(
        n_estimators=200,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )
    
    print("Training Random Forest Classifier...")
    classifier.fit(X_train, y_train)
    
    # Evaluate
    y_pred = classifier.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n📊 Crop Classifier Performance:")
    print(f"  Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    
    # Cross-validation
    cv_scores = cross_val_score(classifier, X_train, y_train, cv=5)
    print(f"  Cross-validation scores: {cv_scores.mean():.4f} (+/- {cv_scores.std()*2:.4f})")
    
    # Feature importance
    feature_cols = encoders['feature_columns']
    importances = classifier.feature_importances_
    feature_importance = sorted(zip(feature_cols, importances), key=lambda x: x[1], reverse=True)
    
    print(f"\n📈 Top 10 Important Features:")
    for feat, imp in feature_importance[:10]:
        print(f"    {feat}: {imp:.4f}")
    
    return classifier

def train_yield_predictor(X_train, X_test, y_train, y_test) -> GradientBoostingRegressor:
    """
    Train a Gradient Boosting regressor for yield prediction.
    """
    print("\n" + "=" * 50)
    print("TRAINING YIELD PREDICTOR")
    print("=" * 50)
    
    # Handle any remaining invalid values
    valid_mask_train = np.isfinite(y_train) & (y_train > 0)
    valid_mask_test = np.isfinite(y_test) & (y_test > 0)
    
    X_train_valid = X_train[valid_mask_train]
    y_train_valid = y_train[valid_mask_train]
    X_test_valid = X_test[valid_mask_test]
    y_test_valid = y_test[valid_mask_test]
    
    # Log transform yield for better prediction
    y_train_log = np.log1p(y_train_valid)
    y_test_log = np.log1p(y_test_valid)
    
    # Initialize regressor with optimized parameters
    regressor = GradientBoostingRegressor(
        n_estimators=150,
        max_depth=10,
        learning_rate=0.1,
        min_samples_split=5,
        min_samples_leaf=3,
        random_state=42
    )
    
    print("Training Gradient Boosting Regressor...")
    regressor.fit(X_train_valid, y_train_log)
    
    # Evaluate
    y_pred_log = regressor.predict(X_test_valid)
    y_pred = np.expm1(y_pred_log)  # Reverse log transform
    y_test_original = y_test_valid
    
    mse = mean_squared_error(y_test_original, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test_original, y_pred)
    
    print(f"\n📊 Yield Predictor Performance:")
    print(f"  R² Score: {r2:.4f}")
    print(f"  RMSE: {rmse:.2f}")
    print(f"  Mean Yield: {y_test_original.mean():.2f}")
    
    return regressor

def create_district_yield_profiles(df: pd.DataFrame) -> Dict:
    """
    Create district-level yield statistics for more accurate predictions.
    """
    print("\n" + "=" * 50)
    print("CREATING DISTRICT YIELD PROFILES")
    print("=" * 50)
    
    district_profiles = {}
    
    for (state, district), group in df.groupby(['state_name', 'district_name']):
        key = f"{state}_{district}"
        crops = {}
        
        for crop, crop_group in group.groupby('crop'):
            crops[crop] = {
                'avg_yield': float(crop_group['avg_yield'].mean()),
                'min_yield': float(crop_group['min_yield'].min()) if 'min_yield' in crop_group.columns else float(crop_group['avg_yield'].min()),
                'max_yield': float(crop_group['max_yield'].max()) if 'max_yield' in crop_group.columns else float(crop_group['avg_yield'].max()),
                'std_yield': float(crop_group['avg_yield'].std()) if len(crop_group) > 1 else 0,
                'seasons': crop_group['season'].unique().tolist(),
                'num_records': int(crop_group['num_records'].sum()) if 'num_records' in crop_group.columns else len(crop_group),
                'total_area': float(crop_group['total_area'].sum()) if 'total_area' in crop_group.columns else 0
            }
        
        district_profiles[key] = {
            'state': state,
            'district': district,
            'crops': crops
        }
    
    print(f"  Created profiles for {len(district_profiles)} districts")
    
    return district_profiles

def save_models(
    classifier: RandomForestClassifier,
    regressor: GradientBoostingRegressor,
    scaler: StandardScaler,
    encoders: Dict,
    crop_profiles: Dict,
    district_profiles: Dict
):
    """Save all trained models and metadata."""
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # Save classifier
    with open(os.path.join(MODEL_DIR, 'crop_classifier.pkl'), 'wb') as f:
        pickle.dump(classifier, f)
    
    # Save regressor
    with open(os.path.join(MODEL_DIR, 'yield_regressor.pkl'), 'wb') as f:
        pickle.dump(regressor, f)
    
    # Save scaler
    with open(os.path.join(MODEL_DIR, 'scaler.pkl'), 'wb') as f:
        pickle.dump(scaler, f)
    
    # Save encoders
    with open(os.path.join(MODEL_DIR, 'encoders.json'), 'w') as f:
        json.dump(encoders, f, indent=2)
    
    # Save crop profiles
    with open(os.path.join(MODEL_DIR, 'crop_profiles.json'), 'w') as f:
        json.dump(crop_profiles, f, indent=2)
    
    # Save district profiles
    with open(os.path.join(MODEL_DIR, 'district_profiles.json'), 'w') as f:
        json.dump(district_profiles, f, indent=2)
    
    print(f"\n✅ Models saved to {MODEL_DIR}")
    print(f"  - crop_classifier.pkl")
    print(f"  - yield_regressor.pkl")
    print(f"  - scaler.pkl")
    print(f"  - encoders.json")
    print(f"  - crop_profiles.json")
    print(f"  - district_profiles.json")

def main():
    """Main training pipeline."""
    print("=" * 60)
    print("AGRI-ADVISOR MODEL TRAINING PIPELINE")
    print("=" * 60)
    
    # Load prepared data
    X, y_crop, y_yield, encoders, crop_profiles = load_prepared_data()
    
    # Load training dataframe for district profiles
    df = pd.read_csv(os.path.join(DATA_DIR, 'training_data.csv'))
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Split data
    X_train, X_test, y_crop_train, y_crop_test, y_yield_train, y_yield_test = train_test_split(
        X_scaled, y_crop, y_yield,
        test_size=0.2,
        random_state=42
    )
    
    print(f"\nTrain set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")
    
    # Train models
    classifier = train_crop_classifier(X_train, X_test, y_crop_train, y_crop_test, encoders)
    regressor = train_yield_predictor(X_train, X_test, y_yield_train, y_yield_test)
    
    # Create district profiles
    district_profiles = create_district_yield_profiles(df)
    
    # Save everything
    save_models(classifier, regressor, scaler, encoders, crop_profiles, district_profiles)
    
    print("\n" + "=" * 60)
    print("🎉 MODEL TRAINING COMPLETE!")
    print("=" * 60)

if __name__ == "__main__":
    main()
