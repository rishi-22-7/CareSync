"""
Run this script once to create all database tables in Supabase.
Usage: python create_tables.py  (from inside the backend/ folder, with venv activated)
"""
from app.core.database import engine, Base
import app.models  # noqa: F401 — registers all models with Base

if __name__ == "__main__":
    print("Creating all tables in the database...")
    Base.metadata.create_all(bind=engine)
    print("Done! All tables have been created successfully.")
