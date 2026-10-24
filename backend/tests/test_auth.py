from datetime import datetime, timedelta, timezone

import jwt
from sqlalchemy import delete

from app.core.config import settings
from app.models.user import User

API = "/api/v1"


def register_payload(email="sumit@example.com", full_name="Sumit", password="abc12345"):
    return {"email": email, "full_name": full_name, "password": password}


def test_register_creates_user_and_profile(client, make_user):
    headers = make_user("Sumit@Example.com", "Sumit")
    body = client.get(f"{API}/profile", headers=headers).json()
    assert body["email"] == "sumit@example.com"
    assert body["full_name"] == "Sumit"
    assert body["education_level"] is None


def test_register_response_never_contains_the_password(client):
    response = client.post(f"{API}/auth/register", json=register_payload())
    assert response.status_code == 201
    assert "password" not in response.text


def test_duplicate_email_is_rejected_ignoring_case(client, make_user):
    make_user("sumit@example.com")
    response = client.post(
        f"{API}/auth/register", json=register_payload("SUMIT@example.com")
    )
    assert response.status_code == 409


def test_register_validation(client):
    bad_email = client.post(f"{API}/auth/register", json=register_payload(email="abc@"))
    short_password = client.post(
        f"{API}/auth/register", json=register_payload(password="123")
    )
    blank_name = client.post(
        f"{API}/auth/register", json=register_payload(full_name="   ")
    )
    assert bad_email.status_code == 422
    assert short_password.status_code == 422
    assert blank_name.status_code == 422


def test_login_errors_are_identical(client, make_user):
    make_user("sumit@example.com")
    wrong_password = client.post(
        f"{API}/auth/login",
        json={"email": "sumit@example.com", "password": "wrong-password"},
    )
    unknown_email = client.post(
        f"{API}/auth/login",
        json={"email": "nobody@example.com", "password": "abc12345"},
    )
    assert wrong_password.status_code == 401
    assert unknown_email.status_code == 401
    assert wrong_password.json() == unknown_email.json()


def test_profile_requires_a_valid_token(client, make_user):
    headers = make_user("sumit@example.com")
    token = headers["Authorization"].removeprefix("Bearer ")
    header, payload, signature = token.split(".")
    flipped = ("A" if signature[0] != "A" else "B") + signature[1:]
    tampered = ".".join([header, payload, flipped])

    assert client.get(f"{API}/profile").status_code == 401
    assert (
        client.get(f"{API}/profile", headers={"Authorization": "Bearer abc"}).status_code
        == 401
    )
    assert (
        client.get(
            f"{API}/profile", headers={"Authorization": f"Bearer {tampered}"}
        ).status_code
        == 401
    )
    assert client.get(f"{API}/profile", headers=headers).status_code == 200


def test_expired_token_is_rejected(client, make_user):
    make_user("sumit@example.com")
    expired = jwt.encode(
        {"sub": "1", "exp": datetime.now(timezone.utc) - timedelta(minutes=1)},
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )
    response = client.get(f"{API}/profile", headers={"Authorization": f"Bearer {expired}"})
    assert response.status_code == 401


def test_token_of_a_deleted_user_is_rejected(client, make_user, db):
    headers = make_user("sumit@example.com")
    assert client.get(f"{API}/profile", headers=headers).status_code == 200
    db.execute(delete(User))
    db.commit()
    assert client.get(f"{API}/profile", headers=headers).status_code == 401


def test_update_profile_cleans_input(client, user_a):
    response = client.put(
        f"{API}/profile",
        headers=user_a,
        json={
            "full_name": "  Alice K  ",
            "education_level": "college",
            "institution": " My College ",
            "course": "   ",
        },
    )
    assert response.status_code == 200
    body = client.get(f"{API}/profile", headers=user_a).json()
    assert body["full_name"] == "Alice K"
    assert body["education_level"] == "college"
    assert body["institution"] == "My College"
    assert body["course"] is None


def test_invalid_education_level_is_rejected(client, user_a):
    response = client.put(
        f"{API}/profile",
        headers=user_a,
        json={"full_name": "Alice", "education_level": "astronaut"},
    )
    assert response.status_code == 422


def test_put_profile_resets_fields_that_are_not_sent(client, user_a):
    client.put(
        f"{API}/profile",
        headers=user_a,
        json={"full_name": "Alice", "education_level": "law"},
    )
    client.put(f"{API}/profile", headers=user_a, json={"full_name": "Alice"})
    body = client.get(f"{API}/profile", headers=user_a).json()
    assert body["education_level"] is None