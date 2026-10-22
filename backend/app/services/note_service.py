from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.note import Note
from app.services import subject_service


class NoteNotFound(Exception):
    pass


def list_notes(db: Session, user_id: int, subject_id: int | None = None) -> list[Note]:
    stmt = select(Note).where(Note.user_id == user_id)
    if subject_id is not None:
        stmt = stmt.where(Note.subject_id == subject_id)
    stmt = stmt.order_by(Note.updated_at.desc())
    return list(db.scalars(stmt))


def get_note(db: Session, user_id: int, note_id: int) -> Note:
    note = db.scalar(select(Note).where(Note.id == note_id, Note.user_id == user_id))
    if note is None:
        raise NoteNotFound()
    return note


def create_note(
    db: Session, user_id: int, title: str, content: str, subject_id: int | None
) -> Note:
    if subject_id is not None:
        subject_service.get_subject(db, user_id, subject_id)
    note = Note(user_id=user_id, title=title, content=content, subject_id=subject_id)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def update_note(db: Session, user_id: int, note_id: int, changes: dict) -> Note:
    note = get_note(db, user_id, note_id)
    if changes.get("subject_id") is not None:
        subject_service.get_subject(db, user_id, changes["subject_id"])
    for field, value in changes.items():
        setattr(note, field, value)
    db.commit()
    db.refresh(note)
    return note


def delete_note(db: Session, user_id: int, note_id: int) -> None:
    note = get_note(db, user_id, note_id)
    db.delete(note)
    db.commit()