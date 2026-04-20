from sqlalchemy import Column, Integer, String, Time, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Caretaker(Base):
    __tablename__ = "caretakers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    # Relationship: a caretaker has many patients
    patients = relationship("Patient", back_populates="caretaker", cascade="all, delete-orphan")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    caretaker_id = Column(Integer, ForeignKey("caretakers.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    whatsapp_number = Column(String(30), nullable=False)
    preferred_language = Column(String(50), nullable=False)

    # Relationships
    caretaker = relationship("Caretaker", back_populates="patients")
    medications = relationship("Medication", back_populates="patient", cascade="all, delete-orphan")


class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)
    quantity = Column(String(100), nullable=False)
    dosage_quantity = Column(String(255), nullable=True)
    instruction = Column(String(500), nullable=True)
    pill_image_url = Column(String(500), nullable=True)

    # Relationships
    patient = relationship("Patient", back_populates="medications")
    schedules = relationship("Schedule", back_populates="medication", cascade="all, delete-orphan")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(Integer, ForeignKey("medications.id", ondelete="CASCADE"), nullable=False)
    label = Column(String(100), nullable=True)  # e.g., 'Morning', 'Afternoon'
    trigger_time = Column(Time, nullable=False)
    instruction = Column(String(255), nullable=True)  # e.g., 'Before Food', 'After Food'

    # Relationship
    medication = relationship("Medication", back_populates="schedules")
