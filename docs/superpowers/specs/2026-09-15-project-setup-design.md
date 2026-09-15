# Careerflow Project Setup Design

## Purpose

Establish a reproducible, maintainable foundation for Careerflow without implementing authentication, email workflows, career tools, subscriptions, or AI behavior. This setup must give new contributors exact commands to run a minimal React frontend, a FastAPI backend, and a local PostgreSQL service.

## Scope and acceptance criteria

The setup is complete when:

- `frontend/` contains a React, Vite, and TypeScript application with a minimal Careerflow startup page.
- `backend/` contains a FastAPI application with a versioned `GET /api/v1/health` endpoint.
- Backend and frontend startup behavior each have one meaningful automated test.
- `infra/compose.yaml` defines a local PostgreSQL service with persisted data and a health check.
- Example environment files contain only documented local-development placeholders, never operational secrets.
- npm and uv lockfiles make JavaScript and Python installs reproducible.
- Formatting, linting, type checking, testing, and production-build commands are documented and executable.
- GitHub Actions runs the relevant frontend and backend checks.
- The root README documents prerequisites, exact setup commands, architecture, and the feature roadmap.

## Runtime and dependency policy

- Use Node.js 24 LTS. The official Node.js release schedule lists version 24 as an LTS release on 2026-09-15.
- Use Python 3.13. This is a stable, supported Python series and provides wider ecosystem compatibility than selecting the newest major immediately.
- Use npm for frontend dependency management and commit `frontend/package-lock.json`.
- Use uv for backend dependency management and commit `backend/uv.lock`.
- Resolve current compatible stable library versions when creating the lockfiles. Avoid prerelease packages and unnecessary version pinning in manifests; lockfiles hold the exact resolved graph.
- Use PostgreSQL 17 in local Compose configuration. Database application models, SQLAlchemy integration, and Alembic migrations remain part of the later database-foundation feature.

## Repository structure

```text
.
├── .github/workflows/ci.yml
├── backend/
│   ├── app/
│   │   ├── api/routes/health.py
│   │   ├── core/config.py
│   │   └── main.py
│   ├── tests/test_health.py
│   ├── .env.example
│   ├── pyproject.toml
│   └── uv.lock
├── docs/
│   ├── roadmap.md
│   └── superpowers/
├── frontend/
│   ├── src/
│   │   ├── app/App.tsx
│   │   ├── styles/index.css
│   │   └── main.tsx
│   ├── tests/setup.ts
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
├── infra/
│   ├── .env.example
│   └── compose.yaml
├── .editorconfig
├── .gitignore
└── README.md
```

Each file or directory has one purpose. Feature-specific modules will be added only when their feature branch begins, avoiding empty placeholder architecture.

## Frontend design

The frontend will use the official Vite React TypeScript template as its base. The startup page will show the Careerflow name, a concise description, and a clear project-setup status. It will remain deliberately static: API integration, routing, React Query, tables, forms, Tailwind, and shadcn/ui belong to the features that first need them.

The frontend quality stack will include ESLint, Prettier, TypeScript project checks, Vitest, Testing Library, and a production Vite build. The component test will render the application and verify the primary Careerflow heading and setup message.

## Backend design

The backend will expose an application factory so tests and later configuration can create the FastAPI application consistently. Settings will come from environment variables through `pydantic-settings`; no environment file or secret is committed.

`GET /api/v1/health` will return a stable JSON contract:

```json
{
  "status": "ok",
  "service": "careerflow-api"
}
```

The health check reports application-process availability only. It will not claim database readiness before the database-foundation feature connects application persistence. Pytest with FastAPI's test client will verify the response status and exact contract.

Ruff will perform backend linting and formatting checks, and mypy will run strict static type checking over `app` and `tests`.

## Local PostgreSQL design

`infra/compose.yaml` will run PostgreSQL 17 with a named volume and `pg_isready` health check. Database name, username, password, and host port come from an ignored `infra/.env`, copied from `infra/.env.example`. Example values are explicitly local-only placeholders.

Docker Compose is the supported local PostgreSQL path. Installing Docker itself is an operating-system administration task, so the repository will detect and document its absence rather than silently alter the host. Project dependencies and managed runtimes will be installed with npm and uv.

## Configuration and security

- Ignore all real `.env` files while tracking `.env.example` files.
- Do not hardcode production credentials, tokens, SMTP details, or cloud configuration.
- Bind the development API and frontend to local interfaces through their standard development servers.
- Add CORS only when the frontend first calls the backend; a static setup page does not need a permissive policy.
- Keep PostgreSQL's local port configurable to avoid forcing a host-wide port choice.

## Continuous integration

GitHub Actions will contain independent frontend and backend jobs:

- Frontend: Node 24, `npm ci`, formatting check, lint, type check, tests, and production build.
- Backend: Python 3.13 with uv, locked dependency sync, Ruff format and lint checks, mypy, and pytest.

The health test does not depend on PostgreSQL, so CI will not start a database service during this setup feature.

## Documentation

The README will provide exact prerequisite, installation, local startup, testing, linting, formatting, type-checking, and build commands. It will distinguish project dependency installation from host prerequisites such as Docker.

`docs/roadmap.md` will record the agreed feature sequence and clearly mark the launch focus as bulk recipient import, recipient viewing, and email sending. Career and subscription features remain documented future work.

## Explicit exclusions

This branch will not add authentication, RBAC, SQLAlchemy models, migrations, email import logic, recipients, SMTP configuration, email composition, background workers, job discovery, document processing, AI integrations, subscriptions, or deployment.
