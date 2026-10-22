from pydantic import BaseModel


class ProfileRead(BaseModel):
    email: str
    full_name: str
    education_level: str | None
    institution: str | None
    course: str | None