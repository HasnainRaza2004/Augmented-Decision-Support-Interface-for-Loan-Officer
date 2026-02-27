import json
import os
import pandas as pd
import xgboost as xgb
import shap
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Augmented Decision Support API")

# --- CORS Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "data-science", "models", "model_mvp.json")
FEATURES_PATH = os.path.join(BASE_DIR, "data-science", "models", "model_features.json")

model = xgb.XGBClassifier()
feature_order = []
explainer = None  # Add explainer globally

@app.on_event("startup")
def load_ml_artifacts():
    global model, feature_order, explainer
    try:
        model.load_model(MODEL_PATH)
        with open(FEATURES_PATH, "r") as f:
            feature_names = json.load(f)
            feature_order = list(feature_names.values())
        
        # Initialize SHAP explainer
        explainer = shap.TreeExplainer(model)
        print("✅ ML Model, Features, and SHAP Explainer loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading artifacts: {e}")

class LoanApplication(BaseModel):
    AMT_INCOME_TOTAL: float
    AMT_CREDIT: float
    AMT_ANNUITY: float
    AMT_GOODS_PRICE: float
    DAYS_BIRTH: int
    DAYS_EMPLOYED: int
    CNT_FAM_MEMBERS: int
    EXT_SOURCE_1: float = 0.5
    EXT_SOURCE_2: float = 0.5
    EXT_SOURCE_3: float = 0.5

@app.get("/")
def read_root():
    return {"message": "API is running."}

@app.post("/predict")
def predict_risk(application: LoanApplication):
    if not feature_order:
        raise HTTPException(status_code=500, detail="Model not loaded correctly.")

    data_dict = application.dict()
    df = pd.DataFrame([data_dict])[feature_order]
    
    prob = model.predict_proba(df)[0][1]
    risk_category = "High" if prob > 0.10 else "Low"
    
    return {
        "default_probability": float(prob),
        "risk_category": risk_category,
    }

# --- NEW EXPLAINER ENDPOINT ---
@app.post("/explain")
def explain_risk(application: LoanApplication):
    if not explainer:
        raise HTTPException(status_code=500, detail="Explainer not initialized.")
        
    data_dict = application.dict()
    df = pd.DataFrame([data_dict])[feature_order]
    
    # Calculate SHAP values for this specific applicant
    shap_values = explainer.shap_values(df)
    
    # Package the results for the React frontend
    contributions = []
    for i, feature_name in enumerate(feature_order):
        contributions.append({
            "feature": feature_name,
            "value": float(df[feature_name].iloc[0]),
            "impact": float(shap_values[0][i]) # Positive = increases risk, Negative = decreases risk
        })
        
    # Sort by absolute impact so the highest driving factors are at the top
    contributions.sort(key=lambda x: abs(x["impact"]), reverse=True)
    
    return {
        "base_risk_value": float(explainer.expected_value),
        "top_drivers": contributions[:5] # Send the top 5 most important features
    }