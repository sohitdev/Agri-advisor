"""
Season-Specific Crop Prediction Model v3 for Agri-Advisor
- Filters crops by season (only recommends crops historically grown in that season)
- Uses temperature ranges to adjust suitability scores
- Location-specific historical data for accurate predictions
"""
import numpy as np
import pickle
import json
import os
import requests
from typing import List, Dict, Optional
from functools import lru_cache

class CropPredictorV3:
    """
    Season-aware ML-based crop recommendation predictor.
    Only recommends crops actually grown in the selected season.
    """
    
    # Temperature ranges for crop categories (optimal growing conditions in Celsius)
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
    
    # Default season-crop mapping (used if historical data not found)
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
    
    def __init__(self, model_dir: str = None):
        self.model_dir = model_dir or os.path.join(
            os.path.dirname(os.path.abspath(__file__)), 'trained'
        )
        
        # Weather API configuration
        self.weather_api_key = os.getenv('OPENWEATHER_API_KEY')
        self.weather_base_url = "https://api.openweathermap.org/data/2.5/weather"
        
        # Load models and data
        self._load_models()
    
    def _load_models(self):
        """Load trained ML models and encoders."""
        try:
            # Check for v3 models first (season-specific)
            classifier_v3_path = os.path.join(self.model_dir, 'crop_classifier_v3.pkl')
            classifier_v2_path = os.path.join(self.model_dir, 'crop_classifier_v2.pkl')
            
            if os.path.exists(classifier_v3_path):
                print("Loading season-specific v3 ML models...")
                
                with open(classifier_v3_path, 'rb') as f:
                    self.classifier = pickle.load(f)
                
                with open(os.path.join(self.model_dir, 'scaler_v3.pkl'), 'rb') as f:
                    self.scaler = pickle.load(f)
                
                with open(os.path.join(self.model_dir, 'encoders_v3.json'), 'r') as f:
                    self.encoders = json.load(f)
                
                # Load season-crop mapping (historical data)
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
                
                self.use_ml_model = True
                self.model_version = 'v3'
                print("✅ Season-specific v3 models loaded!")
                
            elif os.path.exists(classifier_v2_path):
                # Fall back to v2 model with season filtering
                print("Loading v2 models with season filtering...")
                
                with open(classifier_v2_path, 'rb') as f:
                    self.classifier = pickle.load(f)
                
                with open(os.path.join(self.model_dir, 'scaler_v2.pkl'), 'rb') as f:
                    self.scaler = pickle.load(f)
                
                with open(os.path.join(self.model_dir, 'encoders_v2.json'), 'r') as f:
                    self.encoders = json.load(f)
                
                with open(os.path.join(self.model_dir, 'district_profiles_v2.json'), 'r') as f:
                    self.district_profiles = json.load(f)
                
                self.season_crop_map = {}
                self.crop_profiles = {}
                self.use_ml_model = True
                self.model_version = 'v2'
                print("✅ V2 models loaded with season filtering")
                
            else:
                print("⚠️ No trained models found. Using rule-based fallback.")
                self.use_ml_model = False
                self.model_version = None
                self.season_crop_map = {}
                self.crop_profiles = {}
                self.encoders = {'state_classes': [], 'district_classes': [], 'crop_classes': []}
                
        except Exception as e:
            print(f"⚠️ Error loading models: {e}")
            self.use_ml_model = False
            self.model_version = None
    
    def _get_crops_for_season(self, state: str, district: str, season: str) -> set:
        """Get crops historically grown in this season at this location."""
        season = season.upper()
        
        # Check historical data first
        if self.season_crop_map:
            key = f"{state}_{district}".upper()
            if season in self.season_crop_map:
                if key in self.season_crop_map[season]:
                    return set(self.season_crop_map[season][key])
                # Try state-level
                for k in self.season_crop_map[season]:
                    if k.startswith(state.upper()):
                        return set(self.season_crop_map[season][k])
        
        # Fall back to default season crops
        return set(self.DEFAULT_SEASON_CROPS.get(season, []))
    
    def _calculate_temp_suitability(self, crop: str, temperature: float) -> float:
        """Calculate how suitable the temperature is for this crop (0-1)."""
        if crop not in self.CROP_TEMP_RANGES:
            return 0.7  # Default moderate score
        
        temp_min, temp_max = self.CROP_TEMP_RANGES[crop]
        optimal_temp = (temp_min + temp_max) / 2
        
        if temp_min <= temperature <= temp_max:
            # Within optimal range
            distance = abs(temperature - optimal_temp) / ((temp_max - temp_min) / 2)
            return 1.0 - (distance * 0.2)  # 0.8-1.0 score within range
        elif temperature < temp_min:
            # Too cold
            deficit = temp_min - temperature
            return max(0.2, 0.8 - (deficit * 0.05))
        else:
            # Too hot
            excess = temperature - temp_max
            return max(0.2, 0.8 - (excess * 0.05))
    
    def _prepare_features(self, features: Dict) -> np.ndarray:
        """Prepare feature vector for ML model prediction."""
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
        
        if 'season_classes' in self.encoders:
            if season in self.encoders['season_classes']:
                season_encoded = self.encoders['season_classes'].index(season)
        
        # Soil micronutrients
        zn = features.get('soil_zn', 60.0)
        fe = features.get('soil_fe', 80.0)
        cu = features.get('soil_cu', 90.0)
        mn = features.get('soil_mn', 85.0)
        b = features.get('soil_b', 70.0)
        s = features.get('soil_s', 75.0)
        
        # Environmental conditions
        temperature = features.get('avg_temperature', 28.0)
        humidity = features.get('avg_humidity', 60.0)
        nitrogen = features.get('soil_nitrogen', 100)
        potassium = features.get('soil_potassium', 150)
        phosphorus = features.get('soil_phosphorus', 20)
        
        if self.model_version == 'v3':
            # V3 model features (15 features based on training)
            yield_mean = 2000.0  # Default
            total_area = 1000.0
            
            feature_vector = np.array([
                state_encoded, district_encoded, season_encoded,
                zn, fe, cu, mn, b, s,
                yield_mean, total_area,
                temperature, humidity, nitrogen, potassium, phosphorus
            ]).reshape(1, -1)
        else:
            # V2 model features (21 features)
            yield_mean = 2000.0
            total_area = 1000.0
            
            feature_vector = np.array([
                state_encoded, district_encoded, season_encoded,
                zn, fe, cu, mn, b, s,
                yield_mean, total_area,
                temperature - 5, temperature + 5, temperature,
                max(30, humidity - 15), min(100, humidity + 15), humidity,
                45.0, nitrogen, potassium, phosphorus
            ]).reshape(1, -1)
        
        return feature_vector
    
    def _calculate_suitability_score(self, crop: str, probability: float, features: Dict) -> float:
        """Calculate suitability score based on ML probability and environmental factors."""
        base_score = 30.0
        
        # Probability contribution (0-50 points)
        if probability >= 0.2:
            prob_score = 50
        elif probability >= 0.1:
            prob_score = 40 + (probability - 0.1) * 100
        elif probability >= 0.05:
            prob_score = 25 + (probability - 0.05) * 300
        else:
            prob_score = probability * 500
        
        base_score += prob_score
        
        # Temperature suitability (0-15 points)
        temp = features.get('avg_temperature', 25)
        temp_suit = self._calculate_temp_suitability(crop, temp)
        base_score += temp_suit * 15
        
        # Humidity bonus (0-5 points)
        humidity = features.get('avg_humidity', 60)
        if 50 <= humidity <= 75:
            base_score += 5
        elif 40 <= humidity <= 80:
            base_score += 3
        
        return min(100, max(0, base_score))
    
    def _generate_explanation(self, crop: str, features: Dict, score: float, is_season_match: bool) -> str:
        """Generate human-readable explanation."""
        explanations = []
        
        if score >= 85:
            explanations.append(f"{crop} is highly recommended for your conditions.")
        elif score >= 70:
            explanations.append(f"{crop} is well suited for your location.")
        elif score >= 55:
            explanations.append(f"{crop} is suitable for your conditions.")
        else:
            explanations.append(f"{crop} is moderately suitable.")
        
        season = features.get('season', 'Kharif')
        if is_season_match:
            explanations.append(f"Historically grown during {season} season in your region.")
        
        temp = features.get('avg_temperature', 25)
        temp_range = self.CROP_TEMP_RANGES.get(crop, (15, 35))
        if temp_range[0] <= temp <= temp_range[1]:
            explanations.append(f"Temperature ({temp:.1f}°C) is optimal for this crop.")
        elif temp < temp_range[0]:
            explanations.append(f"Temperature ({temp:.1f}°C) is slightly cool; optimal is {temp_range[0]}-{temp_range[1]}°C.")
        else:
            explanations.append(f"Temperature ({temp:.1f}°C) is warm; optimal is {temp_range[0]}-{temp_range[1]}°C.")
        
        return " ".join(explanations)
    
    def _predict_yield(self, crop: str, features: Dict) -> Dict:
        """Predict yield based on crop and conditions."""
        state = features.get('state', '').upper()
        district = features.get('district', '').upper()
        season = features.get('season', 'KHARIF').upper()
        
        # Check crop profiles
        key = f"{state}_{district}_{season}".upper()
        if key in self.crop_profiles and crop in self.crop_profiles[key]:
            profile = self.crop_profiles[key][crop]
            yield_mean = profile.get('yield_mean', 2000)
            yield_std = profile.get('yield_std', 500)
            
            # Adjust for temperature
            temp = features.get('avg_temperature', 25)
            temp_mult = self._calculate_temp_suitability(crop, temp)
            
            expected = yield_mean * temp_mult
            min_yield = max(100, expected - yield_std)
            max_yield = expected + yield_std
            
            return {
                'min': round(min_yield, 0),
                'max': round(max_yield, 0),
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
        temp_mult = self._calculate_temp_suitability(crop, features.get('avg_temperature', 25))
        expected = base_yield * temp_mult
        
        return {
            'min': round(expected * 0.7, 0),
            'max': round(expected * 1.3, 0),
            'expected': round(expected, 0),
            'unit': 'kg/hectare'
        }
    
    def _calculate_environmental_factors(self, crop: str, features: Dict) -> Dict:
        """Calculate environmental factor matches."""
        temp = features.get('avg_temperature', 25)
        humidity = features.get('avg_humidity', 60)
        nitrogen = features.get('soil_nitrogen', 100)
        phosphorus = features.get('soil_phosphorus', 20)
        potassium = features.get('soil_potassium', 150)
        
        # Soil match
        soil_score = 0
        for nutrient in ['soil_zn', 'soil_fe', 'soil_cu', 'soil_mn']:
            val = features.get(nutrient, 50)
            if val >= 50:
                soil_score += 25
            elif val >= 30:
                soil_score += 15
        
        # NPK match
        npk_score = 0
        if 50 <= nitrogen <= 200:
            npk_score += 35
        if 10 <= phosphorus <= 50:
            npk_score += 35
        if 80 <= potassium <= 250:
            npk_score += 30
        
        # Weather match (based on temperature suitability)
        temp_suit = self._calculate_temp_suitability(crop, temp)
        weather_score = temp_suit * 50
        if 40 <= humidity <= 80:
            weather_score += 50
        elif 30 <= humidity <= 90:
            weather_score += 30
        
        return {
            'soilMatch': round(min(100, soil_score), 1),
            'npkMatch': round(min(100, npk_score), 1),
            'weatherMatch': round(min(100, weather_score), 1),
            'historicalYield': 75.0
        }
    
    def predict(self, features: Dict) -> List[Dict]:
        """
        Predict crop recommendations filtered by season and temperature.
        """
        recommendations = []
        state = features.get('state', '').upper()
        district = features.get('district', '').upper()
        season = features.get('season', 'KHARIF').upper()
        temperature = features.get('avg_temperature', 25)
        
        features['state'] = state
        features['district'] = district
        features['season'] = season
        
        # Get crops historically grown in this season at this location
        season_crops = self._get_crops_for_season(state, district, season)
        print(f"Season {season} crops for {state}/{district}: {season_crops}")
        
        if not self.use_ml_model:
            return self._fallback_predictions(features, season_crops)
        
        try:
            feature_vector = self._prepare_features(features)
            scaled_features = self.scaler.transform(feature_vector)
            
            # Get crop probabilities
            probabilities = self.classifier.predict_proba(scaled_features)
            crop_classes = self.encoders.get('crop_classes', [])
            
            # Score all crops
            all_scores = []
            for idx, crop in enumerate(crop_classes):
                if idx >= len(probabilities[0]):
                    continue
                
                prob = probabilities[0][idx]
                is_season_match = crop in season_crops
                
                # Calculate base score
                score = self._calculate_suitability_score(crop, prob, features)
                
                # Strong bonus for season-matched crops
                if is_season_match:
                    score = min(100, score * 1.3)  # 30% bonus
                else:
                    score = score * 0.4  # 60% penalty for wrong season
                
                # Temperature adjustment
                temp_suit = self._calculate_temp_suitability(crop, temperature)
                if temp_suit < 0.5:
                    score *= 0.7  # Penalty for unsuitable temperature
                
                all_scores.append({
                    'crop': crop,
                    'score': score,
                    'prob': prob,
                    'is_season_match': is_season_match,
                    'temp_suitability': temp_suit
                })
            
            # Sort by score (season-matched crops will be at top)
            all_scores.sort(key=lambda x: (x['is_season_match'], x['score']), reverse=True)
            
            # Build recommendations
            for item in all_scores[:10]:  # Check top 10
                crop = item['crop']
                score = item['score']
                is_season_match = item['is_season_match']
                
                if score < 30:
                    continue
                
                yield_pred = self._predict_yield(crop, features)
                explanation = self._generate_explanation(crop, features, score, is_season_match)
                env_factors = self._calculate_environmental_factors(crop, features)
                
                recommendations.append({
                    'cropName': crop,
                    'suitabilityScore': round(score, 1),
                    'yieldPrediction': yield_pred,
                    'explanation': explanation,
                    'environmentalFactors': env_factors,
                    'seasonMatch': is_season_match
                })
            
        except Exception as e:
            print(f"ML prediction error: {e}")
            return self._fallback_predictions(features, season_crops)
        
        # Ensure we have at least some recommendations
        if len(recommendations) < 3:
            fallback = self._fallback_predictions(features, season_crops)
            existing_crops = {r['cropName'] for r in recommendations}
            for fb in fallback:
                if fb['cropName'] not in existing_crops:
                    recommendations.append(fb)
        
        # Sort by score and return top 5
        recommendations.sort(key=lambda x: x['suitabilityScore'], reverse=True)
        return recommendations[:5]
    
    def _fallback_predictions(self, features: Dict, season_crops: set) -> List[Dict]:
        """Rule-based fallback predictions."""
        recommendations = []
        season = features.get('season', 'KHARIF').upper()
        temperature = features.get('avg_temperature', 25)
        
        for crop in season_crops:
            temp_suit = self._calculate_temp_suitability(crop, temperature)
            score = 50 + (temp_suit * 40)  # 50-90 base score
            
            yield_pred = self._predict_yield(crop, features)
            explanation = self._generate_explanation(crop, features, score, True)
            env_factors = self._calculate_environmental_factors(crop, features)
            
            recommendations.append({
                'cropName': crop,
                'suitabilityScore': round(score, 1),
                'yieldPrediction': yield_pred,
                'explanation': explanation,
                'environmentalFactors': env_factors,
                'seasonMatch': True
            })
        
        recommendations.sort(key=lambda x: x['suitabilityScore'], reverse=True)
        return recommendations[:5]


# Wrapper for backward compatibility
class CropPredictor(CropPredictorV3):
    """Backward compatible wrapper that uses V3 predictor."""
    pass
