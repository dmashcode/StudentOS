import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models import Note, StudentProfile, Subject, User  # noqa: F401

TEST_URL = make_url(settings.database_url).set(database="studentos_test")
assert TEST_URL.database.endswith("_test"), "Tests must never run on the real database"

engine = create_engine(TEST_URL)
TestingSession = sessionmaker(bind=engine)


@pytest.fixture(scope="session", autouse=True)
def create_tables():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    yield
    engine.dispose()


@pytest.fixture(autouse=True)
def clean_tables():
    yield
    with engine.begin() as conn:
        conn.execute(
            text("TRUNCATE users, student_profiles, subjects, notes RESTART IDENTITY CASCADE")
        )


@pytest.fixture
def client():
    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def db():
    session = TestingSession()
    yield session
    session.close()


@pytest.fixture
def make_user(client):
    def _make(email, name="Test User", password="abc12345"):
        response = client.post(
            "/api/v1/auth/register",
            json={"email": email, "full_name": name, "password": password},
        )
        assert response.status_code == 201, response.text
        response = client.post(
            "/api/v1/auth/login", json={"email": email, "password": password}
        )
        assert response.status_code == 200, response.text
        return {"Authorization": f"Bearer {response.json()['access_token']}"}

    return _make


@pytest.fixture
def user_a(make_user):
    return make_user("alice@example.com", "Alice")


@pytest.fixture
def user_b(make_user):
    return make_user("bob@example.com", "Bob")