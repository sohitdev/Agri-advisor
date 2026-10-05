"""
Test the improved v2 model predictions.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.models.predictor import CropPredictor

def main():
    print("="*60)
    print("TESTING IMPROVED V2 MODEL PREDICTIONS")
    print("="*60)
    
    # Initialize predictor
    predictor = CropPredictor()
    
    print(f"\nModel version: {getattr(predictor, 'model_version', 'unknown')}")
    print(f"ML model available: {predictor.use_ml_model}")
    
    # Test case 1: Punjab, Ludhiana, Kharif season
    print("\n" + "-"*60)
    print("Test 1: Punjab, Ludhiana - Kharif Season")
    print("-"*60)
    
    features = {
        'state': 'Punjab',
        'district': 'Ludhiana',
        'season': 'Kharif',
        'soil_nitrogen': 100,
        'soil_phosphorus': 30,
        'soil_potassium': 150,
        'avg_temperature': 32,
        'avg_humidity': 70,
        'soil_zn': 65,
        'soil_fe': 80,
        'soil_cu': 85,
        'soil_mn': 75,
        'soil_b': 60,
        'soil_s': 70
    }
    
    recommendations = predictor.predict(features)
    
    print(f"\nTop {len(recommendations)} Recommendations:")
    for i, rec in enumerate(recommendations, 1):
        print(f"\n{i}. {rec['cropName']}")
        print(f"   Suitability Score: {rec['suitabilityScore']}%")
        print(f"   Expected Yield: {rec['yieldPrediction'].get('expected', 'N/A')} {rec['yieldPrediction'].get('unit', '')}")
        print(f"   Explanation: {rec['explanation'][:100]}...")
    
    # Test case 2: Maharashtra, Pune, Rabi season
    print("\n" + "-"*60)
    print("Test 2: Maharashtra, Pune - Rabi Season")
    print("-"*60)
    
    features = {
        'state': 'Maharashtra',
        'district': 'Pune',
        'season': 'Rabi',
        'soil_nitrogen': 80,
        'soil_phosphorus': 25,
        'soil_potassium': 120,
        'avg_temperature': 22,
        'avg_humidity': 55,
        'soil_zn': 55,
        'soil_fe': 75,
        'soil_cu': 80,
        'soil_mn': 70,
        'soil_b': 55,
        'soil_s': 65
    }
    
    recommendations = predictor.predict(features)
    
    print(f"\nTop {len(recommendations)} Recommendations:")
    for i, rec in enumerate(recommendations, 1):
        print(f"\n{i}. {rec['cropName']}")
        print(f"   Suitability Score: {rec['suitabilityScore']}%")
        print(f"   Expected Yield: {rec['yieldPrediction'].get('expected', 'N/A')} {rec['yieldPrediction'].get('unit', '')}")
    
    # Test case 3: Uttar Pradesh, Varanasi
    print("\n" + "-"*60)
    print("Test 3: Uttar Pradesh, Varanasi - Kharif Season")
    print("-"*60)
    
    features = {
        'state': 'Uttar Pradesh',
        'district': 'Varanasi',
        'season': 'Kharif',
        'soil_nitrogen': 120,
        'soil_phosphorus': 35,
        'soil_potassium': 180,
        'avg_temperature': 35,
        'avg_humidity': 75,
    }
    
    recommendations = predictor.predict(features)
    
    print(f"\nTop {len(recommendations)} Recommendations:")
    for i, rec in enumerate(recommendations, 1):
        print(f"\n{i}. {rec['cropName']}")
        print(f"   Suitability Score: {rec['suitabilityScore']}%")
        print(f"   Expected Yield: {rec['yieldPrediction'].get('expected', 'N/A')} {rec['yieldPrediction'].get('unit', '')}")
    
    print("\n" + "="*60)
    print("✅ V2 MODEL TESTING COMPLETE")
    print("="*60)

if __name__ == "__main__":
    main()
