from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.subject import SubjectCreate, SubjectRead, SubjectUpdate
from app.services import subject_service

router = APIRouter(prefix="/subjects", tags=["subjects"])


def not_found() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found"
    )


@router.get("", response_model=list[SubjectRead])
def list_subjects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return subject_service.list_subjects(db, current_user.id)


@router.post("", response_model=SubjectRead, status_code=status.HTTP_201_CREATED)
def create_subject(
    data: SubjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return subject_service.create_subject(db, current_user.id, data.name)


@router.patch("/{subject_id}", response_model=SubjectRead)
def rename_subject(
    subject_id: int,
    data: SubjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return subject_service.rename_subject(
            db, current_user.id, subject_id, data.name
        )
    except subject_service.SubjectNotFound:
        raise not_found()


@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(
    subject_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        subject_service.delete_subject(db, current_user.id, subject_id)
    except subject_service.SubjectNotFound:
        raise not_found()