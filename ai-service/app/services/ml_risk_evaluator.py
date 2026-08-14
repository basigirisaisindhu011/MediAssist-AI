from app.schemas.risk_schema import RiskAssessmentRequest, RiskAssessmentResponse
from app.models.ml_model import health_ml_model

def evaluate_health_risk_service(request: RiskAssessmentRequest) -> RiskAssessmentResponse:
    bmi = request.bmi if request.bmi is not None else 24.0
    sys_bp = request.blood_pressure_sys if request.blood_pressure_sys is not None else 120
    dia_bp = request.blood_pressure_dia if request.blood_pressure_dia is not None else 80
    glucose = request.glucose_mg_dl if request.glucose_mg_dl is not None else 95.0
    smoker = request.smoker if request.smoker is not None else False
    conditions = request.existing_conditions if request.existing_conditions else []

    # Run ML Model inference
    risk_score, category, probabilities = health_ml_model.predict_risk(
        age=request.age,
        bmi=bmi,
        sys_bp=sys_bp,
        dia_bp=dia_bp,
        glucose=glucose,
        smoker=smoker,
        condition_count=len(conditions)
    )

    important_factors = []
    if request.age > 60:
        important_factors.append(f"Age ({request.age} years)")
    if bmi > 25.0:
        important_factors.append(f"BMI ({bmi} kg/m² - Overweight/Obese)")
    if sys_bp >= 130 or dia_bp >= 85:
        important_factors.append(f"Elevated Blood Pressure ({sys_bp}/{dia_bp} mmHg)")
    if glucose >= 100.0:
        important_factors.append(f"Elevated Fasting Glucose ({glucose} mg/dL)")
    if smoker:
        important_factors.append("Active Tobacco Smoking")
    if conditions:
        important_factors.append(f"Pre-existing Conditions ({', '.join(conditions)})")

    if not important_factors:
        important_factors.append("Normal baseline biometrics within target ranges")

    if category == "HIGH":
        recommended_action = "High preliminary risk detected. Schedule a comprehensive clinical health evaluation with your physician."
    elif category == "MODERATE":
        recommended_action = "Moderate risk factors present. Consider lifestyle modifications (diet, exercise) and annual medical checkups."
    else:
        recommended_action = "Low preliminary risk. Continue maintaining healthy lifestyle habits and routine preventive care."

    return RiskAssessmentResponse(
        risk_score=risk_score,
        risk_category=category,
        important_factors=important_factors,
        recommended_action=recommended_action,
        confidence=0.89,
        disclaimer="Preliminary ML-based risk assessment based on biometric input. Not a diagnostic tool or substitute for medical examination."
    )
