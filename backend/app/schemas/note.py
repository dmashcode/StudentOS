from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
    model_validator,
)


class NoteCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(default="", max_length=100_000)
    subject_id: int | None = None

    @field_validator("title")
    @classmethod
    def clean_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Title cannot be empty")
        return value


class NoteUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    content: str | None = Field(default=None, max_length=100_000)
    subject_id: int | None = None

    @field_validator("title")
    @classmethod
    def clean_title(cls, value: str | None) -> str | None:
        if value is None:
            return value
        value = value.strip()
        if not value:
            raise ValueError("Title cannot be empty")
        return value

    @model_validator(mode="after")
    def title_and_content_cannot_be_null(self):
        for field in ("title", "content"):
            if field in self.model_fields_set and getattr(self, field) is None:
                raise ValueError(f"{field} cannot be null")
        return self


class NoteSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    subject_id: int | None
    updated_at: datetime


class NoteRead(NoteSummary):
    content: str
    created_at: datetime