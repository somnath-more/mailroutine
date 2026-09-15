# Careerflow Project Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a reproducible React/Vite/TypeScript frontend, FastAPI backend, and local PostgreSQL development foundation for Careerflow.

**Architecture:** Keep the frontend, backend, infrastructure, and documentation in separate top-level directories. The frontend is a static startup page, the backend exposes an application factory and versioned process-health endpoint, and PostgreSQL is configured independently through Docker Compose so database integration can begin on its dedicated feature branch.

**Tech Stack:** Node.js 24 LTS, React, TypeScript, Vite, npm, Python 3.13, FastAPI, pydantic-settings, uv, PostgreSQL 17, Docker Compose, Vitest, Testing Library, pytest, Ruff, mypy, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-15-project-setup-design.md`

## Global Constraints

- Implement only project setup; do not add authentication, email workflows, career tools, subscriptions, or AI behavior.
- Use Node.js 24 LTS and Python 3.13.
- Commit `frontend/package-lock.json` and `backend/uv.lock`.
- Track example environment files, never operational secrets.
- Do not add database application models, SQLAlchemy integration, or Alembic migrations.
- Do not install Docker silently; detect and document it as a host prerequisite.

---

### Task 1: Repository and PostgreSQL development foundation

**Files:**

- Create: `.editorconfig`
- Create: `.gitignore`
- Create: `.nvmrc`
- Create: `.python-version`
- Create: `infra/.env.example`
- Create: `infra/compose.yaml`

**Interfaces:**

- Consumes: Node 24 through nvm, Python 3.13 through uv, Docker Compose when present on the host.
- Produces: ignored local environment files and a PostgreSQL service named `postgres` on configurable host port `5432`.

- [ ] **Step 1: Record runtime versions**

Create `.nvmrc` containing `24` and `.python-version` containing `3.13`.

- [ ] **Step 2: Add repository-wide editor and ignore rules**

Configure UTF-8, LF, final newlines, two-space indentation by default, four spaces for Python, and ignored Node, Python, environment, test coverage, build, editor, and operating-system artifacts. Explicitly unignore every `.env.example` file.

- [ ] **Step 3: Add the local PostgreSQL contract**

Create `infra/.env.example`:

```dotenv
POSTGRES_DB=careerflow
POSTGRES_USER=careerflow
POSTGRES_PASSWORD=careerflow-local-only
POSTGRES_PORT=5432
```

Create `infra/compose.yaml` with `postgres:17-alpine`, variable-backed database credentials, a named `postgres_data` volume, port `${POSTGRES_PORT:-5432}:5432`, and this health check:

```yaml
test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
interval: 5s
timeout: 5s
retries: 10
```

- [ ] **Step 4: Validate the repository foundation**

Run:

```bash
git diff --check
git check-ignore -v infra/.env
git check-ignore infra/.env.example && exit 1 || true
```

Expected: no whitespace errors, `infra/.env` is ignored, and `infra/.env.example` is tracked.

- [ ] **Step 5: Commit the repository foundation**

```bash
git add .editorconfig .gitignore .nvmrc .python-version infra
git commit -m "chore: add project development foundation"
```

---

### Task 2: FastAPI backend with test-first health endpoint

**Files:**

- Create: `backend/.env.example`
- Create: `backend/README.md`
- Create: `backend/pyproject.toml`
- Create: `backend/uv.lock`
- Create: `backend/app/__init__.py`
- Create: `backend/app/api/__init__.py`
- Create: `backend/app/api/routes/__init__.py`
- Create: `backend/app/api/routes/health.py`
- Create: `backend/app/core/__init__.py`
- Create: `backend/app/core/config.py`
- Create: `backend/app/main.py`
- Create: `backend/tests/__init__.py`
- Create: `backend/tests/test_health.py`

**Interfaces:**

- Consumes: environment keys `CAREERFLOW_APP_NAME` and `CAREERFLOW_ENVIRONMENT`.
- Produces: `app.main.create_app(settings: Settings | None = None) -> FastAPI`, `app.main.app`, and `GET /api/v1/health` returning `{"status":"ok","service":"careerflow-api"}`.

- [ ] **Step 1: Install the managed Python runtime and dependency manager**

Use the official uv installer if `uv` is unavailable, then run `uv python install 3.13`. Do not alter a system Python installation.

- [ ] **Step 2: Create the backend manifest and lock dependencies**

Create a uv application requiring `>=3.13,<3.14`. Add runtime dependencies `fastapi`, `pydantic-settings`, and `uvicorn[standard]`. Add development dependencies `httpx2`, `anyio<4.15`, `mypy`, `pytest`, and `ruff`. The AnyIO cap is development-only and avoids an alias deprecated in AnyIO 4.15 that Starlette 1.6 still references in its test client. Configure pytest for `tests`, Ruff for Python 3.13 with 100-character lines, and mypy in strict mode for `app` and `tests`. Generate `backend/uv.lock`.

- [ ] **Step 3: Write the failing health endpoint test**

Create `backend/tests/test_health.py`:

```python
from fastapi.testclient import TestClient

