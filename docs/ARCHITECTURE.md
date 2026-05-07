# Pet Adoption Platform - Architecture

## System Overview

The Pet Adoption Platform is a full-stack web application for pet adoption. It consists of:
- **Backend**: Spring Boot REST API
- **Frontend**: React SPA with TypeScript
- **Database**: PostgreSQL
- **Deployment**: Docker containers on Render

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Web Browser                          │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTPS
┌─────────────────▼───────────────────────────────────────┐
│             React Frontend (SPA)                        │
│  ┌───────────────────────────────────────────────┐     │
│  │  Pages: Storefront, Detail, Cart, Form, Admin │     │
│  │  Components: PetCard, Gallery, Header, Footer │     │
│  │  Context: Cart (LocalStorage)                 │     │
│  │  Services: API Client (Axios)                 │     │
│  └───────────────────────────────────────────────┘     │
└─────────────────┬───────────────────────────────────────┘
                  │ REST API (JSON)
                  │ /api/v1/*
┌─────────────────▼───────────────────────────────────────┐
│         Spring Boot REST API (Backend)                  │
│  ┌───────────────────────────────────────────────┐     │
│  │  Controllers:                                 │     │
│  │    ├─ PetController                           │     │
│  │    ├─ CategoryController                      │     │
│  │    ├─ ApplicationController                   │     │
│  │    └─ AdminController (Phase 2)               │     │
│  └───────────────────────────────────────────────┘     │
│  ┌───────────────────────────────────────────────┐     │
│  │  Services:                                    │     │
│  │    ├─ PetService (business logic)             │     │
│  │    ├─ CategoryService                         │     │
│  │    └─ ApplicationService                      │     │
│  └───────────────────────────────────────────────┘     │
│  ┌───────────────────────────────────────────────┐     │
│  │  Repositories (JPA):                          │     │
│  │    ├─ PetRepository                           │     │
│  │    ├─ CategoryRepository                      │     │
│  │    ├─ HealthStatusRepository                  │     │
│  │    └─ ApplicationRepository                   │     │
│  └───────────────────────────────────────────────┘     │
│  ┌───────────────────────────────────────────────┐     │
│  │  Security & Config:                           │     │
│  │    ├─ SecurityConfig (CORS, JWT)              │     │
│  │    ├─ CacheConfig (Spring Cache)              │     │
│  │    └─ GlobalExceptionHandler                  │     │
│  └───────────────────────────────────────────────┘     │
└─────────────────┬───────────────────────────────────────┘
                  │ SQL
┌─────────────────▼───────────────────────────────────────┐
│         PostgreSQL Database                            │
│  ┌───────────────────────────────────────────────┐     │
│  │  Tables:                                      │     │
│  │    ├─ categories                              │     │
│  │    ├─ pets                                    │     │
│  │    ├─ pet_photos                              │     │
│  │    ├─ health_statuses                         │     │
│  │    └─ adoption_applications                   │     │
│  └───────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

## Data Model

### Entities

**Pet**
- id, name, species, breed, age, bio
- category_id (FK), availability_status
- created_at, updated_at
- Relationships: Category (M:1), PetPhoto (1:M), HealthStatus (1:1)

**Category**
- id, name, species_type
- created_at

**PetPhoto**
- id, pet_id (FK), photo_url, display_order

**HealthStatus**
- id, pet_id (FK, UNIQUE), status (enum), notes
- updated_at

**AdoptionApplication**
- id, applicant_name, email, address, home_type
- form_answers (JSONB), status (enum)
- admin_notes, submitted_at, updated_at

## API Design

### REST Endpoints

**Public (No Auth)**
```
GET    /api/v1/pets              - List pets with filtering
GET    /api/v1/pets/{id}         - Get pet details
GET    /api/v1/categories        - List categories
POST   /api/v1/applications      - Submit adoption application
GET    /api/v1/health            - Health check
GET    /api/v1/docs              - OpenAPI docs
```

**Admin (JWT Auth)**
```
GET    /api/v1/admin/pets        - List all pets
POST   /api/v1/admin/pets        - Create pet
PATCH  /api/v1/admin/pets/{id}   - Update pet
DELETE /api/v1/admin/pets/{id}   - Delete pet
PATCH  /api/v1/admin/pets/{id}/health-status
GET    /api/v1/admin/applications
PATCH  /api/v1/admin/applications/{id}/status
```

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2
- **Language**: Java 17
- **ORM**: Hibernate + Spring Data JPA
- **Build**: Maven
- **Database**: PostgreSQL 14+
- **Migrations**: Flyway
- **Security**: Spring Security + JWT
- **Cache**: Spring Cache (Simple Provider)
- **API Docs**: Springdoc OpenAPI

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build**: Vite 5
- **Styling**: Tailwind CSS + MUI
- **Routing**: React Router v6
- **HTTP**: Axios
- **Package Manager**: npm

### Infrastructure
- **Containers**: Docker
- **Orchestration**: docker-compose
- **Deployment**: Render
- **CI/CD**: GitHub Actions

## Key Architectural Decisions

### 1. Three-Layer Architecture (Backend)
- **Presentation Layer** (Controllers): Handle HTTP requests/responses
- **Business Logic Layer** (Services): Implement business rules
- **Data Access Layer** (Repositories): Database operations

**Why**: Separation of concerns, testability, maintainability

### 2. RESTful API Design
- Resource-based URLs (`/api/v1/pets`, `/api/v1/applications`)
- Standard HTTP methods (GET, POST, PATCH, DELETE)
- Consistent response format with `ApiResponse<T>` wrapper

**Why**: Industry standard, easier to understand, client-agnostic

### 3. JPA/Hibernate ORM
- Entity mapping via annotations
- Custom repository queries
- Built-in pagination support

**Why**: Reduces boilerplate, automatic schema generation (with Flyway), type safety

### 4. Context API for State Management (Frontend)
- Global cart state with localStorage persistence
- useCart hook for convenient access
- No external state library (Redux) for MVP

**Why**: Lightweight, built-in React, sufficient for Phase 1 scope

### 5. Material-UI + Tailwind CSS
- MUI for form components, dialogs, layout
- Tailwind for custom styling and responsive design
- Combined approach for flexibility

**Why**: Fast development, professional appearance, good accessibility

### 6. Spring Cache Abstraction
- Simple in-memory cache for dev/test
- Cacheable annotations on service methods
- Easy to swap for Redis later

**Why**: Performance boost, abstracted implementation, testable

### 7. Flyway Database Migrations
- Version-controlled schema changes
- Automatic migration on app startup
- Rollback capability (via versioned scripts)

**Why**: Consistent schema across environments, reproducible deployments

### 8. JWT Authentication (Deferred to Phase 2)
- Token-based stateless authentication
- CORS enabled for cross-origin requests
- Secure admin endpoint access

**Why**: Scalable, suitable for distributed systems, no session state

## Data Flow

### Browse Pets (US1)
```
1. User visits homepage
2. React fetches categories (GET /api/v1/categories)
3. React displays category sidebar
4. User selects category
5. React fetches pets filtered by category (GET /api/v1/pets?categoryId=X)
6. React renders PetCard components in grid
7. Search input triggers debounced search API call
8. Results update in real-time
```

### View Pet Details (US2)
```
1. User clicks pet card
2. React routes to /pet/:id
3. React fetches pet details (GET /api/v1/pets/{id})
4. React displays pet info, photo gallery, health status
5. User views multiple photos via gallery navigation
6. User clicks "Add to Furever Home" button
```

### Add to Cart (US3)
```
1. User clicks "Add to Furever Home" or "Add to Cart"
2. React context action: addPet(pet)
3. Cart state updated in memory
4. Cart serialized and saved to localStorage
5. Cart badge count updated in header
6. Confirmation message displayed
```

### Submit Adoption Application (US4)
```
1. User clicks "Proceed to Adoption Form" from cart
2. React displays multi-step form (FormStepper)
3. User fills out personal info (Step 1)
4. User provides home environment details (Step 2)
5. User answers pet care questions (Step 3)
6. User reviews answers (Step 4)
7. User submits: POST /api/v1/applications
8. Backend validates and saves AdoptionApplication
9. React displays success message with application ID
```

## Performance Optimization

### Backend
- **Database Indexes**: On frequently queried columns (category_id, availability_status, name)
- **Pagination**: Limit result sets (default 20 items)
- **Caching**: Pet and category data cached for 1+ hours
- **Connection Pooling**: HikariCP with 20 max connections
- **Query Optimization**: Custom JPA queries with joins, avoid N+1 problems

### Frontend
- **Code Splitting**: Vite automatically splits code by route
- **Image Optimization**: Lazy loading on PetCards
- **Debouncing**: Search input debounced to 300ms
- **Memoization**: PetCard wrapped in React.memo
- **Minification**: Production build minified and gzipped

## Scalability Considerations

### Phase 1 (MVP - 50-200 pets, < 100 concurrent users)
- Simple in-memory caching
- Single PostgreSQL instance
- Single backend server instance

### Phase 2 (5,000+ pets, 500+ concurrent users)
- Redis caching layer
- Database read replicas
- Load balancing for backend instances
- CDN for static assets

### Phase 3 (Long-term, 50,000+ pets, 5,000+ concurrent users)
- Elasticsearch for advanced search
- Database sharding by category
- Microservices architecture
- Async processing for heavy operations (email notifications)

## Security

### Current Implementation (Phase 1)
- CORS configured for frontend domain
- Password hashing with BCrypt
- Parameterized queries (JPA prevents SQL injection)
- Input validation on DTOs
- Global exception handler (no sensitive data leakage)

### Phase 2 Additions
- JWT authentication for admin endpoints
- HTTPS enforcement in production
- Rate limiting on public endpoints
- Sensitive data logging prevention

### Phase 3+ Additions
- OAuth2 for user accounts
- API key authentication for 3rd-party integrations
- Encryption at rest for sensitive data
- Audit logging for all admin operations

## Testing Strategy

### Unit Tests
- Service layer tests with mocked repositories
- DTO mapping tests
- Exception handling tests

### Integration Tests
- Controller tests with TestRestTemplate
- API contract validation
- Database transaction tests

### E2E Tests
- Cypress/Playwright for user workflows
- Browser automation for full flow testing
- Visual regression testing

### Coverage Target
- Backend: > 70% code coverage (JaCoCo)
- Frontend: > 60% component coverage (React Testing Library)

## Deployment

### Local Development
```bash
docker-compose up
# Services available at:
# Frontend: http://localhost
# Backend: http://localhost:8080
# Database: localhost:5432
```

### Production (Render)
- GitHub Actions CI/CD pipeline
- Automated testing on push
- Docker image build and push
- Render deployment with auto-scaling

## Monitoring & Observability

### Phase 1
- Application logs via Spring Logging
- Health endpoint: GET /api/v1/health
- Render monitoring dashboard

### Phase 2+
- Structured logging (JSON format)
- Distributed tracing (Spring Cloud Sleuth)
- Metrics collection (Micrometer)
- Error tracking (Sentry)
- Performance monitoring (New Relic)
