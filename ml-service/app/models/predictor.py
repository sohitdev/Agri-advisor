"""
Crop Prediction Model for Agri-Advisor
Uses trained ML models for crop recommendations based on:
- Historical crop production data (1997-2023)
- Soil micronutrient data
- Real-time weather conditions via OpenWeatherMap API
- Season-specific filtering (v3)
- Temperature-based suitability scoring
"""
import numpy as np
import pickle
import json
import os
import csv
import sys
import requests
from typing import List, Dict, Optional
from functools import lru_cache
from collections import defaultdict

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

class CropPredictor:
    """
    ML-based crop recommendation predictor.
    Uses trained Random Forest classifier and Gradient Boosting yield predictor.
    V3: Season-specific filtering and temperature-aware scoring.
    """
    
    # Temperature ranges for crop categories (optimal growing conditions)
    CROP_TEMP_RANGES = {
        'CEREALS_WHEAT': (10, 25),
        'CEREALS_RICE': (20, 35),
        'CEREALS_MAIZE': (18, 32),
        'CEREALS_BARLEY': (8, 22),
        'CEREALS_MILLETS': (25, 40),
        'PULSES': (15, 30),
        'OILSEEDS': (20, 35),
        'SUGARCANE': (20, 35),
        'COTTON': (21, 35),
        'JUTE': (24, 37),
        'TOBACCO': (18, 28),
        'VEGETABLES': (15, 30),
        'FRUITS': (15, 35),
        'SPICES': (20, 35),
        'PLANTATION': (20, 30),
        'FIBER': (25, 35)
    }
    
    # Default season-crop mapping
    DEFAULT_SEASON_CROPS = {
        'KHARIF': ['CEREALS_RICE', 'CEREALS_MAIZE', 'CEREALS_MILLETS', 'PULSES', 'OILSEEDS', 
                   'COTTON', 'JUTE', 'SUGARCANE', 'VEGETABLES', 'FRUITS'],
        'RABI': ['CEREALS_WHEAT', 'CEREALS_BARLEY', 'PULSES', 'OILSEEDS', 'VEGETABLES', 
                 'SPICES', 'TOBACCO'],
        'SUMMER': ['CEREALS_MAIZE', 'CEREALS_MILLETS', 'PULSES', 'VEGETABLES', 'FRUITS', 'OILSEEDS'],
        'WINTER': ['CEREALS_WHEAT', 'CEREALS_BARLEY', 'VEGETABLES', 'SPICES', 'OILSEEDS', 'PULSES'],
        'AUTUMN': ['CEREALS_RICE', 'PULSES', 'VEGETABLES', 'OILSEEDS', 'CEREALS_MAIZE'],
        'WHOLE YEAR': ['SUGARCANE', 'VEGETABLES', 'FRUITS', 'PLANTATION', 'SPICES', 'FIBER']
    }

    # Preferred specific crop labels for each modeled category.
    CATEGORY_TO_SPECIFIC_CROPS = {
        'CEREALS_RICE': ['Rice'],
        'CEREALS_WHEAT': ['Wheat'],
        'CEREALS_MAIZE': ['Maize'],
        'CEREALS_BARLEY': ['Barley'],
        'CEREALS_MILLETS': ['Bajra', 'Jowar', 'Ragi', 'Small Millets'],
        'PULSES': ['Gram', 'Moong', 'Urad', 'Arhar/Tur'],
        'OILSEEDS': ['Mustard', 'Soybean', 'Groundnut', 'Sesamum'],
        'SUGARCANE': ['Sugarcane'],
        'COTTON': ['Cotton'],
        'JUTE': ['Jute'],
        'TOBACCO': ['Tobacco'],
        'VEGETABLES': ['Potato', 'Onion', 'Tomato', 'Brinjal'],
        'FRUITS': ['Banana', 'Mango', 'Citrus'],
        'SPICES': ['Chillies', 'Turmeric', 'Ginger', 'Coriander'],
        'PLANTATION': ['Coconut', 'Tea', 'Coffee'],
        'FIBER': ['Mesta', 'Sunhemp', 'Flax']
    }

    CATEGORY_KEYWORDS = {
        'CEREALS_RICE': ['RICE', 'PADDY'],
        'CEREALS_WHEAT': ['WHEAT'],
        'CEREALS_MAIZE': ['MAIZE'],
        'CEREALS_BARLEY': ['BARLEY'],
        'CEREALS_MILLETS': ['MILLET', 'BAJRA', 'JOWAR', 'RAGI', 'KORRA', 'SAMAI', 'VARAGU'],
        'PULSES': ['PULSE', 'GRAM', 'MOONG', 'URAD', 'ARHAR', 'LENTIL', 'PEA'],
        'OILSEEDS': ['OILSEED', 'MUSTARD', 'SOYABEAN', 'SOYBEAN', 'GROUNDNUT', 'SESAMUM', 'CASTOR'],
        'SUGARCANE': ['SUGARCANE'],
        'COTTON': ['COTTON'],
        'JUTE': ['JUTE'],
        'TOBACCO': ['TOBACCO'],
        'VEGETABLES': ['VEGETABLE', 'POTATO', 'ONION', 'TOMATO', 'BRINJAL'],
        'FRUITS': ['FRUIT', 'BANANA', 'MANGO', 'CITRUS', 'APPLE', 'ORANGE', 'GRAPES'],
        'SPICES': ['SPICE', 'CHILLI', 'TURMERIC', 'GINGER', 'CORIANDER', 'CARDAMOM'],
        'PLANTATION': ['PLANTATION', 'COCONUT', 'TEA', 'COFFEE'],
        'FIBER': ['FIBER', 'FIBRE', 'MESTA', 'SUNHEMP', 'FLAX']
    }

    # Minimum evidence for a crop to be recommended as "precise".
    MIN_HIST_RECORDS = 8
    MIN_HIST_YEARS = 3
    
    def __init__(self, model_dir: str = None):
        self.model_dir = model_dir or os.path.join(
            os.path.dirname(os.path.abspath(__file__)), 'trained'
        )
        
        # Weather API configuration
        self.weather_api_key = os.getenv('OPENWEATHER_API_KEY')
        self.weather_base_url = "https://api.openweathermap.org/data/2.5/weather"
        
        # Load models and data
        self._load_models()
        self._load_crop_database()
        self.location_crop_candidates = self._load_location_crop_candidates()

    def _safe_float(self, value, default=0.0) -> float:
        try:
            return float(value)
        except (TypeError, ValueError):
            return default

    def _safe_int(self, value, default=0) -> int:
        try:
            return int(float(value))
        except (TypeError, ValueError):
            return default

    def _normalize_text(self, value: str) -> str:
        return " ".join(str(value).strip().upper().split())

    def _format_crop_display_name(self, value: str) -> str:
        cleaned = " ".join(str(value).strip().replace('_', ' ').split())
        return cleaned.title()

    def _map_raw_crop_to_category(self, crop_name: str) -> Optional[str]:
        crop_text = self._normalize_text(crop_name)
        for category, keywords in self.CATEGORY_KEYWORDS.items():
            for keyword in keywords:
                if keyword in crop_text:
                    return category
        return None

    def _load_location_crop_candidates(self) -> Dict[str, Dict[str, List[str]]]:
        """
        Build district-season specific crop candidates from historical production data.
        Maps each (state, district, season, category) to ranked specific crops.
        """
        candidates = {}
        csv_path = os.path.abspath(
            os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'data/data/data/data/crop_production.csv')
        )

        if not os.path.exists(csv_path):
            return candidates

        ranked_scores = defaultdict(lambda: defaultdict(lambda: defaultdict(float)))
        support_stats = defaultdict(
            lambda: defaultdict(lambda: defaultdict(lambda: {'records': 0, 'years': set()}))
        )

        try:
            with open(csv_path, 'r', encoding='utf-8') as csv_file:
                reader = csv.DictReader(csv_file)
                for row in reader:
                    state = self._normalize_text(row.get('State_Name', ''))
                    district = self._normalize_text(row.get('District_Name', ''))
                    season = self._normalize_text(row.get('Season', ''))
                    crop_raw = row.get('Crop', '')

                    if not state or not district or not season or not crop_raw:
                        continue

                    category = self._map_raw_crop_to_category(crop_raw)
                    if not category:
                        continue

                    crop_display = self._format_crop_display_name(crop_raw)
                    production = self._safe_float(row.get('Production'), 0.0)
                    area = self._safe_float(row.get('Area'), 0.0)
                    crop_year = self._safe_int(row.get('Crop_Year'), 0)
                    weight = (production if production > 0 else 1.0) + (area * 0.1 if area > 0 else 0.0)

                    key_season = f"{state}_{district}_{season}"
                    key_any = f"{state}_{district}_ANY"
                    key_state_season = f"{state}__STATE__{season}"
                    key_state_any = f"{state}__STATE__ANY"

                    ranked_scores[key_season][category][crop_display] += weight
                    ranked_scores[key_any][category][crop_display] += weight
                    ranked_scores[key_state_season][category][crop_display] += weight
                    ranked_scores[key_state_any][category][crop_display] += weight

                    for support_key in [key_season, key_any, key_state_season, key_state_any]:
                        support_stats[support_key][category][crop_display]['records'] += 1
                        if crop_year > 0:
                            support_stats[support_key][category][crop_display]['years'].add(crop_year)

            for key, category_scores in ranked_scores.items():
                candidates[key] = {}
                for category, crop_scores in category_scores.items():
                    ordered = sorted(crop_scores.items(), key=lambda x: x[1], reverse=True)
                    strict_candidates = []
                    relaxed_candidates = []

                    for crop, _ in ordered:
                        stats = support_stats[key][category][crop]
                        record_count = stats['records']
                        year_count = len(stats['years'])

                        if record_count >= self.MIN_HIST_RECORDS and year_count >= self.MIN_HIST_YEARS:
                            strict_candidates.append(crop)
                        elif record_count >= 2 and year_count >= 1:
                            relaxed_candidates.append(crop)

                    # Prefer statistically stronger candidates; fallback to light-evidence candidates if needed.
                    if strict_candidates:
                        candidates[key][category] = strict_candidates
                    else:
                        candidates[key][category] = relaxed_candidates

        except Exception as e:
            print(f"Warning: unable to load district crop candidates: {e}")
            return {}

        return candidates

    def _select_specific_crop(
        self,
        category: str,
        state: str,
        district: str,
        season: str,
        used_names: set,
        strict_data_mode: bool = True
    ) -> Optional[str]:
        state_norm = self._normalize_text(state)
        district_norm = self._normalize_text(district)
        season_norm = self._normalize_text(season)

        for key in [
            f"{state_norm}_{district_norm}_{season_norm}",
            f"{state_norm}_{district_norm}_ANY",
            f"{state_norm}__STATE__{season_norm}",
            f"{state_norm}__STATE__ANY"
        ]:
            category_data = self.location_crop_candidates.get(key, {})
            for crop_name in category_data.get(category, []):
                if crop_name not in used_names:
                    return crop_name

        if strict_data_mode:
            return None

        for crop_name in self.CATEGORY_TO_SPECIFIC_CROPS.get(category, []):
            if crop_name not in used_names:
                return crop_name

        return self._format_crop_display_name(category)
    
    def _load_models(self):
        """Load trained ML models and encoders."""
        try:
            # Check for v3 models first (season-specific with 96.75% Top-5 accuracy)
            classifier_v3_path = os.path.join(self.model_dir, 'crop_classifier_v3.pkl')
            classifier_v2_path = os.path.join(self.model_dir, 'crop_classifier_v2.pkl')
            classifier_path = os.path.join(self.model_dir, 'crop_classifier.pkl')
            
            if os.path.exists(classifier_v3_path):
                print("Loading season-specific v3 ML models (96.75% Top-5 accuracy)...")
                
                with open(classifier_v3_path, 'rb') as f:
                    self.classifier = pickle.load(f)
                
                with open(os.path.join(self.model_dir, 'scaler_v3.pkl'), 'rb') as f:
                    self.scaler = pickle.load(f)
                
                with open(os.path.join(self.model_dir, 'encoders_v3.json'), 'r') as f:
                    self.encoders = json.load(f)
                
                # Load season-crop mapping
                season_map_path = os.path.join(self.model_dir, 'season_crop_map_v3.json')
                if os.path.exists(season_map_path):
                    with open(season_map_path, 'r') as f:
                        self.season_crop_map = json.load(f)
                else:
                    self.season_crop_map = {}
                
                # Load crop profiles
                profiles_path = os.path.join(self.model_dir, 'crop_profiles_v3.json')
                if os.path.exists(profiles_path):
                    with open(profiles_path, 'r') as f:
                        self.crop_profiles = json.load(f)
                else:
                    self.crop_profiles = {}
                
                self.district_profiles = {}
                self.use_ml_model = True
                self.model_version = 'v3'
                print("Season-specific v3 models loaded.")
                
            elif os.path.exists(classifier_v2_path):
                print("Loading improved v2 ML models (95%+ accuracy)...")
                
                with open(classifier_v2_path, 'rb') as f:
                    self.classifier = pickle.load(f)
                
                with open(os.path.join(self.model_dir, 'yield_regressor_v2.pkl'), 'rb') as f:
                    self.yield_regressor = pickle.load(f)
                
                with open(os.path.join(self.model_dir, 'scaler_v2.pkl'), 'rb') as f:
                    self.scaler = pickle.load(f)
                
                with open(os.path.join(self.model_dir, 'encoders_v2.json'), 'r') as f:
                    self.encoders = json.load(f)
                
                with open(os.path.join(self.model_dir, 'crop_profiles_v2.json'), 'r') as f:
                    self.crop_profiles = json.load(f)
                
                with open(os.path.join(self.model_dir, 'district_profiles_v2.json'), 'r') as f:
                    self.district_profiles = json.load(f)
                
                self.use_ml_model = True
                self.model_version = 'v2'
                print("ML models v2 loaded successfully.")
                
            elif os.path.exists(classifier_path):
                print("Loading trained ML models v1...")
                
                with open(classifier_path, 'rb') as f:
                    self.classifier = pickle.load(f)
                
                with open(os.path.join(self.model_dir, 'yield_regressor.pkl'), 'rb') as f:
                    self.yield_regressor = pickle.load(f)
                
                with open(os.path.join(self.model_dir, 'scaler.pkl'), 'rb') as f:
                    self.scaler = pickle.load(f)
                
                with open(os.path.join(self.model_dir, 'encoders.json'), 'r') as f:
                    self.encoders = json.load(f)
                
                with open(os.path.join(self.model_dir, 'crop_profiles.json'), 'r') as f:
                    self.crop_profiles = json.load(f)
                
                with open(os.path.join(self.model_dir, 'district_profiles.json'), 'r') as f:
                    self.district_profiles = json.load(f)
                
                self.use_ml_model = True
                self.model_version = 'v1'
                print("ML models v1 loaded successfully.")
            else:
                print("Trained models not found. Using rule-based fallback.")
                self.use_ml_model = False
                self.model_version = None
                self.crop_profiles = {}
                self.district_profiles = {}
                self.encoders = {'state_classes': [], 'district_classes': [], 'crop_classes': []}
                
        except Exception as e:
            print(f"Error loading models: {e}. Using rule-based fallback.")
            self.use_ml_model = False
            self.model_version = None
            self.crop_profiles = {}
            self.district_profiles = {}
            self.encoders = {'state_classes': [], 'district_classes': [], 'crop_classes': []}
    
    def _load_crop_database(self) -> Dict:
        """
        Load crop database with ideal conditions for rule-based fallback.
        """
        self.crops = {
            'RICE': {
                'season': ['KHARIF'],
                'temp_range': (20, 35),
                'humidity_range': (60, 80),
                'nitrogen_range': (80, 150),
                'phosphorus_range': (15, 30),
                'potassium_range': (100, 200),
                'base_yield': 3000
            },
            'WHEAT': {
                'season': ['RABI'],
                'temp_range': (15, 25),
                'humidity_range': (50, 70),
                'nitrogen_range': (100, 180),
                'phosphorus_range': (20, 40),
                'potassium_range': (120, 220),
                'base_yield': 3500
            },
            'MAIZE': {
                'season': ['KHARIF', 'RABI'],
                'temp_range': (18, 30),
                'humidity_range': (50, 70),
                'nitrogen_range': (120, 200),
                'phosphorus_range': (25, 45),
                'potassium_range': (150, 250),
                'base_yield': 4000
            },
            'COTTON': {
                'season': ['KHARIF'],
                'temp_range': (21, 30),
                'humidity_range': (50, 65),
                'nitrogen_range': (80, 150),
                'phosphorus_range': (15, 35),
                'potassium_range': (100, 200),
                'base_yield': 500
            },
            'SUGARCANE': {
                'season': ['KHARIF', 'WHOLE YEAR'],
                'temp_range': (20, 32),
                'humidity_range': (60, 80),
                'nitrogen_range': (150, 250),
                'phosphorus_range': (30, 60),
                'potassium_range': (200, 350),
                'base_yield': 70000
            },
            'GROUNDNUT': {
                'season': ['KHARIF', 'RABI'],
                'temp_range': (24, 33),
                'humidity_range': (50, 65),
                'nitrogen_range': (40, 80),
                'phosphorus_range': (15, 30),
                'potassium_range': (80, 150),
                'base_yield': 2500
            },
            'PULSES': {
                'season': ['RABI', 'KHARIF'],
                'temp_range': (20, 30),
                'humidity_range': (50, 65),
                'nitrogen_range': (20, 50),
                'phosphorus_range': (20, 40),
                'potassium_range': (80, 150),
                'base_yield': 1200
            },
            'MILLETS': {
                'season': ['KHARIF'],
                'temp_range': (25, 35),
                'humidity_range': (40, 60),
                'nitrogen_range': (30, 80),
                'phosphorus_range': (15, 30),
                'potassium_range': (60, 120),
                'base_yield': 1500
            },
            'BARLEY': {
                'season': ['RABI'],
                'temp_range': (12, 25),
                'humidity_range': (40, 60),
                'nitrogen_range': (40, 80),
                'phosphorus_range': (15, 30),
                'potassium_range': (60, 120),
                'base_yield': 2800
            },
            'OIL SEEDS': {
                'season': ['KHARIF', 'RABI'],
                'temp_range': (20, 32),
                'humidity_range': (50, 70),
                'nitrogen_range': (40, 100),
                'phosphorus_range': (20, 40),
                'potassium_range': (80, 160),
                'base_yield': 1200
            }
        }
        return self.crops
    
    def fetch_weather(self, lat: float, lon: float) -> Dict:
        """
        Fetch current weather data from OpenWeatherMap API.
        """
        try:
            params = {
                'lat': lat,
                'lon': lon,
                'appid': self.weather_api_key,
                'units': 'metric'
            }
            
            response = requests.get(self.weather_base_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            return {
                'temperature': data['main']['temp'],
                'humidity': data['main']['humidity'],
                'pressure': data['main']['pressure'],
                'weather': data['weather'][0]['description'] if data.get('weather') else 'unknown',
                'source': 'openweathermap'
            }
        except Exception as e:
            print(f"Weather API error: {e}")
            return {
                'temperature': 25.0,
                'humidity': 60.0,
                'pressure': 1013,
                'weather': 'unknown',
                'source': 'default'
            }
    
    @lru_cache(maxsize=100)
    def get_coordinates(self, district: str, state: str) -> tuple:
        """Get coordinates for a district using geocoding."""
        try:
            geo_url = "https://geocoding-api.open-meteo.com/v1/search"
            params = {
                'name': f"{district}, {state}",
                'count': 1,
                'country': 'India'
            }
            response = requests.get(geo_url, params=params, timeout=10)
            data = response.json()
            
            if data.get('results'):
                return (data['results'][0]['latitude'], data['results'][0]['longitude'])
        except:
            pass
        
        # Default to approximate India center
        return (20.5937, 78.9629)
    
    def _prepare_features(self, features: Dict) -> np.ndarray:
        """
        Prepare feature vector for ML model prediction.
        Handles both v1 and v2 model feature formats.
        """
        # State/District encoding
        state = features.get('state', '').upper()
        district = features.get('district', '').upper()
        season = features.get('season', 'KHARIF').upper()
        
        state_encoded = 0
        district_encoded = 0
        season_encoded = 0
        
        if state in self.encoders.get('state_classes', []):
            state_encoded = self.encoders['state_classes'].index(state)
        
        if district in self.encoders.get('district_classes', []):
            district_encoded = self.encoders['district_classes'].index(district)
        
        # Season encoding - check if v2 model has season_classes
        if 'season_classes' in self.encoders:
            season_classes = self.encoders['season_classes']
            if season in season_classes:
                season_encoded = season_classes.index(season)
        else:
            season_mapping = {
                'KHARIF': 0, 'RABI': 1, 'WHOLE YEAR': 2, 
                'SUMMER': 3, 'WINTER': 4, 'AUTUMN': 5
            }
            season_encoded = season_mapping.get(season, 0)
        
        # Get soil micronutrients (use defaults if not available)
        zn = features.get('soil_zn', 60.0)
        fe = features.get('soil_fe', 80.0)
        cu = features.get('soil_cu', 90.0)
        mn = features.get('soil_mn', 85.0)
        b = features.get('soil_b', 70.0)
        s = features.get('soil_s', 75.0)
        
        # Environmental conditions
        temperature = features.get('avg_temperature', 28.0)
        humidity = features.get('avg_humidity', 60.0)
        moisture = features.get('soil_moisture', 45.0)
        nitrogen = features.get('soil_nitrogen', 100)
        potassium = features.get('soil_potassium', 150)
        phosphorus = features.get('soil_phosphorus', 20)
        
        # Check model version and build appropriate feature vector
        if hasattr(self, 'model_version') and self.model_version == 'v3':
            # V3 model feature order (16 features):
            # ['state_enc', 'district_enc', 'season_enc', 'zn', 'fe', 'cu', 'mn', 'b', 's',
            #  'yield_mean', 'avg_area', 'temp_mean', 'humidity_mean', 'nitrogen_mean', 
            #  'potassium_mean', 'phosphorus_mean']
            
            yield_mean = 2000.0  # Default yield
            avg_area = 1000.0   # Default area
            
            feature_vector = np.array([
                state_encoded, district_encoded, season_encoded,
                zn, fe, cu, mn, b, s,
                yield_mean, avg_area,
                temperature, humidity, nitrogen, potassium, phosphorus
            ]).reshape(1, -1)
            
        elif hasattr(self, 'model_version') and self.model_version == 'v2':
            # V2 model feature order:
            # ['state_enc', 'district_enc', 'season_enc', 'zn', 'fe', 'cu', 'mn', 'b', 's', 
            #  'yield_mean', 'total_area', 'env_temp_min', 'env_temp_max', 'env_temp_mean', 
            #  'env_humidity_min', 'env_humidity_max', 'env_humidity_mean', 'env_moisture_mean', 
            #  'env_nitrogen_mean', 'env_potassium_mean', 'env_phosphorus_mean']
            
            # Get historical data for yield_mean and total_area
            key = f"{state}_{district}"
            if key in self.district_profiles:
                profile = self.district_profiles[key]
                # Average yield across crops for this district
                crops = profile.get('crops', {})
                if crops:
                    yield_mean = np.mean([c.get('avg_yield', 2000) for c in crops.values()])
                else:
                    yield_mean = 2000.0
            else:
                yield_mean = 2000.0
            
            total_area = 1000.0  # Default area in hectares
            
            # Environmental features - use provided values or defaults
            env_temp_min = temperature - 5  # Estimate from mean
            env_temp_max = temperature + 5
            env_temp_mean = temperature
            env_humidity_min = max(30, humidity - 15)
            env_humidity_max = min(100, humidity + 15)
            env_humidity_mean = humidity
            env_moisture_mean = moisture
            env_nitrogen_mean = nitrogen
            env_potassium_mean = potassium
            env_phosphorus_mean = phosphorus
            
            feature_vector = np.array([
                state_encoded, district_encoded, season_encoded,
                zn, fe, cu, mn, b, s,
                yield_mean, total_area,
                env_temp_min, env_temp_max, env_temp_mean,
                env_humidity_min, env_humidity_max, env_humidity_mean,
                env_moisture_mean, env_nitrogen_mean, env_potassium_mean, env_phosphorus_mean
            ]).reshape(1, -1)
        else:
            # V1 model feature order
            feature_vector = np.array([
                season_encoded,
                zn, fe, cu, mn, b, s,  # Soil micronutrients
                temperature, humidity, moisture,
                nitrogen, potassium, phosphorus,
                state_encoded, district_encoded
            ]).reshape(1, -1)
        
        return feature_vector
    
    def _get_district_historical_data(self, state: str, district: str, crop: str) -> Dict:
        """Get historical yield data for a specific crop in a district."""
        key = f"{state}_{district}"
        
        if key in self.district_profiles:
            crops = self.district_profiles[key].get('crops', {})
            if crop in crops:
                return crops[crop]
        
        return None

    def _get_crop_profile(self, state: str, district: str, season: str, crop: str) -> Dict:
        """Return district-season profile for a modeled crop category."""
        key = f"{state}_{district}_{season}".upper()
        if hasattr(self, 'crop_profiles') and key in self.crop_profiles:
            return self.crop_profiles[key].get(crop)
        return None

    def _calculate_historical_strength(self, state: str, district: str, season: str, crop: str) -> float:
        """Score how strongly this crop is supported by district-season history."""
        profile = self._get_crop_profile(state, district, season, crop)
        if not profile:
            return 0.0

        record_count = max(0, profile.get('record_count', 0))
        avg_area = max(0, profile.get('avg_area', 0))
        record_score = min(1.0, record_count / 10)
        area_score = min(1.0, np.log1p(avg_area) / 10)
        return (record_score * 0.65) + (area_score * 0.35)
    
    def _calculate_suitability_score_ml(self, crop_idx: int, probabilities: np.ndarray, features: Dict = None) -> float:
        """Calculate suitability score from ML model probabilities and environmental factors."""
        base_score = 30.0  # Start with base score
        
        if crop_idx < len(probabilities[0]):
            prob = probabilities[0][crop_idx]
            
            # For v2/v3 models with 16 categories, probabilities are higher
            if hasattr(self, 'model_version') and self.model_version in ['v2', 'v3']:
                # Scale: 0.3+ prob = excellent (95+), 0.15+ = very good (80+), 0.05+ = good (60+)
                if prob >= 0.3:
                    prob_score = 65 + (prob - 0.3) * 50  # 65-70+ points
                elif prob >= 0.15:
                    prob_score = 50 + (prob - 0.15) * 100  # 50-65 points
                elif prob >= 0.05:
                    prob_score = 30 + (prob - 0.05) * 200  # 30-50 points
                else:
                    prob_score = prob * 600  # 0-30 points
            else:
                # For v1 model with 124 classes, use original scaling
                prob_score = min(50, prob * 500)
            
            base_score += prob_score
        
        # Add environmental bonus based on features
        if features:
            temp = features.get('avg_temperature', 25)
            humidity = features.get('avg_humidity', 60)
            
            # Temperature bonus (optimal 20-32°C for most crops)
            if 20 <= temp <= 32:
                base_score += 8
            elif 15 <= temp <= 35:
                base_score += 4
            
            # Humidity bonus
            if 50 <= humidity <= 75:
                base_score += 7
            elif 40 <= humidity <= 80:
                base_score += 3
        
        return min(100, max(0, base_score))
    
    def _calculate_suitability_score_rules(self, crop_data: Dict, features: Dict) -> float:
        """
        Calculate suitability score (0-100) using rule-based approach.
        Fallback when ML model is not available.
        """
        score = 100.0
        season = features.get('season', 'KHARIF').upper()
        
        # Season match (critical)
        if season not in crop_data.get('season', []):
            return 0.0
        
        # Temperature match
        temp = features.get('avg_temperature', 25)
        temp_min, temp_max = crop_data.get('temp_range', (20, 35))
        if temp < temp_min or temp > temp_max:
            score -= 25
        else:
            temp_optimal = (temp_min + temp_max) / 2
            temp_deviation = abs(temp - temp_optimal) / max(1, temp_max - temp_min)
            score -= temp_deviation * 15
        
        # Humidity match
        humidity = features.get('avg_humidity', 60)
        h_min, h_max = crop_data.get('humidity_range', (50, 70))
        if h_min <= humidity <= h_max:
            score += 5
        else:
            score -= 10
        
        # Soil nutrients match
        nitrogen = features.get('soil_nitrogen', 100)
        n_min, n_max = crop_data.get('nitrogen_range', (50, 150))
        if n_min <= nitrogen <= n_max:
            score += 5
        
        phosphorus = features.get('soil_phosphorus', 20)
        p_min, p_max = crop_data.get('phosphorus_range', (15, 40))
        if p_min <= phosphorus <= p_max:
            score += 5
        
        potassium = features.get('soil_potassium', 150)
        k_min, k_max = crop_data.get('potassium_range', (100, 200))
        if k_min <= potassium <= k_max:
            score += 5
        
        return max(0, min(100, score))
    
    def _predict_yield_ml(self, feature_vector: np.ndarray, crop: str, features: Dict) -> Dict:
        """
        Predict yield using ML model and historical data.
        Yields are converted to kg/hectare for better readability.
        """
        try:
            state = features.get('state', '').upper()
            district = features.get('district', '').upper()
            season = features.get('season', 'KHARIF').upper()
            temperature = features.get('avg_temperature', 28.0)
            
            # For v3 model, use crop profiles and temperature suitability
            if hasattr(self, 'model_version') and self.model_version == 'v3':
                # Check crop profiles from training
                key = f"{state}_{district}_{season}".upper()
                if hasattr(self, 'crop_profiles') and key in self.crop_profiles:
                    if crop in self.crop_profiles[key]:
                        profile = self.crop_profiles[key][crop]
                        yield_mean = profile.get('yield_mean', 2000)
                        yield_std = profile.get('yield_std', 500)

                        # Historical production data is usually tonnes/hectare.
                        # The API contract and UI expect kg/hectare.
                        if yield_mean < 100:
                            yield_mean *= 1000
                            yield_std *= 1000
                        
                        # Adjust for temperature
                        temp_suit = self._calculate_temp_suitability(crop, temperature)
                        expected = yield_mean * temp_suit
                        
                        return {
                            'min': round(max(100, expected - yield_std), 0),
                            'max': round(expected + yield_std, 0),
                            'expected': round(expected, 0),
                            'unit': 'kg/hectare'
                        }
                
                # Default yields by crop category
                default_yields = {
                    'CEREALS_WHEAT': 3500, 'CEREALS_RICE': 3000, 'CEREALS_MAIZE': 4000,
                    'CEREALS_BARLEY': 2800, 'CEREALS_MILLETS': 1500, 'PULSES': 1200,
                    'OILSEEDS': 1200, 'SUGARCANE': 70000, 'COTTON': 500,
                    'JUTE': 2500, 'TOBACCO': 1800, 'VEGETABLES': 15000,
                    'FRUITS': 10000, 'SPICES': 2000, 'PLANTATION': 5000, 'FIBER': 1500
                }
                
                base_yield = default_yields.get(crop, 2000)
                temp_suit = self._calculate_temp_suitability(crop, temperature)
                expected = base_yield * temp_suit
                
                return {
                    'min': round(expected * 0.7, 0),
                    'max': round(expected * 1.3, 0),
                    'expected': round(expected, 0),
                    'unit': 'kg/hectare'
                }
            
            # For v2 model, we need to prepare special yield features
            elif hasattr(self, 'model_version') and self.model_version == 'v2':
                # Get crop encoding
                crop_encoded = 0
                if crop in self.encoders.get('crop_classes', []):
                    crop_encoded = self.encoders['crop_classes'].index(crop)
                
                # Build yield features: state, district, season, crop, soil, env
                zn = features.get('soil_zn', 60.0)
                fe = features.get('soil_fe', 80.0)
                cu = features.get('soil_cu', 90.0)
                mn = features.get('soil_mn', 85.0)
                b = features.get('soil_b', 70.0)
                s = features.get('soil_s', 75.0)
                
                temperature = features.get('avg_temperature', 28.0)
                humidity = features.get('avg_humidity', 60.0)
                moisture = features.get('soil_moisture', 45.0)
                nitrogen = features.get('soil_nitrogen', 100)
                potassium = features.get('soil_potassium', 150)
                phosphorus = features.get('soil_phosphorus', 20)
                
                state_encoded = 0
                district_encoded = 0
                season_encoded = 0
                season = features.get('season', 'KHARIF').upper()
                
                if state in self.encoders.get('state_classes', []):
                    state_encoded = self.encoders['state_classes'].index(state)
                if district in self.encoders.get('district_classes', []):
                    district_encoded = self.encoders['district_classes'].index(district)
                if 'season_classes' in self.encoders:
                    if season in self.encoders['season_classes']:
                        season_encoded = self.encoders['season_classes'].index(season)
                
                # Features for yield regressor (20 features):
                # state_enc, district_enc, season_enc, crop_enc, zn, fe, cu, mn, b, s,
                # env_temp_min, env_temp_max, env_temp_mean, env_humidity_min, env_humidity_max,
                # env_humidity_mean, env_moisture_mean, env_nitrogen_mean, env_potassium_mean, env_phosphorus_mean
                yield_features = np.array([
                    state_encoded, district_encoded, season_encoded, crop_encoded,
                    zn, fe, cu, mn, b, s,
                    temperature - 5, temperature + 5, temperature,
                    max(30, humidity - 15), min(100, humidity + 15), humidity,
                    moisture, nitrogen, potassium, phosphorus
                ]).reshape(1, -1)
                
                log_yield = self.yield_regressor.predict(yield_features)[0]
                predicted_yield = np.expm1(log_yield)
            else:
                # V1 model
                scaled_features = self.scaler.transform(feature_vector)
                log_yield = self.yield_regressor.predict(scaled_features)[0]
                predicted_yield = np.expm1(log_yield)
            
            # Convert tonnes/hectare to kg/hectare
            predicted_yield_kg = predicted_yield * 1000
            
            # Get historical data for better estimates
            historical = self._get_district_historical_data(state, district, crop)
            
            if historical:
                # Blend ML prediction with historical data (historical is in tonnes)
                hist_avg = historical.get('avg_yield', predicted_yield) * 1000
                hist_min = historical.get('min_yield', predicted_yield * 0.7) * 1000
                hist_max = historical.get('max_yield', predicted_yield * 1.3) * 1000
                
                # Weighted average: 40% ML, 60% historical for better accuracy
                expected = 0.4 * predicted_yield_kg + 0.6 * hist_avg
                min_yield = min(predicted_yield_kg * 0.8, hist_min)
                max_yield = max(predicted_yield_kg * 1.2, hist_max)
            else:
                expected = predicted_yield_kg
                min_yield = predicted_yield_kg * 0.8
                max_yield = predicted_yield_kg * 1.2
            
            # Ensure reasonable bounds
            expected = max(100, expected)  # Minimum 100 kg/ha
            min_yield = max(50, min_yield)
            max_yield = max(expected * 1.1, max_yield)
            
            return {
                'min': round(min_yield, 0),
                'max': round(max_yield, 0),
                'expected': round(expected, 0),
                'unit': 'kg/hectare'
            }
        except Exception as e:
            print(f"Yield prediction error: {e}")
            return {'min': 1000, 'max': 3000, 'expected': 2000, 'unit': 'kg/hectare'}
    
    def _predict_yield_rules(self, crop_data: Dict, suitability_score: float) -> Dict:
        """
        Predict yield using rule-based approach.
        """
        base_yield = crop_data.get('base_yield', 2000)
        yield_multiplier = suitability_score / 100
        
        expected = base_yield * yield_multiplier
        min_yield = expected * 0.8
        max_yield = expected * 1.2
        
        return {
            'min': round(min_yield, 2),
            'max': round(max_yield, 2),
            'expected': round(expected, 2),
            'unit': 'kg/hectare'
        }
    
    def _generate_explanation(self, crop_name: str, features: Dict, score: float, historical: Dict = None) -> str:
        """
        Generate human-readable explanation for the recommendation.
        """
        explanations = []
        
        if score >= 80:
            explanations.append(f"{crop_name} is highly suitable for your location.")
        elif score >= 60:
            explanations.append(f"{crop_name} is suitable for your location.")
        else:
            explanations.append(f"{crop_name} is moderately suitable for your location.")
        
        season = features.get('season', 'Kharif')
        explanations.append(f"Recommended for {season} season.")
        
        temp = features.get('avg_temperature', 25)
        explanations.append(f"Current temperature ({temp:.1f}°C) is within growing range.")
        
        if historical:
            explanations.append(f"Based on {historical.get('num_records', 0)} years of historical data in your district.")
        
        return " ".join(explanations)
    
    def _calculate_environmental_factors(self, features: Dict, historical: Dict = None, crop: str = None) -> Dict:
        """
        Calculate individual environmental factor matches.
        """
        # Soil match based on micronutrients
        soil_score = 0
        for nutrient in ['soil_zn', 'soil_fe', 'soil_cu', 'soil_mn']:
            val = features.get(nutrient, 50)
            if val >= 50:
                soil_score += 25
            elif val >= 30:
                soil_score += 15
        
        # NPK match
        npk_score = 0
        nitrogen = features.get('soil_nitrogen', 100)
        if 50 <= nitrogen <= 200:
            npk_score += 35
        
        phosphorus = features.get('soil_phosphorus', 20)
        if 10 <= phosphorus <= 50:
            npk_score += 35
        
        potassium = features.get('soil_potassium', 150)
        if 80 <= potassium <= 250:
            npk_score += 30
        
        # Weather match. Use crop-specific temperature ranges where available;
        # generic 20-35 C scoring made many crops look identical.
        temp = features.get('avg_temperature', 25)
        if crop:
            temp_score = self._calculate_temp_suitability(crop, temp) * 60
        else:
            temp_score = 50 if 20 <= temp <= 35 else 25

        humidity = features.get('avg_humidity', 60)
        if 45 <= humidity <= 80:
            humidity_score = 40
        elif 35 <= humidity <= 90:
            humidity_score = 28
        else:
            humidity_score = 15

        weather_score = temp_score + humidity_score
        
        # Historical yield score
        historical_score = 70  # Default
        if historical:
            # Score based on consistency of historical yields
            std = historical.get('std_yield', 0)
            avg = historical.get('avg_yield', historical.get('yield_mean', 1))
            if std is None or not np.isfinite(std):
                record_count = historical.get('record_count', historical.get('num_records', 0))
                historical_score = max(60, min(100, 55 + record_count * 3))
            elif avg and np.isfinite(avg) and avg > 0:
                cv = std / avg  # Coefficient of variation
                historical_score = max(50, min(100, 100 - cv * 100))
        
        return {
            'soilMatch': round(min(100, soil_score), 1),
            'npkMatch': round(min(100, npk_score), 1),
            'weatherMatch': round(min(100, weather_score), 1),
            'historicalYield': round(historical_score, 1)
        }
    
    def _calculate_temp_suitability(self, crop: str, temperature: float) -> float:
        """Calculate how suitable the temperature is for this crop (0-1)."""
        if crop not in self.CROP_TEMP_RANGES:
            return 0.7  # Default moderate score
        
        temp_min, temp_max = self.CROP_TEMP_RANGES[crop]
        optimal_temp = (temp_min + temp_max) / 2
        
        if temp_min <= temperature <= temp_max:
            distance = abs(temperature - optimal_temp) / ((temp_max - temp_min) / 2)
            return 1.0 - (distance * 0.2)  # 0.8-1.0 within range
        elif temperature < temp_min:
            deficit = temp_min - temperature
            return max(0.2, 0.8 - (deficit * 0.05))
        else:
            excess = temperature - temp_max
            return max(0.2, 0.8 - (excess * 0.05))
    
    def _get_crops_for_season(self, state: str, district: str, season: str) -> set:
        """Get crops historically grown in this season at this location."""
        season = season.upper()
        
        # For v3 model, check season_crop_map
        if hasattr(self, 'season_crop_map') and self.season_crop_map:
            key = f"{state}_{district}".upper()
            if season in self.season_crop_map:
                if key in self.season_crop_map[season]:
                    return set(self.season_crop_map[season][key])
                # Try state-level, but aggregate all districts instead of returning
                # the first district found for the state.
                state_crops = set()
                for k, crops in self.season_crop_map[season].items():
                    if k.startswith(state.upper()):
                        state_crops.update(crops)
                if state_crops:
                    return state_crops
        
        # Fall back to default season crops
        return set(self.DEFAULT_SEASON_CROPS.get(season, []))
    
    def predict(self, features: Dict) -> List[Dict]:
        """
        Predict top crop recommendations using ML model with season filtering.
        
        Args:
            features: Dictionary containing:
                - state, district: Location
                - season: Kharif/Rabi/Summer/Winter/Autumn/Whole Year
                - soil_nitrogen, soil_phosphorus, soil_potassium: NPK values
                - avg_temperature, avg_humidity: Weather conditions
                - soil_zn, soil_fe, etc.: Micronutrients (optional)
            
        Returns:
            List of top 5 crop recommendations with scores and yield predictions
        """
        recommendations = []
        state = features.get('state', '').upper()
        district = features.get('district', '').upper()
        season = features.get('season', 'KHARIF').upper()
        temperature = features.get('avg_temperature', 25)
        
        # Update features with uppercase values
        features['state'] = state
        features['district'] = district
        features['season'] = season
        
        # Get crops grown in this season
        season_crops = self._get_crops_for_season(state, district, season)
        print(f"Season '{season}' crops for {district}: {season_crops}")
        
        used_specific_crop_names = set()

        if self.use_ml_model:
            # ML-based prediction with season filtering
            try:
                feature_vector = self._prepare_features(features)
                scaled_features = self.scaler.transform(feature_vector)
                
                # Get crop probabilities
                probabilities = self.classifier.predict_proba(scaled_features)
                crop_classes = self.encoders['crop_classes']
                
                # Score all crops with season and temperature awareness
                all_scores = []
                for idx in range(len(crop_classes)):
                    if idx >= len(probabilities[0]):
                        continue
                    
                    crop_name = crop_classes[idx]
                    prob = probabilities[0][idx]
                    is_season_match = crop_name in season_crops
                    
                    # Calculate base score from probability
                    score = self._calculate_suitability_score_ml(idx, probabilities, features)
                    
                    # Temperature suitability adjustment
                    temp_suit = self._calculate_temp_suitability(crop_name, temperature)
                    historical_strength = self._calculate_historical_strength(state, district, season, crop_name)
                    
                    # Strong adjustments based on season match
                    if is_season_match:
                        score = min(100, score * 1.25)  # 25% bonus for correct season
                        score += temp_suit * 10  # Up to 10 points for temp match
                    else:
                        score = score * 0.35  # 65% penalty for wrong season
                    
                    # Additional temp penalty if very unsuitable
                    if temp_suit < 0.5:
                        score *= 0.8

                    if historical_strength > 0:
                        score += historical_strength * 18
                    else:
                        score -= 12

                    score = min(100, max(0, score))
                    
                    all_scores.append({
                        'idx': idx,
                        'crop_name': crop_name,
                        'score': score,
                        'is_season_match': is_season_match,
                        'temp_suitability': temp_suit
                    })
                
                # Sort by season match first, then score
                all_scores.sort(key=lambda x: (x['is_season_match'], x['score']), reverse=True)
                
                # Build recommendations
                for item in all_scores[:15]:
                    crop_name = item['crop_name']
                    score = item['score']
                    is_season_match = item['is_season_match']
                    temp_suit = item['temp_suitability']
                    
                    if score < 30:
                        continue

                    # Keep recommendations season-accurate for farmer trust.
                    if not is_season_match:
                        continue
                    
                    # Get historical data
                    historical = (
                        self._get_district_historical_data(state, district, crop_name)
                        or self._get_crop_profile(state, district, season, crop_name)
                    )

                    # Convert category prediction into a precise crop for user-facing output.
                    specific_crop_name = self._select_specific_crop(
                        crop_name,
                        state,
                        district,
                        season,
                        used_specific_crop_names,
                        strict_data_mode=False
                    )
                    if not specific_crop_name:
                        continue
                    used_specific_crop_names.add(specific_crop_name)
                    
                    # Predict yield
                    yield_pred = self._predict_yield_ml(feature_vector, crop_name, features)
                    
                    # Generate explanation with season and temp info
                    explanation = self._generate_season_explanation(
                        specific_crop_name, features, score, is_season_match, temp_suit, historical, crop_name
                    )
                    
                    # Calculate environmental factors
                    env_factors = self._calculate_environmental_factors(features, historical, crop_name)
                    
                    recommendations.append({
                        'cropName': specific_crop_name,
                        'suitabilityScore': round(score, 1),
                        'yieldPrediction': yield_pred,
                        'explanation': explanation,
                        'environmentalFactors': env_factors,
                        'seasonMatch': is_season_match,
                        'temperatureSuitability': round(temp_suit * 100, 1)
                    })
                
            except Exception as e:
                print(f"ML prediction error: {e}. Falling back to rules.")
                import traceback
                traceback.print_exc()
                recommendations = self._predict_with_rules(features, season_crops)
        else:
            recommendations = self._predict_with_rules(features, season_crops)
        
        # If we have too few, supplement with rule-based
        if len(recommendations) < 5:
            rule_recs = self._predict_with_rules(features, season_crops)
            existing_crops = {r['cropName'] for r in recommendations}
            for rec in rule_recs:
                if rec['cropName'] not in existing_crops and len(recommendations) < 5:
                    recommendations.append(rec)
        
        # Sort by suitability score
        recommendations.sort(key=lambda x: x['suitabilityScore'], reverse=True)
        
        # Return top 5
        return recommendations[:5]
    
    def _generate_season_explanation(self, crop_name: str, features: Dict, score: float,
                                      is_season_match: bool, temp_suit: float, historical: Dict = None,
                                      temp_reference_crop: Optional[str] = None) -> str:
        """Generate explanation with season and temperature info."""
        explanations = []
        
        if score >= 85:
            explanations.append(f"{crop_name} is highly recommended for your conditions.")
        elif score >= 70:
            explanations.append(f"{crop_name} is well suited for your location.")
        elif score >= 55:
            explanations.append(f"{crop_name} is suitable for your conditions.")
        else:
            explanations.append(f"{crop_name} is moderately suitable.")
        
        season = features.get('season', 'Kharif')
        if is_season_match:
            explanations.append(f"Historically grown during {season} season in your region.")
        else:
            explanations.append(f"Not typically grown in {season} - consider alternative seasons.")
        
        temp = features.get('avg_temperature', 25)
        temp_lookup = temp_reference_crop or crop_name
        temp_range = self.CROP_TEMP_RANGES.get(temp_lookup, (15, 35))
        if temp_suit >= 0.8:
            explanations.append(f"Temperature ({temp:.1f}°C) is optimal for this crop.")
        elif temp_suit >= 0.6:
            explanations.append(f"Temperature ({temp:.1f}°C) is suitable; optimal is {temp_range[0]}-{temp_range[1]}°C.")
        else:
            explanations.append(f"Temperature ({temp:.1f}°C) is not ideal; optimal is {temp_range[0]}-{temp_range[1]}°C.")
        
        if historical:
            explanations.append(f"Based on historical data from your district.")
        
        return " ".join(explanations)
    
    def _predict_with_rules(self, features: Dict, season_crops: set = None) -> List[Dict]:
        """Rule-based prediction fallback with season filtering."""
        recommendations = []
        season = features.get('season', 'KHARIF').upper()
        temperature = features.get('avg_temperature', 25)
        
        # Use season_crops if provided, otherwise use defaults
        if season_crops is None:
            season_crops = self.DEFAULT_SEASON_CROPS.get(season, [])
        
        # For rule-based, recommend crops that match the season
        used_specific_crop_names = set()
        for crop_name in season_crops:
            temp_suit = self._calculate_temp_suitability(crop_name, temperature)
            historical_strength = self._calculate_historical_strength(
                features.get('state', ''),
                features.get('district', ''),
                season,
                crop_name
            )
            
            # Base score from temperature suitability
            score = min(100, max(0, 45 + (temp_suit * 35) + (historical_strength * 20)))
            
            if score < 30:
                continue
            
            # Get yield based on defaults
            default_yields = {
                'CEREALS_WHEAT': 3500, 'CEREALS_RICE': 3000, 'CEREALS_MAIZE': 4000,
                'CEREALS_BARLEY': 2800, 'CEREALS_MILLETS': 1500, 'PULSES': 1200,
                'OILSEEDS': 1200, 'SUGARCANE': 70000, 'COTTON': 500,
                'JUTE': 2500, 'TOBACCO': 1800, 'VEGETABLES': 15000,
                'FRUITS': 10000, 'SPICES': 2000, 'PLANTATION': 5000, 'FIBER': 1500
            }
            base_yield = default_yields.get(crop_name, 2000) * temp_suit
            
            yield_pred = {
                'min': round(base_yield * 0.7, 0),
                'max': round(base_yield * 1.3, 0),
                'expected': round(base_yield, 0),
                'unit': 'kg/hectare'
            }
            
            temp_range = self.CROP_TEMP_RANGES.get(crop_name, (15, 35))
            specific_crop_name = self._select_specific_crop(
                crop_name,
                features.get('state', ''),
                features.get('district', ''),
                season,
                used_specific_crop_names,
                strict_data_mode=False
            )
            if not specific_crop_name:
                continue
            used_specific_crop_names.add(specific_crop_name)
            explanation = f"{crop_name} is recommended for {season} season. Temperature ({temperature:.1f}°C) "
            if temp_suit >= 0.8:
                explanation += f"is optimal (ideal: {temp_range[0]}-{temp_range[1]}°C)."
            else:
                explanation += f"is acceptable (optimal: {temp_range[0]}-{temp_range[1]}°C)."

            explanation = explanation.replace(crop_name, specific_crop_name)
            
            env_factors = self._calculate_environmental_factors(features, None, crop_name)
            
            recommendations.append({
                'cropName': specific_crop_name,
                'suitabilityScore': round(score, 1),
                'yieldPrediction': yield_pred,
                'explanation': explanation,
                'environmentalFactors': env_factors,
                'seasonMatch': True,
                'temperatureSuitability': round(temp_suit * 100, 1)
            })
        
        recommendations.sort(key=lambda x: x['suitabilityScore'], reverse=True)
        return recommendations
