import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from typing import Dict, Any, Tuple

class HealthRiskMLModel:

    def __init__(self):
        self.scaler = StandardScaler()
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=5,
            random_state=42,
            class_weight="balanced" # Gives higher penalty to misclassifying high risk cases (reduces false negatives)
        )
        self.is_trained = False
        self._train_synthetic_baseline()

    def _train_synthetic_baseline(self):
        """
        Trains baseline Random Forest model on synthesized clinical dataset.
        Features: [Age, BMI, Systolic BP, Diastolic BP, Glucose (mg/dL), Smoker (0/1), Condition Count]
        Target: Risk Category (0 = LOW, 1 = MODERATE, 2 = HIGH)
        """
        np.random.seed(42)
        n_samples = 1200

        age = np.random.randint(18, 85, n_samples)
        bmi = np.random.uniform(18.5, 42.0, n_samples)
        sys_bp = np.random.randint(90, 180, n_samples)
        dia_bp = np.random.randint(60, 110, n_samples)
        glucose = np.random.uniform(70, 220, n_samples)
        smoker = np.random.choice([0, 1], size=n_samples, p=[0.75, 0.25])
        conditions = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.5, 0.3, 0.15, 0.05])

        X_raw = np.column_stack([age, bmi, sys_bp, dia_bp, glucose, smoker, conditions])

        # Clinical rule heuristic for synthetic targets
        risk_scores = (
            (age > 60) * 15 +
            (bmi > 30) * 20 + (bmi > 25) * 10 +
            (sys_bp > 140) * 25 + (sys_bp > 130) * 15 +
            (glucose > 140) * 25 + (glucose > 100) * 10 +
            smoker * 15 +
            conditions * 15
        )

        y = np.zeros(n_samples, dtype=int)
        y[risk_scores >= 50] = 2 # HIGH
        y[(risk_scores >= 25) & (risk_scores < 50)] = 1 # MODERATE

        X_scaled = self.scaler.fit_transform(X_raw)
        self.model.fit(X_scaled, y)
        self.is_trained = True

    def predict_risk(self, age: int, bmi: float, sys_bp: int, dia_bp: int, glucose: float, smoker: bool, condition_count: int) -> Tuple[float, str, Dict[str, float]]:
        features = np.array([[age, bmi, sys_bp, dia_bp, glucose, 1 if smoker else 0, condition_count]])
        scaled_features = self.scaler.transform(features)

        probabilities = self.model.predict_proba(scaled_features)[0]
        # Class 0: LOW, Class 1: MODERATE, Class 2: HIGH
        p_low = probabilities[0] if len(probabilities) > 0 else 0.0
        p_mod = probabilities[1] if len(probabilities) > 1 else 0.0
        p_high = probabilities[2] if len(probabilities) > 2 else 0.0

        # Weighted risk score 0 to 100
        risk_score = round(float(p_mod * 50.0 + p_high * 100.0), 1)

        if risk_score >= 60.0 or p_high > 0.4:
            category = "HIGH"
        elif risk_score >= 30.0 or p_mod > 0.4:
            category = "MODERATE"
        else:
            category = "LOW"

        prob_dict = {"LOW": round(p_low, 2), "MODERATE": round(p_mod, 2), "HIGH": round(p_high, 2)}
        return risk_score, category, prob_dict

# Singleton model instance
health_ml_model = HealthRiskMLModel()
