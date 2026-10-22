from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.note import NoteCreate, NoteRead, NoteSummary, NoteUpdate
from app.services import note_service, subject_service

router = APIRouter(prefix="/notes", tags=["notes"])


def note_not_found() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")


def subject_not_found() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found"
    )


@router.get("", response_model=list[NoteSummary])
def list_notes(
    subject_id: int | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return note_service.list_notes(db, current_user.id, subject_id)


@router.post("", response_model=NoteRead, status_code=status.HTTP_201_CREATED)
def create_note(
    data: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return note_service.create_note(
            db, current_user.id, data.title, data.content, data.subject_id
        )
    except subject_service.SubjectNotFound:
        raise subject_not_found()


@router.get("/{note_id}", response_model=NoteRead)
def get_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return note_service.get_note(db, current_user.id, note_id)
    except note_service.NoteNotFound:
        raise note_not_found()


@router.patch("/{note_id}", response_model=NoteRead)
def update_note(
    note_id: int,
    data: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return note_service.update_note(
            db, current_user.id, note_id, data.model_dump(exclude_unset=True)
        )
    except note_service.NoteNotFound:
        raise note_not_found()
    except subject_service.SubjectNotFound:
        raise subject_not_found()


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        note_service.delete_note(db, current_user.id, note_id)
    except note_service.NoteNotFound:
        raise note_not_found()