import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "AI service is running"}

def test_symptom_analysis_low_risk():
    payload = {
        "symptoms": ["mild headache"],
        "age": 25,
        "gender": "female",
        "duration_days": 1
    }
    response = client.post("/api/v1/symptoms/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] == "LOW"
    assert "disclaimer" in data

def test_symptom_analysis_critical_emergency():
    payload = {
        "symptoms": ["chest pain", "shortness of breath"],
        "age": 55,
        "gender": "male",
        "duration_days": 1
    }
    response = client.post("/api/v1/symptoms/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] == "CRITICAL"
    assert data["emergency_warning"] is True

def test_risk_score_evaluation():
    payload = {
        "age": 45,
        "bmi": 29.5,
        "blood_pressure_sys": 135,
        "blood_pressure_dia": 88,
        "glucose_mg_dl": 115.0,
        "smoker": True,
        "existing_conditions": ["Hypertension"]
    }
    response = client.post("/api/v1/health/risk-score", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    assert data["risk_category"] in ["LOW", "MODERATE", "HIGH"]

def test_document_summarization():
    payload = {
        "document_text": "Patient Glucose is 145 mg/dL. BP is 135/85 mmHg.",
        "document_type": "LAB_REPORT"
    }
    response = client.post("/api/v1/documents/summarize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["important_findings"]) > 0
    assert len(data["abnormal_values"]) > 0
