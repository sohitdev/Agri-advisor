"""Detailed Model Evaluation Script"""
import numpy as np
import json
import pickle
from sklearn.metrics import accuracy_score, top_k_accuracy_score, r2_score, mean_squared_error
from sklearn.model_selection import train_test_split

# Load data
X = np.load('app/data/X_features.npy')
y_crop = np.load('app/data/y_crop.npy')
y_yield = np.load('app/data/y_yield.npy')

with open('app/models/trained/encoders.json') as f:
    encoders = json.load(f)

with open('app/models/trained/crop_classifier.pkl', 'rb') as f:
    classifier = pickle.load(f)

with open('app/models/trained/yield_regressor.pkl', 'rb') as f:
    regressor = pickle.load(f)

with open('app/models/trained/scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

# Scale and split
X_scaled = scaler.transform(X)
X_train, X_test, y_crop_train, y_crop_test, y_yield_train, y_yield_test = train_test_split(
    X_scaled, y_crop, y_yield, test_size=0.2, random_state=42
)

# Crop Classifier Predictions
y_pred = classifier.predict(X_test)
y_proba = classifier.predict_proba(X_test)

# Yield Predictor
valid_mask = np.isfinite(y_yield_test) & (y_yield_test > 0)
y_yield_pred = regressor.predict(X_test[valid_mask])
y_yield_actual = np.log1p(y_yield_test[valid_mask])

num_classes = len(encoders['crop_classes'])
all_labels = list(range(num_classes))

print('=' * 60)
print('AGRI-ADVISOR MODEL EVALUATION')
print('=' * 60)

print(f'\n📁 Dataset Statistics:')
print(f'   Total samples: {len(y_crop):,}')
print(f'   Training set: {len(y_crop_train):,}')
print(f'   Test set: {len(y_crop_test):,}')
print(f'   Number of crops: {num_classes}')

print(f'\n🌾 CROP CLASSIFIER ACCURACY:')
print(f'   ├─ Top-1 Accuracy: {accuracy_score(y_crop_test, y_pred)*100:.2f}%')
print(f'   ├─ Top-3 Accuracy: {top_k_accuracy_score(y_crop_test, y_proba, k=3, labels=all_labels)*100:.2f}%')
print(f'   └─ Top-5 Accuracy: {top_k_accuracy_score(y_crop_test, y_proba, k=5, labels=all_labels)*100:.2f}%')

print(f'\n📈 YIELD PREDICTOR ACCURACY:')
r2 = r2_score(y_yield_actual, y_yield_pred)
rmse = np.sqrt(mean_squared_error(y_yield_actual, y_yield_pred))
print(f'   ├─ R² Score: {r2:.4f} ({r2*100:.2f}%)')
print(f'   └─ RMSE: {rmse:.4f}')

print(f'\n💡 INTERPRETATION:')
random_accuracy = 100 / num_classes
improvement = (accuracy_score(y_crop_test, y_pred) * 100) / random_accuracy
top5_acc = top_k_accuracy_score(y_crop_test, y_proba, k=5, labels=all_labels) * 100
print(f'   • Random chance: {random_accuracy:.2f}%')
print(f'   • Your model is {improvement:.1f}x better than random guessing')
print(f'   • Top-5 accuracy means the correct crop appears in')
print(f'     your top 5 recommendations {top5_acc:.1f}% of the time')

print(f'\n✅ MODEL QUALITY ASSESSMENT:')
if top5_acc >= 50:
    print(f'   🟢 Good - Correct crop in top 5 over half the time')
elif top5_acc >= 30:
    print(f'   🟡 Fair - Model provides useful recommendations')
else:
    print(f'   🔴 Needs improvement - Consider more training data')

if r2 >= 0.5:
    print(f'   🟢 Yield prediction is reliable (R² > 0.5)')
else:
    print(f'   🟡 Yield prediction is approximate')

print('\n' + '=' * 60)
