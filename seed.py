from datetime import time
from database import SessionLocal
from models import Caretaker, Patient, Medication, Schedule

db = SessionLocal()

try:
    # 1. Create the Caretaker
    caretaker = Caretaker(
        name="Test Admin",
        email="admin@test.com",
        password_hash="hashed_password"
    )
    db.add(caretaker)
    db.flush()  # Flush to get the caretaker.id before committing
    print(f"✅ Caretaker created: {caretaker.name} (ID: {caretaker.id})")

    # 2. Create the Patient
    patient = Patient(
        caretaker_id=caretaker.id,
        name="Grandma Sharma",
        whatsapp_number="whatsapp:+919866900980",
        preferred_language="English"
    )
    db.add(patient)
    db.flush()
    print(f"✅ Patient created: {patient.name} (ID: {patient.id})")

    # 3. Create the Medication
    medication = Medication(
        patient_id=patient.id,
        name="Vitamin D",
        type="Pill",
        quantity="60k IU",
        instruction="After Breakfast",
        pill_image_url="https://images.unsplash.com/photo-1584308666744-24d5e4a8c903?w=500&q=80"
    )
    db.add(medication)
    db.flush()
    print(f"✅ Medication created: {medication.name} (ID: {medication.id})")

    # 4. Create the Schedule
    schedule = Schedule(
        medication_id=medication.id,
        trigger_time=time(9, 0, 0)  # 09:00:00
    )
    db.add(schedule)
    db.flush()
    print(f"✅ Schedule created: trigger_time = {schedule.trigger_time} (ID: {schedule.id})")

    # Commit all changes
    db.commit()
    print("\n🎉 All test data seeded successfully!")

except Exception as e:
    db.rollback()
    print(f"❌ Error seeding data: {e}")

finally:
    db.close()
    print("Database session closed.")
