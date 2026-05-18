import bcrypt
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.caretaker import Caretaker
from app.schemas.auth_schema import AdminCreate, AdminLogin, AdminPasswordChange

router = APIRouter(prefix="/admin", tags=["Auth"])


@router.post("/register")
def register_admin(body: AdminCreate, db: Session = Depends(get_db)):
    existing = db.query(Caretaker).filter(Caretaker.email == body.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    hashed = bcrypt.hashpw(body.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    admin = Caretaker(name=body.name, email=body.email, password_hash=hashed)
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return {"admin_id": admin.id, "name": admin.name}


@router.post("/login")
def login_admin(body: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Caretaker).filter(Caretaker.email == body.email).first()
    if not admin or not bcrypt.checkpw(body.password.encode("utf-8"), admin.password_hash.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return {"admin_id": admin.id, "name": admin.name}


@router.post("/change-password")
def change_password(body: AdminPasswordChange, db: Session = Depends(get_db)):
    admin = db.query(Caretaker).filter(Caretaker.id == body.admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin account not found.")
    
    # Check old password
    if not bcrypt.checkpw(body.old_password.encode("utf-8"), admin.password_hash.encode("utf-8")):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")
        
    # Hash and save new password
    hashed = bcrypt.hashpw(body.new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    admin.password_hash = hashed
    db.commit()
    return {"status": "success", "message": "Password successfully updated."}

