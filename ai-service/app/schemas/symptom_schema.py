from pydantic import BaseModel, Field
from typing import List, Optional

class SymptomRequest(BaseModel):
    symptoms: List[str] = Field(..., example=["fever", "cough", "headache"])
    age: int = Field(..., ge=0, le=120, example=25)
    gender: str = Field(..., example="female")
    duration_days: int = Field(default=1, ge=1, example=2)

class SymptomResponse(BaseModel):
    risk_level: str = Field(..., example="LOW") # LOW, MODERATE, HIGH, CRITICAL
    possible_categories: List[str] = Field(default_factory=list)
    recommended_specialist: str = Field(..., example="General Physician")
    recommended_action: str = Field(..., example="Rest, hydrate, and monitor symptoms.")
    confidence: float = Field(..., example=0.85)
    emergency_warning: bool = Field(default=False)
    disclaimer: str = Field(
        default="AI-generated information is for guidance only and not a medical diagnosis. Consult a qualified healthcare professional."
    )
