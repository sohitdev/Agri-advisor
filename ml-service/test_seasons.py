"""Test season-specific predictions"""
from app.models.predictor import CropPredictor

p = CropPredictor()
print(f"Model version: {p.model_version}")
print()

# Test Kharif (warm)
print("="*50)
print("KHARIF SEASON (30°C - Monsoon)")
print("="*50)
r = p.predict({
    'state': 'Uttar Pradesh', 
    'district': 'Ghaziabad', 
    'season': 'Kharif', 
    'avg_temperature': 30, 
    'soil_nitrogen': 100
})
for x in r[:5]:
    print(f"  {x['cropName']}: {x['suitabilityScore']}% (Season Match: {x.get('seasonMatch', 'N/A')})")
print()

# Test Rabi (cool)
print("="*50)
print("RABI SEASON (18°C - Winter crop)")
print("="*50)
r = p.predict({
    'state': 'Uttar Pradesh', 
    'district': 'Ghaziabad', 
    'season': 'Rabi', 
    'avg_temperature': 18, 
    'soil_nitrogen': 100
})
for x in r[:5]:
    print(f"  {x['cropName']}: {x['suitabilityScore']}% (Season Match: {x.get('seasonMatch', 'N/A')})")
print()

# Test Summer (hot)
print("="*50)
print("SUMMER SEASON (38°C - Hot)")
print("="*50)
r = p.predict({
    'state': 'Uttar Pradesh', 
    'district': 'Ghaziabad', 
    'season': 'Summer', 
    'avg_temperature': 38, 
    'soil_nitrogen': 100
})
for x in r[:5]:
    print(f"  {x['cropName']}: {x['suitabilityScore']}% (Season Match: {x.get('seasonMatch', 'N/A')})")
print()

# Test Winter (cold)
print("="*50)
print("WINTER SEASON (12°C - Cold)")
print("="*50)
r = p.predict({
    'state': 'Uttar Pradesh', 
    'district': 'Ghaziabad', 
    'season': 'Winter', 
    'avg_temperature': 12, 
    'soil_nitrogen': 100
})
for x in r[:5]:
    print(f"  {x['cropName']}: {x['suitabilityScore']}% (Season Match: {x.get('seasonMatch', 'N/A')})")
print()

# Test Autumn
print("="*50)
print("AUTUMN SEASON (25°C - Moderate)")
print("="*50)
r = p.predict({
    'state': 'Uttar Pradesh', 
    'district': 'Ghaziabad', 
    'season': 'Autumn', 
    'avg_temperature': 25, 
    'soil_nitrogen': 100
})
for x in r[:5]:
    print(f"  {x['cropName']}: {x['suitabilityScore']}% (Season Match: {x.get('seasonMatch', 'N/A')})")
