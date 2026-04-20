import os
from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")  # e.g. +14155238886

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


def send_reminder(patient_name, medicine_name, dosage, instruction, image_url, to_number, message_body=None):
    """
    Send a WhatsApp medication reminder to the patient's caretaker.
    If message_body is provided, it will be used as is (e.g., already translated).
    Otherwise, the message will be constructed in English.
    """
    if message_body is None:
        message_body = (
            f"💊 *Medication Reminder for {patient_name}*\n\n"
            f"Medicine: {medicine_name}\n"
            f"Dosage: {dosage}\n"
            f"Instruction: {instruction}\n\n"
            f"Please ensure the medication is taken on time. Stay healthy! 🌟"
        )

    # Ensure both numbers have the whatsapp: prefix
    from_number = f"whatsapp:{TWILIO_WHATSAPP_NUMBER}"
    to_whatsapp = to_number if to_number.startswith("whatsapp:") else f"whatsapp:{to_number}"

    message = client.messages.create(
        body=message_body,
        from_='whatsapp:+14155238886',
        to=to_whatsapp,
        media_url=[image_url]
    )

    return message


if __name__ == "__main__":
    from database import SessionLocal
    from models import Patient, Medication

    db = SessionLocal()

    try:
        # Query real data from the database
        patient = db.query(Patient).filter(Patient.name == "Grandma Sharma").first()

        if not patient:
            print("❌ Patient 'Grandma Sharma' not found in the database.")
        else:
            medication = db.query(Medication).filter(
                Medication.patient_id == patient.id,
                Medication.name == "Vitamin D"
            ).first()

            if not medication:
                print("❌ Medication 'Vitamin D' not found for this patient.")
            else:
                print(f"📤 Sending reminder to {patient.name} at {patient.whatsapp_number}...")

                msg = send_reminder(
                    patient_name=patient.name,
                    medicine_name=medication.name,
                    dosage=medication.quantity,
                    instruction=medication.instruction,
                    image_url=medication.pill_image_url,
                    to_number=patient.whatsapp_number
                )

                print(f"✅ Message sent successfully! SID: {msg.sid}")

    except Exception as e:
        print(f"❌ Error: {e}")

    finally:
        db.close()
        print("Database session closed.")
