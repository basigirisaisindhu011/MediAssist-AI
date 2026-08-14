from pydantic import BaseModel, Field
from typing import List, Optional

class DocumentSummaryRequest(BaseModel):
    document_text: str = Field(..., example="Patient exhibits elevated fasting glucose of 145 mg/dL and HbA1c of 7.2%.")
    document_type: Optional[str] = Field(default="LAB_REPORT")

class DocumentSummaryResponse(BaseModel):
    important_findings: List[str] = Field(default_factory=list)
    abnormal_values: List[str] = Field(default_factory=list)
    possible_attention_areas: List[str] = Field(default_factory=list)
    summary: str = Field(...)
    questions_for_doctor: List[str] = Field(default_factory=list)
    disclaimer: str = Field(
        default="AI report summarizer provides simplified explanations only. Verify with your physician."
    )
