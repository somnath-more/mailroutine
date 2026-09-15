# Careerflow backend

## Install

```bash
uv sync --dev
```

## Run locally

```bash
uv run uvicorn app.main:app --reload
```

The API is available at <http://127.0.0.1:8000>. Its process health endpoint is
`GET /api/v1/health`.

## Quality checks

```bash
uv lock --check
uv run ruff format --check .
uv run ruff check .
uv run mypy app tests
uv run pytest -v
```

Apply backend formatting with `uv run ruff format .`.
