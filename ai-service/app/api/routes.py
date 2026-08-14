from fastapi import APIRouter, HTTPException
from app.schemas.symptom_schema import SymptomRequest, SymptomResponse
from app.schemas.risk_schema import RiskAssessmentRequest, RiskAssessmentResponse
from app.schemas.document_schema import DocumentSummaryRequest, DocumentSummaryResponse
from app.services.symptom_checker import analyze_symptoms_service
from app.services.ml_risk_evaluator import evaluate_health_risk_service
from app.services.report_summarizer import summarize_medical_report_service

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "AI service is running"}

@router.post("/symptoms/analyze", response_model=SymptomResponse)
def analyze_symptoms(request: SymptomRequest):
    try:
        return analyze_symptoms_service(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Symptom analysis error: {str(e)}")

@router.post("/health/risk-score", response_model=RiskAssessmentResponse)
def evaluate_risk(request: RiskAssessmentRequest):
    try:
        return evaluate_health_risk_service(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk evaluation error: {str(e)}")

@router.post("/documents/summarize", response_model=DocumentSummaryResponse)
def summarize_document(request: DocumentSummaryRequest):
    try:
        return summarize_medical_report_service(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document summarization error: {str(e)}")
