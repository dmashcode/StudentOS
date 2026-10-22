from typing import Literal

from pydantic import BaseModel, Field, field_validator

EducationLevel = Literal[
    "school",
    "college",
    "engineering",
    "medical",
    "law",
    "competitive_exam",
    "language_learning",
    "other",
]


class ProfileRead(BaseModel):
    email: str
    full_name: str
    education_level: str | None
    institution: str | None
    course: str | None


class ProfileUpdate(BaseModel):
    full_name: str = Field(min_length=1, max_length=100)
    education_level: EducationLevel | None = None
    institution: str | None = Field(default=None, max_length=150)
    course: str | None = Field(default=None, max_length=100)

    @field_validator("full_name")
    @classmethod
    def clean_full_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Name cannot be empty")
        return value

    @field_validator("institution", "course")
    @classmethod
    def empty_to_none(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None