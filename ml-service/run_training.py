"""
Agri-Advisor ML Training Pipeline
Run this script to prepare data and train the crop recommendation models.

Usage:
    python run_training.py
    
This will:
1. Process crop_production.csv (historical data 1997-2023)
2. Process soil.csv (micronutrient data)
3. Process data_core.csv (environmental conditions)
4. Train crop classifier (RandomForest)
5. Train yield predictor (GradientBoosting)
6. Save models to app/models/trained/
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def main():
    print("=" * 70)
    print("    AGRI-ADVISOR ML TRAINING PIPELINE")
    print("    Training models with your agricultural data")
    print("=" * 70)
    
    # Step 1: Prepare training data
    print("\n📊 STEP 1: Preparing Training Data...")
    print("-" * 50)
    
    try:
        from app.data.prepare_training_data import main as prepare_data
        prepare_data()
        print("✅ Data preparation complete!")
    except Exception as e:
        print(f"❌ Error in data preparation: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Step 2: Train models
    print("\n🤖 STEP 2: Training ML Models...")
    print("-" * 50)
    
    try:
        from app.models.train_model import main as train_models
        train_models()
        print("✅ Model training complete!")
    except Exception as e:
        print(f"❌ Error in model training: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n" + "=" * 70)
    print("🎉 TRAINING PIPELINE COMPLETE!")
    print("=" * 70)
    print("\nYour trained models are saved in: app/models/trained/")
    print("\nTo start the ML service, run:")
    print("    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
    print("\n" + "=" * 70)
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
