import os
from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv(override=True)

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


def send_reminder(patient_name, medicine_name, dosage, instruction, image_url, to_number, message_body=None):
    """
    Send a WhatsApp medication reminder via Twilio.
    If message_body is provided, it is used as-is (e.g., already translated).
    Otherwise, an English message is constructed.
    """
    if message_body is None:
        message_body = (
            f"💊 *Medication Reminder for {patient_name}*\n\n"
            f"Medicine: {medicine_name}\n"
            f"Dosage: {dosage}\n"
            f"Instruction: {instruction}\n\n"
            f"Please ensure the medication is taken on time. Stay healthy! 🌟"
        )

    to_whatsapp = to_number if to_number.startswith("whatsapp:") else f"whatsapp:{to_number}"
    from_whatsapp = TWILIO_WHATSAPP_NUMBER if TWILIO_WHATSAPP_NUMBER.startswith("whatsapp:") else f"whatsapp:{TWILIO_WHATSAPP_NUMBER}"

    message = client.messages.create(
        body=message_body,
        from_=from_whatsapp,
        to=to_whatsapp,
        media_url=[image_url],
    )
    return message
