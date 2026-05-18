from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.patient import Patient
from app.schemas.patient_schema import PatientCreate, PatientUpdate

router = APIRouter(tags=["Patients"])


@router.get("/patients/{admin_id}")
def get_patients(admin_id: int, db: Session = Depends(get_db)):
    patients = db.query(Patient).filter(Patient.caretaker_id == admin_id).all()
    return [
        {
            "id": p.id, "caretaker_id": p.caretaker_id, "name": p.name,
            "whatsapp_number": p.whatsapp_number, "preferred_language": p.preferred_language,
        }
        for p in patients
    ]


@router.post("/patients")
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    new_patient = Patient(
        caretaker_id=patient.caretaker_id, name=patient.name,
        whatsapp_number=patient.whatsapp_number, preferred_language=patient.preferred_language,
    )
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return {
        "message": "Patient created successfully!",
        "patient": {
            "id": new_patient.id, "name": new_patient.name,
            "whatsapp_number": new_patient.whatsapp_number,
            "preferred_language": new_patient.preferred_language,
        },
    }


@router.put("/patients/{patient_id}")
def update_patient(patient_id: int, update: PatientUpdate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    if update.whatsapp_number is not None:
        patient.whatsapp_number = update.whatsapp_number
    if update.preferred_language is not None:
        patient.preferred_language = update.preferred_language
    db.commit()
    db.refresh(patient)
    return {
        "message": "Patient updated successfully!",
        "patient": {
            "id": patient.id, "name": patient.name,
            "whatsapp_number": patient.whatsapp_number,
            "preferred_language": patient.preferred_language,
        },
    }


@router.delete("/patients/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return {"message": f"Patient '{patient.name}' and all related data deleted successfully."}
