from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    caretaker_id = Column(Integer, ForeignKey("caretakers.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    whatsapp_number = Column(String(30), nullable=False)
    preferred_language = Column(String(50), nullable=False)

    caretaker = relationship("Caretaker", back_populates="patients")
    medications = relationship("Medication", back_populates="patient", cascade="all, delete-orphan")
