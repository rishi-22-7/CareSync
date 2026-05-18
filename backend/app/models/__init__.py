# Import all models so SQLAlchemy's Base is aware of them for table creation
from app.models.caretaker import Caretaker
from app.models.patient import Patient
from app.models.medication import Medication
from app.models.schedule import Schedule

__all__ = ["Caretaker", "Patient", "Medication", "Schedule"]