from app.main import create_app


def test_health_endpoint_reports_api_process_status() -> None:
    client = TestClient(create_app())

    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "careerflow-api"}
```

- [ ] **Step 4: Run the test and confirm it fails for the missing application**

Run: `cd backend && uv run pytest tests/test_health.py -v`

Expected: collection fails because `app.main` does not exist.

- [ ] **Step 5: Implement settings and the health endpoint**

Create `backend/app/core/config.py` with an immutable `Settings(BaseSettings)` model, environment prefix `CAREERFLOW_`, ignored unknown values, `app_name="Careerflow API"`, and environment limited to `development`, `test`, or `production`.

Create `backend/app/api/routes/health.py`:

```python
from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    status: Literal["ok"]
    service: Literal["careerflow-api"]


@router.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    return HealthResponse(status="ok", service="careerflow-api")
```

Create `backend/app/main.py`:

```python
from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.core.config import Settings


def create_app(settings: Settings | None = None) -> FastAPI:
    resolved_settings = settings or Settings()
    application = FastAPI(title=resolved_settings.app_name)
    application.include_router(health_router, prefix="/api/v1")
    return application


app = create_app()
```

- [ ] **Step 6: Add safe configuration examples and backend commands**

Create `backend/.env.example` with only `CAREERFLOW_APP_NAME=Careerflow API` and `CAREERFLOW_ENVIRONMENT=development`. Document `uv sync --dev`, the Uvicorn development command, and all backend quality commands in `backend/README.md`.

- [ ] **Step 7: Verify the backend**

Run:

```bash
cd backend
uv lock --check
uv run ruff format --check .
uv run ruff check .
uv run mypy app tests
uv run pytest -v
```

Expected: lockfile current and every check exits successfully with one passing test.

- [ ] **Step 8: Commit the backend**

```bash
git add backend
git commit -m "feat: scaffold FastAPI backend"
```

---

### Task 3: React/Vite/TypeScript frontend with test-first startup page

**Files:**

- Create: `frontend/.env.example`
- Create: `frontend/.prettierignore`
- Create: `frontend/.prettierrc.json`
- Create: `frontend/eslint.config.js`
- Create: `frontend/index.html`
- Create: `frontend/package.json`
- Create: `frontend/package-lock.json`
- Create: `frontend/tsconfig.app.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tsconfig.node.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/src/app/App.test.tsx`
- Create: `frontend/src/app/App.tsx`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/styles/index.css`
- Create: `frontend/src/tests/setup.ts`

**Interfaces:**

- Consumes: browser DOM and Vite's standard development/runtime environment.
- Produces: default-exported `App` component and the `npm run dev`, `build`, `lint`, `typecheck`, `format`, `format:check`, `test`, and `test:watch` scripts.

- [ ] **Step 1: Install and select Node.js 24**

Source the existing nvm installation, install Node 24, run `nvm use 24`, and confirm `node --version` begins with `v24`.

- [ ] **Step 2: Scaffold the Vite React TypeScript project and install quality dependencies**

