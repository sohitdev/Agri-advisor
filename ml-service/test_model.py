"""Test the trained crop prediction model."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.models.predictor import CropPredictor

def test_prediction():
    print("=" * 60)
    print("TESTING CROP PREDICTION MODEL")
    print("=" * 60)
    
    # Initialize predictor
    predictor = CropPredictor()
    print(f"\nML Models Loaded: {predictor.use_ml_model}")
    
    # Test case: Punjab, Ludhiana, Rabi season (typical wheat growing conditions)
    test_input = {
        'state': 'PUNJAB',
        'district': 'LUDHIANA',
        'season': 'RABI',
        'avg_temperature': 20,
        'avg_humidity': 60,
        'soil_nitrogen': 120,
        'soil_phosphorus': 30,
        'soil_potassium': 180,
        'soil_zn': 70,
        'soil_fe': 85,
        'soil_cu': 90,
        'soil_mn': 80
    }
    
    print(f"\nTest Input:")
    print(f"  Location: {test_input['state']}, {test_input['district']}")
    print(f"  Season: {test_input['season']}")
    print(f"  Temperature: {test_input['avg_temperature']}°C")
    print(f"  Humidity: {test_input['avg_humidity']}%")
    print(f"  NPK: N={test_input['soil_nitrogen']}, P={test_input['soil_phosphorus']}, K={test_input['soil_potassium']}")
    
    # Get predictions
    results = predictor.predict(test_input)
    
    print(f"\n{'='*60}")
    print("TOP CROP RECOMMENDATIONS")
    print("=" * 60)
    
    for i, rec in enumerate(results, 1):
        print(f"\n{i}. {rec['cropName']}")
        print(f"   Suitability Score: {rec['suitabilityScore']:.1f}/100")
        print(f"   Expected Yield: {rec['yieldPrediction']['expected']:.0f} {rec['yieldPrediction'].get('unit', 'kg/ha')}")
        print(f"   Yield Range: {rec['yieldPrediction']['min']:.0f} - {rec['yieldPrediction']['max']:.0f}")
        print(f"   {rec['explanation'][:100]}...")
        env = rec['environmentalFactors']
        print(f"   Environmental Match - Soil: {env['soilMatch']}%, Weather: {env['weatherMatch']}%, Historical: {env['historicalYield']}%")
    
    # Test Kharif season
    print("\n" + "=" * 60)
    print("TESTING KHARIF SEASON (Gujarat - Cotton Belt)")
    print("=" * 60)
    
    test_kharif = {
        'state': 'GUJARAT',
        'district': 'AHMEDABAD',
        'season': 'KHARIF',
        'avg_temperature': 30,
        'avg_humidity': 70,
        'soil_nitrogen': 80,
        'soil_phosphorus': 25,
        'soil_potassium': 150
    }
    
    results_kharif = predictor.predict(test_kharif)
    
    print(f"\nLocation: {test_kharif['state']}, {test_kharif['district']} | Season: {test_kharif['season']}")
    print("\nTop 5 Recommendations:")
    for i, rec in enumerate(results_kharif, 1):
        print(f"  {i}. {rec['cropName']} - Score: {rec['suitabilityScore']:.1f}, Yield: {rec['yieldPrediction']['expected']:.0f} kg/ha")
    
    print("\n" + "=" * 60)
    print("TEST COMPLETE!")
    print("=" * 60)

if __name__ == "__main__":
    test_prediction()
