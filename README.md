# DiarioLX - Projeto e Seminario - ISEL - 2025/2026

Digital newspaper / CMS with a login-only editorial backoffice and a public reader-facing site.

- **Backend:** Spring Boot (Kotlin), multi-module Gradle, PostgreSQL via JDBI, media on SeaweedFS (S3-compatible). Lives in [`code/jvm`](code/jvm).
- **Frontend:** React + TypeScript (Vite). Lives in [`code/js`](code/js).

## Backend (`code/jvm`)

All commands below are run from the `code/jvm` directory.

### Prerequisites

- JDK 21
- Docker (running) — required for the integration tests and for running the app locally.

### Configuration

Two config files must exist in `code/jvm` before building, running, or testing. Copy the provided templates and fill in the values:

```bash
cp .env.example .env
cp seaweed-config.example.json seaweed-config.json
```

- `.env` — used by the **test suite** and by the `db-tests` / SeaweedFS containers in `docker-compose.yml`.
- `.env.staging` — used when running the **full app** (`allUp`), consumed by `modules/host/docker-compose.yml`.
- `seaweed-config.json` — SeaweedFS identities/credentials; must be in place before anything starts.

### Running the app (dev)

```bash
./gradlew buildImageAll   # build all Docker images
./gradlew allUp           # start everything (API, Postgres, SeaweedFS, web)
./gradlew allDown         # stop everything
```

- `localhost:8180` — frontend (React)
- `localhost:8180/api` — backend API
- `localhost:8180/docs` — Scalar API docs

## Running the tests

There are two kinds of tests:

| Kind | Modules | Needs Docker? |
| --- | --- | --- |
| **Pure unit** (in-memory) | `domain`, `repository` | No |
| **Integration** (real Postgres) | `repository-jdbi`, `services`, `host` | Yes |

The integration tests run against a real PostgreSQL database. You do **not** start it manually — the Gradle `test` task of those modules automatically brings up an ephemeral `db-tests` container (`dbTestsUp` → `dbTestsWait`) and tears it down afterwards (`dbTestsDown`). You only need Docker running.

Test environment variables are loaded from `code/jvm/.env` into every test task (see the root `build.gradle.kts`), so **`.env` must exist before running tests**:

- `POSTGRES_*` → used to build the `DB_URL` the JDBI tests connect with.
- `S3_*`, `JWT_*`, … → needed by the `host` Spring Boot tests, which load the full application context.

### Commands

```bash
# Everything (unit + integration); needs Docker
./gradlew test

# Full verification, including ktlint
./gradlew check

# Format
./gradlew ktlintFormat

# Unit only — fast, no Docker
./gradlew :domain:test :repository:test

# Integration only — needs Docker
./gradlew :repository-jdbi:test :services:test :host:test
```

### How the tests are written

- **Repository tests** (`repository-jdbi`) use `testWithHandleAndRollback { handle -> ... }` — they build a repository directly from a JDBI `Handle` and roll the transaction back, so nothing persists. Example: `UserRepositoryJdbiTests`, `CategoryRepositoryJdbiTests`, `TagRepositoryJdbiTests`.
- **Service tests** (`services`) use `testWithTransactionManagerAndRollback { tm -> Service(tm) }` — one shared transaction (so a service can read back its own writes) that is rolled back at the end. Example: `CategoryServiceTest`, `TagServiceTest`.

> **Note:** the `host` tests (`@SpringBootTest`) load the entire application context, which constructs the S3 storage bean. If the `S3_*` variables are missing from `.env`, those tests fail while building the context (a bean-creation `NullPointerException` from the AWS SDK), not with an assertion error. Make sure `.env` is complete before running them — including in CI.
