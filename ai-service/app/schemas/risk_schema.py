from pydantic import BaseModel, Field
from typing import List, Optional

class RiskAssessmentRequest(BaseModel):
    age: int = Field(..., ge=0, le=120, example=45)
    bmi: Optional[float] = Field(default=None, example=28.5)
    blood_pressure_sys: Optional[int] = Field(default=120, example=135)
    blood_pressure_dia: Optional[int] = Field(default=80, example=88)
    glucose_mg_dl: Optional[float] = Field(default=95.0, example=110.0)
    smoker: Optional[bool] = Field(default=False)
    existing_conditions: Optional[List[str]] = Field(default_factory=list)

class RiskAssessmentResponse(BaseModel):
    risk_score: float = Field(..., example=34.5) # 0 to 100
    risk_category: str = Field(..., example="MODERATE") # LOW, MODERATE, HIGH
    important_factors: List[str] = Field(default_factory=list)
    recommended_action: str = Field(...)
    confidence: float = Field(..., example=0.88)
    disclaimer: str = Field(
        default="Preliminary risk assessment based on clinical guidelines. Not a diagnostic tool."
    )
