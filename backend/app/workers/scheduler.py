import os
from datetime import datetime, timezone, timedelta
from apscheduler.schedulers.blocking import BlockingScheduler

from app.core.database import SessionLocal
from app.models.patient import Patient
from app.models.medication import Medication
from app.models.schedule import Schedule
from app.services.notification_service import send_reminder
from deep_translator import GoogleTranslator

LANG_MAP = {
    "Hindi": "hi", "Telugu": "te", "Tamil": "ta",
    "Malayalam": "ml", "Kannada": "kn",
}


def check_schedules():
    """Check for medication schedules matching the current time and send WhatsApp reminders."""
    try:
        tz_offset = float(os.getenv("TZ_OFFSET", "5.5"))
    except (ValueError, TypeError):
        tz_offset = 5.5
    
    local_tz = timezone(timedelta(hours=tz_offset))
    now = datetime.now(local_tz).strftime("%H:%M")
    
    db = SessionLocal()
    try:
        schedules = db.query(Schedule).all()
        matching = [s for s in schedules if s.trigger_time.strftime("%H:%M") == now]
        print(f"Checking schedules at {now}... Found {len(matching)} reminders to send.")

        for schedule in matching:
            medication = db.query(Medication).filter(Medication.id == schedule.medication_id).first()
            patient = db.query(Patient).filter(Patient.id == medication.patient_id).first()
            print(f"Sending reminder to {patient.name} for {medication.name}...")

            dosage_info = medication.dosage_quantity or medication.quantity or "As prescribed"
            current_instruction = schedule.instruction or "As prescribed"

            message_body = (
                f"💊 *Medication Reminder for {patient.name}*\n\n"
                f"Medicine: {medication.name}\n"
                f"Dosage: {dosage_info}\n"
                f"Instructions: {current_instruction}\n\n"
                f"Please ensure the medication is taken on time. Stay healthy! 🌟"
            )

            patient_lang = getattr(patient, "preferred_language", "English")
            if patient_lang in LANG_MAP:
                try:
                    dest_code = LANG_MAP[patient_lang]
                    message_body = GoogleTranslator(source="auto", target=dest_code).translate(message_body)
                    print(f"Translated message to {patient_lang}")
                except Exception as e:
                    print(f"Translation failed, falling back to English: {e}")

            send_reminder(
                patient_name=patient.name,
                medicine_name=medication.name,
                dosage=medication.quantity,
                instruction=current_instruction,
                image_url=medication.pill_image_url,
                to_number=patient.whatsapp_number,
                message_body=message_body,
            )
            print(f"Reminder sent to {patient.name}!")

    except Exception as e:
        print(f"Error during schedule check: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    scheduler = BlockingScheduler()
    scheduler.add_job(check_schedules, trigger="interval", minutes=1)
    print("CareSync Scheduler is online. Listening for schedules...")
    try:
        scheduler.start()
    except KeyboardInterrupt:
        print("\nCareSync Scheduler shut down successfully.")
