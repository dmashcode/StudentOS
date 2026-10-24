# StudentOS

A student operating system: one workspace for subjects and notes.
This is **v0.1**, the first working MVP.

## What v0.1 can do

- Register, log in and log out (JWT)
- Student profile: name, education level, institution, course
- Dashboard with counts and recent notes
- Subject folders: create, rename, delete
- Notes: create, edit, save, delete, filtered by subject
- Light theme with a sky blue and gold glass design

## Tech stack

| Part | Tools |
|---|---|
| Frontend | React (Vite), Tailwind CSS v4, React Router, Axios |
| Backend | FastAPI, SQLAlchemy 2, Alembic, PyJWT, Argon2 (pwdlib) |
| Database | PostgreSQL 16 (Docker) |
| Tests | pytest |

## Project structure

```
studentos/
├── docker-compose.yml        PostgreSQL
├── backend/
│   ├── app/
│   │   ├── api/              routes (v1) and dependencies
│   │   ├── core/             settings and security
│   │   ├── db/               engine, session, base
│   │   ├── models/           database tables
│   │   ├── schemas/          request and response shapes
│   │   └── services/         business rules
│   ├── alembic/              migrations
│   └── tests/
└── frontend/
    └── src/
        ├── api/              backend calls
        ├── components/
        ├── constants/
        ├── context/          auth and data state
        ├── pages/
        ├── routes/           route guards
        └── utils/
```

## Requirements

- Git
- Python 3.11 or newer
- Node.js 20.19 or newer (or 22.12+)
- Docker Desktop

## Run it locally

### 1. Database

```powershell
docker compose up -d
```

### 2. Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1          # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
Copy-Item .env.example .env         # macOS/Linux: cp .env.example .env
```

Edit `.env`:

- `DATABASE_URL`: the password must match `docker-compose.yml`
- `JWT_SECRET_KEY`: generate one with
  `python -c "import secrets; print(secrets.token_urlsafe(32))"`

Then create the tables and start the API:

```powershell
python -m alembic upgrade head
python -m uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

### 3. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Tests

Create the test database once:

```powershell
docker exec -it studentos_db psql -U studentos -d studentos -c "CREATE DATABASE studentos_test;"
```

Run the backend tests:

```powershell
cd backend
python -m pytest -q
```

The tests only use `studentos_test` and refuse to run on any other database.
They cover authentication, profile, subjects, notes and ownership (one user
can never read or change another user's data).

Frontend checks: `npm run lint` and `npm run build`.

## API overview

All routes are under `/api/v1`. Everything except register and login needs
`Authorization: Bearer <token>`.

| Method | Route | Purpose |
|---|---|---|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Get a token |
| GET, PUT | `/profile` | Read or update the profile |
| GET, POST | `/subjects` | List or create subjects |
| PATCH, DELETE | `/subjects/{id}` | Rename or delete a subject |
| GET, POST | `/notes` | List notes (optional `subject_id`) or create one |
| GET, PATCH, DELETE | `/notes/{id}` | Read, edit or delete a note |
| GET | `/health` | API and database check |

## Design decisions

- **Ownership:** every query filters by `id` and `user_id`. Another user's data
  returns 404, never 403.
- **Email:** unique at the database level and stored in lowercase.
- **Deleting a subject** keeps its notes. They become "Unfiled"
  (`ON DELETE SET NULL`).
- **Notes** are plain text with a manual Save button, no autosave.
- **Dashboard counts** are calculated in the frontend, there is no dashboard endpoint.
- **Education level** is plain text in the database and validated in the API.
- **Token** is stored in `localStorage` (simple MVP choice, see roadmap).

## Windows notes

- Use `python -m uvicorn` and `python -m alembic`. Windows Application Control
  can block the `.exe` launchers that pip creates.
- Docker Desktop needs WSL 2.

## Known limitations

- Writing a note and leaving the page without saving loses the text, there is no warning yet
- All notes are loaded at once (no pagination)
- Duplicate subject names are allowed
- `/health` hangs instead of failing fast when the database is down
- Mobile layout is a basic stacked version

## Future roadmap (not in v0.1)

- Unsaved changes warning in the editor
- Highlight the selected subject in the sidebar
- Refresh tokens and `httpOnly` cookie instead of `localStorage`
- Email verification and password reset
- Rate limiting on login, database connect timeout, pagination
- Rich text or Markdown editor, search, tags, pinned notes, subject colours
- Dark mode and a polished mobile layout
- Nested folders, file attachments and cloud storage
- AI study assistant, community groups, study rooms, note sharing,
  marketplace, book exchange, integrations