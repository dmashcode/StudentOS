from pydantic import BaseModel, EmailStr, Field, field_validator


class EmailInput(BaseModel):
    email: EmailStr

    @field_validator("email")
    @classmethod
    def lowercase_email(cls, value: str) -> str:
        return value.lower()


class RegisterRequest(EmailInput):
    full_name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=128)

    @field_validator("full_name")
    @classmethod
    def clean_full_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Name cannot be empty")
        return value


class LoginRequest(EmailInput):
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"