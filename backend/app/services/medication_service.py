from datetime import time
from sqlalchemy.orm import Session
from typing import List

from app.schemas.medication_schema import ScheduleSlot
from app.models.schedule import Schedule


def build_medication_data(schedules: List[ScheduleSlot]):
    """Build quantity string and combined instruction from schedule slots."""
    slot_order = ["Pre-Breakfast", "Morning", "Afternoon", "Night"]
    active_labels = {s.label for s in schedules}
    quantity_str = "-".join("1" if slot in active_labels else "0" for slot in slot_order)
    instructions = list({s.instruction for s in schedules})
    instruction_str = ", ".join(instructions) if instructions else None
    return quantity_str, instruction_str


def create_schedules(db: Session, medication_id: int, schedules: List[ScheduleSlot]):
    """Create Schedule rows in the database from a list of ScheduleSlots."""
    created = []
    for slot in schedules:
        try:
            parts = slot.time.split(":")
            t = time(int(parts[0]), int(parts[1]))
        except Exception:
            t = time(9, 0)

        new_schedule = Schedule(
            medication_id=medication_id,
            trigger_time=t,
            label=slot.label,
            instruction=slot.instruction,
        )
        db.add(new_schedule)
        db.commit()
        db.refresh(new_schedule)
        created.append({
            "id": new_schedule.id,
            "label": slot.label,
            "time": slot.time,
            "instruction": slot.instruction,
            "trigger_time": str(new_schedule.trigger_time),
        })
    return created
