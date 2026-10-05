from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.profile import StudentProfile
from app.models.user import User
from app.schemas.auth import RegisterRequest


class EmailAlreadyRegistered(Exception):
    pass


def register_user(db: Session, data: RegisterRequest) -> User:
    user = User(email=data.email, hashed_password=hash_password(data.password))
    user.profile = StudentProfile(full_name=data.full_name)
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise EmailAlreadyRegistered()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = db.scalar(select(User).where(User.email == email))
    if user is None or not verify_password(password, user.hashed_password):
        return None
    return user