from sqlalchemy import Column, Integer, String, Time, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(Integer, ForeignKey("medications.id", ondelete="CASCADE"), nullable=False)
    label = Column(String(100), nullable=True)
    trigger_time = Column(Time, nullable=False)
    instruction = Column(String(255), nullable=True)

    medication = relationship("Medication", back_populates="schedules")
