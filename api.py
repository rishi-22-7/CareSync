import os
from datetime import time
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional, List
import bcrypt
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
from database import SessionLocal
from models import Caretaker, Patient, Medication, Schedule

load_dotenv()

# ── Cloudinary configuration ──
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


app = FastAPI(title="CareSync API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# ===== Pydantic Schemas =====

class AdminCreate(BaseModel):
    name: str
    email: str
    password: str


class AdminLogin(BaseModel):
    email: str
    password: str


class PatientCreate(BaseModel):
    caretaker_id: int
    name: str
    whatsapp_number: str
    preferred_language: str


class PatientUpdate(BaseModel):
    whatsapp_number: Optional[str] = None
    preferred_language: Optional[str] = None


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


# ===== Dependency =====

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _build_medication_data(schedules: List[ScheduleSlot]):
    """Helper to build quantity string and instruction from schedule slots."""
    slot_order = ["Pre-Breakfast", "Morning", "Afternoon", "Night"]
    active_labels = {s.label for s in schedules}
    quantity_str = "-".join("1" if slot in active_labels else "0" for slot in slot_order)
    instructions = list({s.instruction for s in schedules})
    instruction_str = ", ".join(instructions) if instructions else None
    return quantity_str, instruction_str


def _create_schedules(db: Session, medication_id: int, schedules: List[ScheduleSlot]):
    """Helper to create schedule rows from slots."""
    created = []
    for slot in schedules:
        try:
            parts = slot.time.split(":")
            t = time(int(parts[0]), int(parts[1]))
        except Exception:
            t = time(9, 0)
        new_schedule = Schedule(
            medication_id=medication_id, 
            trigger_time=t,
            label=slot.label,
            instruction=slot.instruction
        )
        db.add(new_schedule)
        db.commit()
        db.refresh(new_schedule)
        created.append({
            "id": new_schedule.id, 
            "label": slot.label, 
            "time": slot.time,
            "instruction": slot.instruction,
            "trigger_time": str(new_schedule.trigger_time)
        })
    return created


# ===== Upload Route =====

@app.post("/upload-image")
async def upload_image(image: UploadFile = File(...)):
    """Uploads an image directly to Cloudinary and returns the permanent secure URL."""
    result = cloudinary.uploader.upload(image.file, resource_type="image")
    return {"image_url": result.get("secure_url")}


# ===== Admin Auth Routes =====

@app.post("/admin/register")
def register_admin(body: AdminCreate, db: Session = Depends(get_db)):
    existing = db.query(Caretaker).filter(Caretaker.email == body.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    hashed = bcrypt.hashpw(body.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    admin = Caretaker(name=body.name, email=body.email, password_hash=hashed)
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return {"admin_id": admin.id, "name": admin.name}


@app.post("/admin/login")
def login_admin(body: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Caretaker).filter(Caretaker.email == body.email).first()
    if not admin or not bcrypt.checkpw(body.password.encode("utf-8"), admin.password_hash.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return {"admin_id": admin.id, "name": admin.name}


# ===== GET Routes =====

@app.get("/")
def root():
    return {"message": "CareSync API is live!"}


@app.get("/patients/{admin_id}")
def get_patients(admin_id: int, db: Session = Depends(get_db)):
    patients = db.query(Patient).filter(Patient.caretaker_id == admin_id).all()
    return [
        {
            "id": p.id, "caretaker_id": p.caretaker_id, "name": p.name,
            "whatsapp_number": p.whatsapp_number, "preferred_language": p.preferred_language,
        }
        for p in patients
    ]


@app.get("/medications/{patient_id}")
def get_medications(patient_id: int, db: Session = Depends(get_db)):
    medications = db.query(Medication).filter(Medication.patient_id == patient_id).all()
    result = []
    for m in medications:
        med_data = {
            "id": m.id, "patient_id": m.patient_id, "name": m.name, "type": m.type,
            "quantity": m.quantity, "instruction": m.instruction, "pill_image_url": m.pill_image_url,
            "dosage_quantity": m.dosage_quantity,
            "schedules": [
                {
                    "id": s.id,
                    "label": s.label,
                    "time": str(s.trigger_time),
                    "instruction": s.instruction,
                }
                for s in m.schedules
            ]
        }
        result.append(med_data)
    return result


# ===== POST Routes =====

@app.post("/patients")
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
        "patient": {"id": new_patient.id, "name": new_patient.name,
                    "whatsapp_number": new_patient.whatsapp_number, "preferred_language": new_patient.preferred_language},
    }


@app.post("/medications")
def create_medication(medication: MedicationCreate, db: Session = Depends(get_db)):
    quantity_str, instruction_str = _build_medication_data(medication.schedules)
    new_medication = Medication(
        patient_id=medication.patient_id, name=medication.name, type=medication.type,
        quantity=quantity_str, instruction=instruction_str, pill_image_url=medication.pill_image_url,
        dosage_quantity=medication.dosage_quantity,
    )
    db.add(new_medication)
    db.commit()
    db.refresh(new_medication)

    created_schedules = _create_schedules(db, new_medication.id, medication.schedules)

    return {
        "message": "Medication and schedules created successfully!",
        "medication": {"id": new_medication.id, "name": new_medication.name, "type": new_medication.type,
                       "quantity": quantity_str, "instruction": instruction_str, "pill_image_url": new_medication.pill_image_url,
                       "dosage_quantity": new_medication.dosage_quantity},
        "schedules": created_schedules,
    }


# ===== PUT Routes =====

@app.put("/patients/{patient_id}")
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
        "patient": {"id": patient.id, "name": patient.name,
                    "whatsapp_number": patient.whatsapp_number, "preferred_language": patient.preferred_language},
    }


@app.put("/medications/{medication_id}")
def update_medication(medication_id: int, update: MedicationUpdate, db: Session = Depends(get_db)):
    medication = db.query(Medication).filter(Medication.id == medication_id).first()
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    quantity_str, instruction_str = _build_medication_data(update.schedules)
    medication.name = update.name
    medication.type = update.type
    medication.quantity = quantity_str
    medication.instruction = instruction_str
    medication.pill_image_url = update.pill_image_url
    medication.dosage_quantity = update.dosage_quantity

    # Delete old schedules and create new ones
    db.query(Schedule).filter(Schedule.medication_id == medication_id).delete()
    db.commit()

    created_schedules = _create_schedules(db, medication_id, update.schedules)

    db.refresh(medication)
    return {
        "message": "Medication updated successfully!",
        "medication": {"id": medication.id, "name": medication.name, "type": medication.type,
                       "quantity": quantity_str, "instruction": instruction_str, "pill_image_url": medication.pill_image_url,
                       "dosage_quantity": medication.dosage_quantity},
        "schedules": created_schedules,
    }


# ===== DELETE Routes =====

@app.delete("/patients/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return {"message": f"Patient '{patient.name}' and all related data deleted successfully."}


@app.delete("/medications/{medication_id}")
def delete_medication(medication_id: int, db: Session = Depends(get_db)):
    medication = db.query(Medication).filter(Medication.id == medication_id).first()
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")
    db.delete(medication)
    db.commit()
    return {"message": f"Medication '{medication.name}' deleted successfully."}
