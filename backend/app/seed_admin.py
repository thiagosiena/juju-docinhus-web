# app/seed_admin.py
from passlib.context import CryptContext

from .database import SessionLocal
from .models import Admin

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_admin(username: str, password: str):
    db = SessionLocal()
    try:
        existing = db.query(Admin).filter(Admin.username == username).first()
        if existing:
            print(f"Admin '{username}' já existe (id={existing.id})")
            return

        hashed = get_password_hash(password)
        admin = Admin(username=username, hashed_password=hashed)
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print(f"Admin criado: id={admin.id}, username={admin.username}")
    finally:
        db.close()

if __name__ == "__main__":
    
    create_admin("admin", "123456")
