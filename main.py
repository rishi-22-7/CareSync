from database import engine, Base

# Import all models so that Base.metadata is aware of them
import models  # noqa: F401

if __name__ == "__main__":
    print("Creating all tables in the database...")
    Base.metadata.create_all(bind=engine)
    print("Done! All tables have been created successfully.")