Use the official `react-ts` Vite template. Add Vitest, jsdom, Testing Library, `@testing-library/jest-dom`, Prettier, and `eslint-config-prettier` as development dependencies. Retain the current stable React, Vite, TypeScript, and ESLint dependencies resolved by npm.

- [ ] **Step 3: Write the failing startup page test**

Create `frontend/src/app/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";

import App from "./App";

describe("App", () => {
  it("identifies Careerflow and the completed foundation", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Careerflow" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Project foundation is ready."),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run the test and confirm it fails before the page exists**

Run: `cd frontend && npm test`

Expected: test fails because the expected heading and status text are absent.

- [ ] **Step 5: Implement the startup page and accessible base styling**

Create a focused `App` component with a `main` landmark, `Careerflow` heading, project-foundation status, and a short statement that bulk email management is the launch focus. Add responsive system-font styling, semantic CSS custom properties, visible focus defaults, light/dark OS preference support, and no application theme controls.

- [ ] **Step 6: Configure tests and quality scripts**

Configure Vitest with jsdom, globals, and `src/tests/setup.ts`; import `@testing-library/jest-dom/vitest` in that setup file. Add the scripts `lint`, `typecheck`, `format`, `format:check`, `test`, and `test:watch`. Configure Prettier consistently and disable ESLint formatting conflicts.

- [ ] **Step 7: Add a safe frontend environment example**

Create `frontend/.env.example` containing `VITE_API_BASE_URL=http://localhost:8000/api/v1`, documented as reserved for the later API-integration feature and unused by the static startup page.

- [ ] **Step 8: Verify the frontend**

Run:

```bash
cd frontend
npm ci
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Expected: every command exits successfully with one passing component test and a production bundle in `frontend/dist`.

- [ ] **Step 9: Commit the frontend**

```bash
git add frontend
git commit -m "feat: scaffold React frontend"
```

---

### Task 4: CI, roadmap, and contributor documentation

**Files:**

- Create: `.github/workflows/ci.yml`
- Create: `docs/roadmap.md`
- Modify: `README.md`

**Interfaces:**

- Consumes: frontend npm scripts, backend uv commands, `.nvmrc`, `.python-version`, and `infra/compose.yaml`.
- Produces: CI gates and exact onboarding/verification instructions for contributors.

- [ ] **Step 1: Add CI checks**

Create two independent GitHub Actions jobs on pushes and pull requests. The frontend job uses `actions/setup-node` with Node 24 and npm caching, then runs install, formatting, linting, type checking, tests, and build. The backend job uses `actions/setup-python` with Python 3.13 and `astral-sh/setup-uv`, syncs with `uv sync --locked --dev`, then runs Ruff formatting, Ruff linting, mypy, and pytest.

- [ ] **Step 2: Document the roadmap**

Create `docs/roadmap.md` containing the complete agreed branch sequence. Mark `project-setup` as current and mark recipient import, recipient viewing, composition/sending, worker processing, and history as the initial launch objective. Label career and subscription work as later phases.

- [ ] **Step 3: Replace the root README**

Document the repository layout, Node 24/Python 3.13/uv/Docker prerequisites, copying each environment example, installing dependencies, starting PostgreSQL, starting the API and frontend in separate terminals, stopping PostgreSQL, every frontend/backend verification command, API health response, current limitations, roadmap link, and branch/commit naming conventions.

- [ ] **Step 4: Verify documentation commands and the integrated setup**

Run all documented non-server verification commands. Start the backend temporarily and request `http://127.0.0.1:8000/api/v1/health`; confirm HTTP 200 and the exact JSON contract. If Docker exists, run `docker compose --env-file infra/.env.example -f infra/compose.yaml config`; if it does not, report PostgreSQL runtime verification as unavailable while retaining the valid checked-in configuration.

- [ ] **Step 5: Check repository scope and commit**

Run:

```bash
git diff --check
git status --short
git log --oneline --decorate -6
```

Confirm that no authentication, email implementation, database model, worker, job, AI, or deployment code exists.

```bash
git add .github README.md docs/roadmap.md
git commit -m "docs: add setup and roadmap guidance"
```
