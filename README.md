# Careerflow

Careerflow is a workspace for bulk email management and, in later releases, resume-based job discovery and application support. The initial launch focuses on bulk recipient import, viewing recipients, and deliberate individual email sending.

This branch contains project foundations only. It does not send email or connect the API to the database yet.

## Repository layout

```text
frontend/  React, Vite, and TypeScript application
backend/   FastAPI application and tests
infra/     Local PostgreSQL Docker Compose configuration
docs/      Product roadmap, designs, and implementation plans
```

Feature modules are added only when their branch begins. See the [feature roadmap](docs/roadmap.md) for the agreed sequence.

## Prerequisites

- Git
- Node.js 24 LTS and npm; an `.nvmrc` is included for nvm users
- [uv](https://docs.astral.sh/uv/getting-started/installation/) for Python dependency and runtime management
- Python 3.13, which uv can install for you
- Docker Engine with the Docker Compose plugin for local PostgreSQL

## First-time setup

From the repository root, create local environment files:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp infra/.env.example infra/.env
```

The example database password is for local development only. Change `POSTGRES_PASSWORD` in `infra/.env` if the database will be reachable by another machine.

Install the frontend dependencies:

```bash
source "$HOME/.nvm/nvm.sh"
nvm install
nvm use
cd frontend
npm ci
cd ..
```

Install Python 3.13 and the locked backend dependencies:

```bash
uv python install 3.13
cd backend
uv sync --locked --dev
cd ..
```

## Start local development

Start PostgreSQL from the repository root:

```bash
docker compose --env-file infra/.env -f infra/compose.yaml up -d
docker compose --env-file infra/.env -f infra/compose.yaml ps
```

Run the API in one terminal:

```bash
cd backend
uv run uvicorn app.main:app --reload
```

The API runs at <http://127.0.0.1:8000>. Verify its process health:

```bash
curl http://127.0.0.1:8000/api/v1/health
```

Expected response:

```json
{ "status": "ok", "service": "careerflow-api" }
```

Run the frontend in a second terminal:

```bash
source "$HOME/.nvm/nvm.sh"
nvm use
cd frontend
npm run dev
```

Open <http://localhost:5173>.

Stop PostgreSQL without deleting its named data volume:

```bash
docker compose --env-file infra/.env -f infra/compose.yaml down
```

## Verification commands

Frontend:

```bash
cd frontend
npm ci
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Apply formatting with `npm run format`.

Backend:

```bash
cd backend
uv sync --locked --dev
uv lock --check
uv run ruff format --check .
uv run ruff check .
uv run mypy app tests
uv run pytest -v
```

Apply formatting with `uv run ruff format .`.

Validate the PostgreSQL Compose file without starting a container:

```bash
docker compose --env-file infra/.env.example -f infra/compose.yaml config
```

GitHub Actions runs the same frontend and backend checks for pushes and pull requests.

## Configuration

| File            | Purpose                     | Current variables                                                    |
| --------------- | --------------------------- | -------------------------------------------------------------------- |
| `frontend/.env` | Browser build configuration | `VITE_API_BASE_URL` (reserved; not used yet)                         |
| `backend/.env`  | API process configuration   | `CAREERFLOW_APP_NAME`, `CAREERFLOW_ENVIRONMENT`                      |
| `infra/.env`    | Local PostgreSQL container  | `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT` |

Real `.env` files are ignored by Git. Only safe examples are tracked.

## Current API contract

`GET /api/v1/health` reports whether the FastAPI process can serve requests. It does not claim that PostgreSQL is reachable; database connectivity and migrations begin in `feat/database-foundation`.

## Current limitations

- The startup page is static and does not call the API.
- PostgreSQL is configured for local use but is not connected to FastAPI.
- Authentication, recipients, sender configuration, templates, sending, workers, and history are not implemented.
- No real email is sent during development.

## Git conventions

Use `feat/`, `fix/`, `chore/`, `refactor/`, or `docs/` branch prefixes for future work. Commit messages follow Conventional Commits, for example `feat: add recipient import preview`.

Do not push, merge, or deploy feature work until it has passed the documented checks.
