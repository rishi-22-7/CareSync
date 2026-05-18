from pydantic import BaseModel
from typing import Optional, List


class ScheduleSlot(BaseModel):
    label: str
    time: str
    instruction: str


class MedicationCreate(BaseModel):
    patient_id: int
    name: str
    type: str
    pill_image_url: Optional[str] = None
    dosage_quantity: Optional[str] = None
    schedules: List[ScheduleSlot] = []


class MedicationUpdate(BaseModel):
    name: str
    type: str
    pill_image_url: Optional[str] = None
    dosage_quantity: Optional[str] = None
    schedules: List[ScheduleSlot] = []
