from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


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

    patient = relationship("Patient", back_populates="medications")
    schedules = relationship("Schedule", back_populates="medication", cascade="all, delete-orphan")
