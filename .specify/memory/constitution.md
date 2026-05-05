# Petstore Constitution

## Core Principles

### I. API-First Design
All features MUST expose functionality through RESTful APIs before UI implementation. API contracts defined first, validated via integration tests, then consumed by React frontend. Enables independent frontend/backend development and third-party integrations.

### II. Database-Driven Reliability
Postgres is the single source of truth for all persistent data. Transactional integrity MUST be enforced at database level. Migrations MUST be version-controlled and reversible. Data consistency non-negotiable; no eventual consistency shortcuts without explicit architectural justification.

### III. Component-Based UI Architecture
React components MUST be: self-contained, reusable, styled consistently with Tailwind CSS. Component library approach enforced. MUI components adopted for complex forms/tables. Props validation required; no deeply nested prop drilling. Components tested independently before integration.

### IV. Test-First Development (NON-NEGOTIABLE)
Test-Driven Development mandatory: unit tests for all backend business logic and frontend components, integration tests for API contracts, end-to-end tests for critical user journeys. Test failure blocks deployment; no exceptions.

### V. Observability & Monitoring
Structured logging required for all backend services (Spring Boot). Request/response tracing enabled. Deployment monitoring configured in Render with alerting for failures. Performance metrics tracked; response times benchmarked and enforced.

## Technology Stack & Standards

**Backend**: Java Spring Boot (latest stable) with Spring Data JPA for ORM and Spring Security for authentication.
**Database**: PostgreSQL with Flyway migrations for schema management.
**Frontend**: React with functional components and hooks; Tailwind CSS for styling; Material-UI for enterprise components.
**Deployment**: Containerized via Docker; deployed to Render with automatic CI/CD on main branch.

All dependencies locked via Maven (backend) and package-lock.json (frontend). Security scanning required on all dependencies; vulnerabilities MUST be patched within 48 hours.

## Development Workflow & Quality Gates

**Branching**: Feature branches from `main`, named `feature/<issue-id>-<description>`.
**Code Review**: All PRs require at least one approval before merge. Review checklist MUST verify: test coverage >80%, API contracts documented, database migrations reviewed, security implications assessed.
**Deployment**: Merge to `main` triggers automated build, test suite, and deployment to Render staging. Manual promotion to production after health checks.
**Versioning**: Semantic versioning (MAJOR.MINOR.PATCH). MAJOR for breaking API/schema changes, MINOR for new features, PATCH for bug fixes.

## Governance

The Petstore Constitution supersedes all informal practices and guidelines. Amendments require documented rationale and team consensus. Constitution reviewed quarterly; changes logged with version bumps per semantic versioning rules above. All team members responsible for enforcement; violations escalated to tech lead.

Compliance verified in PR reviews and deployment gates. Deviations from principles MUST be documented with explicit trade-off justification in commit messages or ADR files.

**Version**: 1.0.0 | **Ratified**: 2026-05-05 | **Last Amended**: 2026-05-05
