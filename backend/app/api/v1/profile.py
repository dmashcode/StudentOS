from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.profile import ProfileRead

router = APIRouter(tags=["profile"])


@router.get("/profile", response_model=ProfileRead)
def get_profile(current_user: User = Depends(get_current_user)):
    profile = current_user.profile
    return ProfileRead(
        email=current_user.email,
        full_name=profile.full_name,
        education_level=profile.education_level,
        institution=profile.institution,
        course=profile.course,
    )