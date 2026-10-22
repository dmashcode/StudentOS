from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.profile import ProfileRead, ProfileUpdate

router = APIRouter(tags=["profile"])


def build_profile_read(user: User) -> ProfileRead:
    profile = user.profile
    return ProfileRead(
        email=user.email,
        full_name=profile.full_name,
        education_level=profile.education_level,
        institution=profile.institution,
        course=profile.course,
    )


@router.get("/profile", response_model=ProfileRead)
def get_profile(current_user: User = Depends(get_current_user)):
    return build_profile_read(current_user)


@router.put("/profile", response_model=ProfileRead)
def update_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = current_user.profile
    profile.full_name = data.full_name
    profile.education_level = data.education_level
    profile.institution = data.institution
    profile.course = data.course
    db.commit()
    return build_profile_read(current_user)