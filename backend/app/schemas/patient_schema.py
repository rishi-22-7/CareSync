from pydantic import BaseModel
from typing import Optional


class PatientCreate(BaseModel):
    caretaker_id: int
    name: str
    whatsapp_number: str
    preferred_language: str


class PatientUpdate(BaseModel):
    whatsapp_number: Optional[str] = None
    preferred_language: Optional[str] = None
