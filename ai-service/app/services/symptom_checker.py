from typing import List
from app.schemas.symptom_schema import SymptomRequest, SymptomResponse

EMERGENCY_KEYWORDS = [
    "chest pain", "shortness of breath", "difficulty breathing",
    "sudden numbness", "slurred speech", "loss of consciousness",
    "severe bleeding", "paralysis", "anaphylaxis", "stiff neck with fever"
]

SPECIALIST_MAPPING = {
    "cardiovascular": "Cardiologist",
    "respiratory": "Pulmonologist / ENT Specialist",
    "neurological": "Neurologist",
    "gastrointestinal": "Gastroenterologist",
    "dermatological": "Dermatologist",
    "musculoskeletal": "Orthopedist / Rheumatologist",
    "general_infection": "General Physician / Infectious Disease Specialist"
}

def analyze_symptoms_service(request: SymptomRequest) -> SymptomResponse:
    raw_symptoms = [s.lower().strip() for s in request.symptoms]

    # Check for emergency red flags
    emergency = any(kw in symptom for symptom in raw_symptoms for kw in EMERGENCY_KEYWORDS)
    if emergency:
        return SymptomResponse(
            risk_level="CRITICAL",
            possible_categories=["Cardiovascular / Respiratory Emergency"],
            recommended_specialist="Emergency Medical Services (Call 911 / Urgent Care)",
            recommended_action="SEEK IMMEDIATE EMERGENCY MEDICAL ATTENTION. Do not drive yourself.",
            confidence=0.95,
            emergency_warning=True
        )

    categories = set()
    risk_score = 0

    for symptom in raw_symptoms:
        if any(term in symptom for term in ["cough", "sore throat", "runny nose", "congestion", "wheezing", "shortness"]):
            categories.add("respiratory")
            risk_score += 15
        if any(term in symptom for term in ["chest pressure", "palpitations", "racing heart", "dizziness"]):
            categories.add("cardiovascular")
            risk_score += 25
        if any(term in symptom for term in ["headache", "migraine", "confusion", "dizziness", "seizure"]):
            categories.add("neurological")
            risk_score += 20
        if any(term in symptom for term in ["nausea", "vomiting", "diarrhea", "stomach pain", "acid reflux"]):
            categories.add("gastrointestinal")
            risk_score += 15
        if any(term in symptom for term in ["rash", "itching", "skin redness", "hives"]):
            categories.add("dermatological")
            risk_score += 10
        if any(term in symptom for term in ["fever", "chills", "fatigue", "body ache", "sweats"]):
            categories.add("general_infection")
            risk_score += 15

    # Duration multiplier
    if request.duration_days > 7:
        risk_score += 20
    elif request.duration_days > 3:
        risk_score += 10

    # Age vulnerability factor
    if request.age > 65 or request.age < 5:
        risk_score += 15

    # Category determination & specialist
    category_list = list(categories) if categories else ["General Symptom"]
    primary_category = category_list[0] if categories else "general_infection"
    specialist = SPECIALIST_MAPPING.get(primary_category, "General Physician")

    if risk_score >= 50:
        risk_level = "HIGH"
        recommended_action = f"Consult a {specialist} within 24-48 hours for a thorough examination."
        confidence = 0.88
    elif risk_score >= 25:
        risk_level = "MODERATE"
        recommended_action = f"Schedule an appointment with a {specialist}. Rest, hydrate, and monitor symptoms."
        confidence = 0.82
    else:
        risk_level = "LOW"
        recommended_action = "Maintain good hydration, rest, and observe symptoms. Consult a physician if symptoms persist or worsen."
        confidence = 0.78

    return SymptomResponse(
        risk_level=risk_level,
        possible_categories=category_list,
        recommended_specialist=specialist,
        recommended_action=recommended_action,
        confidence=confidence,
        emergency_warning=False
    )
