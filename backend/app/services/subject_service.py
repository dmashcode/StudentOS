from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.subject import Subject


class SubjectNotFound(Exception):
    pass


def list_subjects(db: Session, user_id: int) -> list[Subject]:
    stmt = select(Subject).where(Subject.user_id == user_id).order_by(Subject.name)
    return list(db.scalars(stmt))


def get_subject(db: Session, user_id: int, subject_id: int) -> Subject:
    subject = db.scalar(
        select(Subject).where(Subject.id == subject_id, Subject.user_id == user_id)
    )
    if subject is None:
        raise SubjectNotFound()
    return subject


def create_subject(db: Session, user_id: int, name: str) -> Subject:
    subject = Subject(user_id=user_id, name=name)
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject


def rename_subject(db: Session, user_id: int, subject_id: int, name: str) -> Subject:
    subject = get_subject(db, user_id, subject_id)
    subject.name = name
    db.commit()
    db.refresh(subject)
    return subject


def delete_subject(db: Session, user_id: int, subject_id: int) -> None:
    subject = get_subject(db, user_id, subject_id)
    db.delete(subject)
    db.commit()