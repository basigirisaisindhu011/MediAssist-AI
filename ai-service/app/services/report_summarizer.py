import re
from app.schemas.document_schema import DocumentSummaryRequest, DocumentSummaryResponse

def summarize_medical_report_service(request: DocumentSummaryRequest) -> DocumentSummaryResponse:
    text = request.document_text.strip()
    if not text:
        return DocumentSummaryResponse(
            important_findings=["No text provided"],
            abnormal_values=[],
            possible_attention_areas=[],
            summary="Empty document provided.",
            questions_for_doctor=["Could you re-upload the complete report?"]
        )

    lines = [line.strip() for line in text.split('\n') if line.strip()]
    findings = []
    abnormalities = []
    attention_areas = []

    # Regex patterns for clinical parameters
    glucose_match = re.search(r'(glucose|sugar)[:\s]+(\d+(\.\d+)?)', text, re.IGNORECASE)
    hba1c_match = re.search(r'(hba1c|a1c)[:\s]+(\d+(\.\d+)?)', text, re.IGNORECASE)
    bp_match = re.search(r'(bp|blood pressure)[:\s]+(\d+)/(\d+)', text, re.IGNORECASE)
    wbc_match = re.search(r'(wbc|white blood cell)[:\s]+(\d+(\.\d+)?)', text, re.IGNORECASE)
    cholesterol_match = re.search(r'(cholesterol|ldl)[:\s]+(\d+(\.\d+)?)', text, re.IGNORECASE)

    if glucose_match:
        val = float(glucose_match.group(2))
        findings.append(f"Glucose level detected: {val} mg/dL")
        if val > 100:
            abnormalities.append(f"Elevated Fasting Glucose: {val} mg/dL (Normal < 100 mg/dL)")
            attention_areas.append("Glycemic control & Diabetes screening")

    if hba1c_match:
        val = float(hba1c_match.group(2))
        findings.append(f"HbA1c level: {val}%")
        if val >= 5.7:
            abnormalities.append(f"Elevated HbA1c: {val}% (Normal < 5.7%)")
            attention_areas.append("Pre-diabetes or Diabetes management")

    if bp_match:
        sys = int(bp_match.group(2))
        dia = int(bp_match.group(3))
        findings.append(f"Blood pressure recorded: {sys}/{dia} mmHg")
        if sys >= 130 or dia >= 80:
            abnormalities.append(f"Elevated BP: {sys}/{dia} mmHg (Stage 1/2 Hypertension range)")
            attention_areas.append("Blood pressure monitoring")

    if cholesterol_match:
        val = float(cholesterol_match.group(2))
        findings.append(f"Cholesterol/LDL: {val} mg/dL")
        if val > 200:
            abnormalities.append(f"High Cholesterol: {val} mg/dL (Desirable < 200 mg/dL)")
            attention_areas.append("Lipid panel management & Cardiovascular health")

    if not findings:
        findings = lines[:min(3, len(lines))]

    summary_text = (
        f"Analyzed {request.document_type or 'Medical Report'}. "
        f"Extracted {len(findings)} key clinical parameter(s) and {len(abnormalities)} potential abnormality indicator(s)."
    )

    questions = [
        "What do these specific lab results mean for my overall health?",
        "Are any follow-up tests or re-assessments recommended?",
        "Do I need any dietary or medication adjustments based on these values?"
    ]

    return DocumentSummaryResponse(
        important_findings=findings,
        abnormal_values=abnormalities if abnormalities else ["No critical out-of-range values automatically detected"],
        possible_attention_areas=attention_areas if attention_areas else ["General routine health review"],
        summary=summary_text,
        questions_for_doctor=questions
    )
