from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler
from database import SessionLocal
from models import Patient, Medication, Schedule
from messenger import send_reminder
from deep_translator import GoogleTranslator

# Language mapping for translations
LANG_MAP = {'Hindi': 'hi', 'Telugu': 'te', 'Tamil': 'ta', 'Malayalam': 'ml', 'Kannada': 'kn'}




def check_schedules():
    """Check for medication schedules that match the current time and send reminders."""
    now = datetime.now().strftime("%H:%M")
    db = SessionLocal()

    try:
        # Query all schedules and filter by matching HH:MM
        schedules = db.query(Schedule).all()
        matching = [s for s in schedules if s.trigger_time.strftime("%H:%M") == now]

        print(f"⏰ Checking schedules at {now}... Found {len(matching)} reminders to send.")

        for schedule in matching:
            # Fetch medication and patient for this specific schedule
            medication = db.query(Medication).filter(Medication.id == schedule.medication_id).first()
            patient = db.query(Patient).filter(Patient.id == medication.patient_id).first()

            print(f"📤 Sending reminder to {patient.name} for {medication.name}...")

            # Get dosage info from the medication
            dosage_info = medication.dosage_quantity or medication.quantity or "As prescribed"
            
            # CRITICAL: Get instruction ONLY from the CURRENT schedule that matched the time
            # Do NOT use medication.instruction, do NOT combine with other schedules
            current_instruction = schedule.instruction if schedule.instruction else "As prescribed"
            
            # Build message with ONLY this schedule's instruction
            message_body = (
                f"💊 *Medication Reminder for {patient.name}*\n\n"
                f"Medicine: {medication.name}\n"
                f"Dosage: {dosage_info}\n"
                f"Instructions: {current_instruction}\n\n"
                f"Please ensure the medication is taken on time. Stay healthy! 🌟"
            )

            # Safely get the preferred_language, default to 'English' if it's missing
            patient_lang = getattr(patient, 'preferred_language', 'English')

            if patient_lang in LANG_MAP:
                try:
                    dest_code = LANG_MAP[patient_lang]
                    message_body = GoogleTranslator(source='auto', target=dest_code).translate(message_body)
                    print(f"✅ Translated message to {patient_lang}")
                except Exception as e:
                    print(f"⚠️ Translation failed, falling back to English: {e}")

            send_reminder(
                patient_name=patient.name,
                medicine_name=medication.name,
                dosage=medication.quantity,
                instruction=current_instruction,
                image_url=medication.pill_image_url,
                to_number=patient.whatsapp_number,
                message_body=message_body
            )

            print(f"✅ Reminder sent to {patient.name}!")

    except Exception as e:
        print(f"❌ Error during schedule check: {e}")

    finally:
        db.close()



if __name__ == "__main__":
    scheduler = BlockingScheduler()
    scheduler.add_job(check_schedules, trigger="interval", minutes=1)

    print("🚀 CareSync Engine is online. Listening for schedules...")
    try:
        scheduler.start()
    except KeyboardInterrupt:
        print("\n🛑 CareSync Engine shut down successfully.")
