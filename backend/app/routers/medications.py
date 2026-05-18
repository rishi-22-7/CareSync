from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.medication import Medication
from app.models.schedule import Schedule
from app.schemas.medication_schema import MedicationCreate, MedicationUpdate
from app.services import medication_service

router = APIRouter(tags=["Medications"])


@router.get("/medications/{patient_id}")
def get_medications(patient_id: int, db: Session = Depends(get_db)):
    medications = db.query(Medication).filter(Medication.patient_id == patient_id).all()
    return [
        {
            "id": m.id, "patient_id": m.patient_id, "name": m.name, "type": m.type,
            "quantity": m.quantity, "instruction": m.instruction,
            "pill_image_url": m.pill_image_url, "dosage_quantity": m.dosage_quantity,
            "schedules": [
                {"id": s.id, "label": s.label, "time": str(s.trigger_time), "instruction": s.instruction}
                for s in m.schedules
            ],
        }
        for m in medications
    ]


@router.post("/medications")
def create_medication(medication: MedicationCreate, db: Session = Depends(get_db)):
    quantity_str, instruction_str = medication_service.build_medication_data(medication.schedules)
    new_medication = Medication(
        patient_id=medication.patient_id, name=medication.name, type=medication.type,
        quantity=quantity_str, instruction=instruction_str,
        pill_image_url=medication.pill_image_url, dosage_quantity=medication.dosage_quantity,
    )
    db.add(new_medication)
    db.commit()
    db.refresh(new_medication)
    created_schedules = medication_service.create_schedules(db, new_medication.id, medication.schedules)
    return {
        "message": "Medication and schedules created successfully!",
        "medication": {
            "id": new_medication.id, "name": new_medication.name, "type": new_medication.type,
            "quantity": quantity_str, "instruction": instruction_str,
            "pill_image_url": new_medication.pill_image_url, "dosage_quantity": new_medication.dosage_quantity,
        },
        "schedules": created_schedules,
    }


@router.put("/medications/{medication_id}")
def update_medication(medication_id: int, update: MedicationUpdate, db: Session = Depends(get_db)):
    medication = db.query(Medication).filter(Medication.id == medication_id).first()
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")
    quantity_str, instruction_str = medication_service.build_medication_data(update.schedules)
    medication.name = update.name
    medication.type = update.type
    medication.quantity = quantity_str
    medication.instruction = instruction_str
    medication.pill_image_url = update.pill_image_url
    medication.dosage_quantity = update.dosage_quantity
    db.query(Schedule).filter(Schedule.medication_id == medication_id).delete()
    db.commit()
    created_schedules = medication_service.create_schedules(db, medication_id, update.schedules)
    db.refresh(medication)
    return {
        "message": "Medication updated successfully!",
        "medication": {
            "id": medication.id, "name": medication.name, "type": medication.type,
            "quantity": quantity_str, "instruction": instruction_str,
            "pill_image_url": medication.pill_image_url, "dosage_quantity": medication.dosage_quantity,
        },
        "schedules": created_schedules,
    }


@router.delete("/medications/{medication_id}")
def delete_medication(medication_id: int, db: Session = Depends(get_db)):
    medication = db.query(Medication).filter(Medication.id == medication_id).first()
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")
    db.delete(medication)
    db.commit()
    return {"message": f"Medication '{medication.name}' deleted successfully."}
