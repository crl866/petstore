# Pet Adoption Platform - Implementation Tasks

**Feature**: Pet Adoption Platform  
**Branch**: `001-pet-adoption-platform`  
**Generated**: 2026-05-05  
**Total Tasks**: 48  
**Execution Timeline**: ~8-10 weeks  

---

## Executive Summary

This document breaks down the Pet Adoption Platform into 48 actionable tasks across 4 phases. The implementation prioritizes P1 user stories (Browse, View Details, Adoption Form) in the first delivery, followed by cart and admin features, then application tracking. Total story points: 156 SP / ~480 hours.

### Recommended MVP Scope
**Phase 1 + Phase 2 + P1 Stories (US1, US2, US4)** = ~4 weeks, delivering core pet discovery and adoption application flow.

### Dependency Graph
```
Phase 1 (Setup) → Phase 2 (Foundation)
                    ↓
        Phase 3a (US1, US2, US4 - Core)
            ↓               ↓
    Phase 3b (US3, US5, US6)
            ↓
    Phase 3c (US7)
            ↓
    Phase 4 (Polish)
```

### Parallel Execution Opportunities
- **Week 1-2**: Phase 1 & 2 tasks can be split (backend setup vs. frontend scaffold)
- **Week 3-4**: Frontend (US1, US2, US4 UI) and Backend (Pet API, Auth) done in parallel
- **Week 5-6**: Cart feature and Admin Inventory in parallel
- **Week 7-8**: Health Status and Applications tracking in parallel

---

## Phase 1: Project Setup & Infrastructure (5 days, 13 SP)

### Objective
Initialize project repositories, configure development environment, and establish CI/CD pipeline.

### Phase 1 - Setup Tasks

#### Backend Setup

- [ ] T001 [P] Create Java Spring Boot project structure with Maven in `petstore-backend/` repository
  - **Story**: Setup  
  - **Effort**: 3 SP / 8 hours  
  - **Owner**: Backend Lead  
  - **Acceptance Criteria**:
    - Spring Boot 3.x initialized with Spring Web, Data JPA, Security dependencies
    - Multi-module structure: core, persistence, api modules
    - pom.xml configured with all production and test dependencies
    - Basic `.gitignore` and `README.md` present
  - **Testing**: Build succeeds with `mvn clean install`
  - **Risk**: None

- [ ] T002 [P] Set up PostgreSQL database on Render with proper configuration in `petstore-backend/src/main/resources/application-prod.properties`
  - **Story**: Setup  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: DevOps / Backend Lead  
  - **Acceptance Criteria**:
    - PostgreSQL instance created on Render
    - Connection string added to application.properties (prod) and application-test.properties (test)
    - SSL/TLS configured for Render database connection
    - Database backup strategy documented
  - **Testing**: `psql` connection from local machine succeeds; migrations run successfully
  - **Risk**: Production data exposure if credentials committed to Git

- [ ] T003 [P] Create Docker configuration for backend service in `petstore-backend/Dockerfile` and `docker-compose.yml`
  - **Story**: Setup  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: DevOps / Backend Lead  
  - **Acceptance Criteria**:
    - Multi-stage Dockerfile with minimal production image (~200MB)
    - docker-compose.yml includes backend service, PostgreSQL, Redis (optional)
    - Environment variable injection via .env file
    - Container runs with non-root user
  - **Testing**: `docker-compose up` launches service; health check passes
  - **Risk**: Image bloat if dependencies not optimized

- [ ] T004 [P] Set up Render CI/CD pipeline with GitHub Actions in `.github/workflows/deploy-backend.yml`
  - **Story**: Setup  
  - **Effort**: 3 SP / 8 hours  
  - **Owner**: DevOps  
  - **Acceptance Criteria**:
    - GitHub Actions workflow triggers on push to main/develop branches
    - Maven build runs with test suite
    - Docker image built and pushed to Render registry
    - Service deployed to Render staging/production
    - Deployment failures notify via GitHub issues
  - **Testing**: Commit to develop branch; verify workflow runs and service updates
  - **Risk**: Accidental deployments; ensure branch protection rules in place

#### Frontend Setup

- [ ] T005 [P] Create React + TypeScript project with Vite in `petstore-frontend/`
  - **Story**: Setup  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Frontend Lead  
  - **Acceptance Criteria**:
    - Vite scaffolded with React 18+, TypeScript, ESLint, Prettier
    - Tailwind CSS and Material-UI (MUI) installed and configured
    - Project compiles without warnings
    - `.gitignore` and `README.md` present
  - **Testing**: `npm run dev` starts dev server; app loads at http://localhost:5173
  - **Risk**: None

- [ ] T006 [P] Configure Render frontend deployment with environment variables in `.env.production`
  - **Story**: Setup  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Frontend Lead / DevOps  
  - **Acceptance Criteria**:
    - Environment variables for API_BASE_URL, REACT_APP_VERSION injected at build time
    - Production build optimized with code splitting and lazy loading
    - Static assets served via Render or CDN
    - CORS headers allow backend API calls
  - **Testing**: Production build succeeds; service runs on Render with correct API URLs
  - **Risk**: Hardcoded environment variables in source; ensure .env.production in .gitignore

#### Shared Infrastructure

- [ ] T007 [P] Create project documentation structure with README, CONTRIBUTING, ARCHITECTURE docs in `docs/`
  - **Story**: Setup  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Tech Lead  
  - **Acceptance Criteria**:
    - README with project description, setup instructions, running locally
    - ARCHITECTURE.md explaining system design and component interactions
    - CONTRIBUTING.md with branching strategy, commit conventions, PR process
    - API documentation template (to be filled in T009)
  - **Testing**: Documentation builds and renders correctly; instructions are clear and tested
  - **Risk**: Documentation becomes stale; establish review process

---

## Phase 2: Foundation & Core Infrastructure (7 days, 24 SP)

### Objective
Build backend framework, API contracts, database models, and authentication layer.

### Phase 2 - Foundation Tasks

#### Database & Entities

- [ ] T008 [P] Create PostgreSQL schema with tables: categories, pets, pet_photos, health_statuses in `petstore-backend/src/main/resources/db/migration/V1_0_0__initial_schema.sql`
  - **Story**: Foundation  
  - **Effort**: 3 SP / 8 hours  
  - **Owner**: Backend Lead  
  - **Acceptance Criteria**:
    - All 6 tables created with proper indexes
    - Foreign key relationships established (pets → categories, pet_photos → pets, health_statuses → pets)
    - Timestamps (created_at, updated_at) on all tables
    - Database constraints enforced (NOT NULL, UNIQUE where needed)
    - Migration script runs without errors on fresh database
  - **Testing**: Schema verified with `\dt` in psql; relationships validated
  - **Risk**: Migration failure in production; test rollback strategy

- [ ] T009 [P] Create JPA Entity classes (Pet, Category, HealthStatus, PetPhoto) in `petstore-backend/src/main/java/com/petstore/entity/`
  - **Story**: Foundation  
  - **Effort**: 3 SP / 8 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - All entities mapped to database tables with correct annotations
    - Relationships properly configured (OneToMany, ManyToOne, ManyToMany)
    - Entity constructors, getters/setters, and toString() methods
    - Lombok annotations used for boilerplate reduction
    - JPA inheritance strategy for HealthStatus (if applicable)
  - **Testing**: Entity tests compile; JPA mappings validated with Hibernate validation
  - **Risk**: Incorrect relationship mappings; ensure lazy/eager loading appropriate

#### API Contracts & DTOs

- [ ] T010 [P] Create REST API contract documentation in `docs/API_CONTRACT.md` with all endpoints and request/response formats
  - **Story**: Foundation  
  - **Effort**: 3 SP / 8 hours  
  - **Owner**: Tech Lead / Backend Dev  
  - **Acceptance Criteria**:
    - All 15+ endpoints documented with method, path, query/body parameters
    - Request/response JSON schemas provided
    - HTTP status codes and error formats standardized
    - Authentication requirements for admin endpoints specified
    - Example cURL commands for each endpoint
  - **Testing**: Documentation matches API design from plan.md; OpenAPI/Swagger review
  - **Risk**: Documentation drift; establish review process for API changes

- [ ] T011 [P] Create DTO classes (PetDTO, CategoryDTO, ApplicationDTO, etc.) in `petstore-backend/src/main/java/com/petstore/dto/`
  - **Story**: Foundation  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - DTO for each major entity created with validation annotations
    - Mapper classes for Entity ↔ DTO conversions (using MapStruct or manual)
    - Request DTOs and Response DTOs separated for read/write operations
    - Lombok annotations applied
  - **Testing**: DTOs serialize/deserialize correctly; Jackson annotations validated
  - **Risk**: Inconsistent DTO naming; establish naming convention

#### Security & Authentication

- [ ] T012 [P] Implement Spring Security configuration with JWT authentication in `petstore-backend/src/main/java/com/petstore/config/SecurityConfig.java`
  - **Story**: Foundation  
  - **Effort**: 4 SP / 12 hours  
  - **Owner**: Backend Lead  
  - **Acceptance Criteria**:
    - JWT token generation and validation configured
    - `/api/v1/admin/*` endpoints protected; require valid JWT
    - Public endpoints (`/api/v1/pets`, `/api/v1/cart`) accessible without auth
    - CORS configured to allow frontend domain
    - Password encoding with BCrypt
    - Token expiry set to 24 hours (configurable)
  - **Testing**: Unit tests verify admin endpoints return 401 without token; public endpoints accessible
  - **Risk**: Token leakage; ensure HTTPS in production

- [ ] T013 [P] Create authentication controller with login endpoint in `petstore-backend/src/main/java/com/petstore/controller/AuthController.java`
  - **Story**: Foundation  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - POST `/api/v1/auth/login` accepts email/password
    - Returns JWT token and user info on success
    - Returns 401 with error message on invalid credentials
    - Input validation (email format, password required)
  - **Testing**: Integration test with valid/invalid credentials; JWT token verified
  - **Risk**: Brute force attacks; consider rate limiting in Phase 4

#### Core Services & Repositories

- [ ] T014 [P] Create Repository interfaces extending JpaRepository for Pet, Category, HealthStatus in `petstore-backend/src/main/java/com/petstore/repository/`
  - **Story**: Foundation  
  - **Effort**: 1 SP / 3 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - PetRepository with custom queries: `findByCategory`, `findByAvailabilityStatus`, `search`
    - CategoryRepository with `findBySpeciesType`
    - HealthStatusRepository with queries by pet and status
    - Proper pagination support
  - **Testing**: Repository tests with H2 in-memory database; queries return correct results
  - **Risk**: N+1 queries; ensure fetch strategies optimized

- [ ] T015 [P] Create PetService class with business logic in `petstore-backend/src/main/java/com/petstore/service/PetService.java`
  - **Story**: Foundation  
  - **Effort**: 3 SP / 8 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Service methods: getPets, getPetById, searchPets, filterByCategory
    - Caching applied to frequently accessed data (optional Redis)
    - Error handling with custom exceptions
    - Pagination logic implemented
  - **Testing**: Unit tests with mocked repository; service logic tested independently
  - **Risk**: Performance degradation with large datasets; ensure indexes applied

- [ ] T016 [P] Create global error handling with @ControllerAdvice in `petstore-backend/src/main/java/com/petstore/exception/GlobalExceptionHandler.java`
  - **Story**: Foundation  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Exception handler for ResourceNotFoundException, ValidationException, etc.
    - Standardized error response format with status, message, timestamp
    - HTTP status codes correctly mapped (400, 404, 500, etc.)
    - Logging of errors for debugging
  - **Testing**: Unit tests verify exception handling; integration tests validate error responses
  - **Risk**: Information disclosure in error messages; ensure no sensitive data in responses

#### Frontend Foundation

- [ ] T017 [P] Create global context for cart and app state in `petstore-frontend/src/context/AppContext.tsx`
  - **Story**: Foundation  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Context provider for cart state (pets list, count)
    - Context provider for user session state
    - useCart and useAuth custom hooks created
    - State management with useReducer or Zustand
    - LocalStorage persistence for cart
  - **Testing**: Context tests verify state updates; hooks tested with rendering library
  - **Risk**: Context re-renders; optimize with React.memo for performance

- [ ] T018 [P] Create API client service in `petstore-frontend/src/services/apiClient.ts`
  - **Story**: Foundation  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Axios/Fetch wrapper with base URL configuration
    - JWT token injection in Authorization header
    - Error handling with retry logic
    - Request/response interceptors
    - TypeScript types for all API calls
  - **Testing**: Unit tests verify token injection; mock API responses
  - **Risk**: Token refresh logic; implement if token expires mid-request

---

## Phase 3: User Story Implementation (21 days, 106 SP)

### Phase 3a: P1 User Stories - Core Adoption Flow (10 days, 58 SP)

#### User Story 1: Browse Pets by Category

- [ ] T019 [P] [US1] Create GET `/api/v1/pets` endpoint with filtering and pagination in `petstore-backend/src/main/java/com/petstore/controller/PetController.java`
  - **Story**: US1  
  - **Effort**: 4 SP / 12 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Endpoint accepts query params: category, search, page (default 0), size (default 20)
    - Returns paginated response: `{data: [Pet], totalCount, page, pageSize}`
    - Category filtering works; search filters by name/breed/bio
    - Response time < 500ms (SC-001)
    - Tests verify filtering accuracy with 100+ pets in database
  - **Testing**: Integration test with sample data; verify filters work correctly
  - **Risk**: Performance with large datasets; add database indexes on category and name

- [ ] T020 [P] [US1] Create GET `/api/v1/categories` endpoint in `PetController.java`
  - **Story**: US1  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Returns array of categories: `[{id, name, speciesType}]`
    - Cached for 1 hour (low change frequency)
    - Response time < 100ms
  - **Testing**: Unit test verifies all categories returned; caching verified
  - **Risk**: Cache invalidation if categories updated; implement manual invalidation endpoint for admins

- [ ] T021 [P] [US1] Create Storefront page component in `petstore-frontend/src/pages/StorefrontPage.tsx`
  - **Story**: US1  
  - **Effort**: 5 SP / 16 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Sidebar with category list; clicking category filters pet grid
    - Main area displays pet grid with PetCard components
    - Search box with real-time filtering (debounced to 300ms)
    - Pagination controls (next/prev/page number)
    - "No pets found" message when filters return empty results
    - Responsive layout (Tailwind Grid)
    - Loading skeleton shown while fetching data
  - **Testing**: Component tests with React Testing Library; mock API responses
  - **Risk**: Performance with 5000+ pets; implement virtual scrolling if needed

- [ ] T022 [P] [US1] Create PetCard component in `petstore-frontend/src/components/PetCard.tsx`
  - **Story**: US1  
  - **Effort**: 3 SP / 8 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Card displays: pet photo, name, breed, age, brief bio
    - Clickable to navigate to detail page
    - Hover effect with Material-UI Card elevation
    - Responsive to mobile/tablet (though mobile secondary)
    - Image lazy loading
  - **Testing**: Snapshot test; unit test for click navigation
  - **Risk**: Image loading slow; ensure images optimized

#### User Story 2: View Detailed Pet Information

- [ ] T023 [P] [US2] Create GET `/api/v1/pets/{id}` endpoint in `PetController.java`
  - **Story**: US2  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Returns full pet object with all fields: name, species, breed, age, bio, photos (array), health status
    - Returns 404 if pet not found
    - Caches response for 10 minutes
  - **Testing**: Integration test with valid/invalid pet IDs
  - **Risk**: None

- [ ] T024 [P] [US2] Create PetDetailPage component in `petstore-frontend/src/pages/PetDetailPage.tsx`
  - **Story**: US2  
  - **Effort**: 5 SP / 16 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Fetches pet by ID from URL params
    - Displays pet info: name, breed, age, personality bio
    - Photo gallery with left/right navigation
    - Health status badge (if present)
    - "Add to Furever Home" button
    - "Back to Storefront" link
    - Error handling (pet not found)
    - Loading skeleton
  - **Testing**: Component test with mocked pet data; test gallery navigation
  - **Risk**: Image gallery performance; ensure smooth transitions

- [ ] T025 [P] [US2] Create PhotoGallery component in `petstore-frontend/src/components/PhotoGallery.tsx`
  - **Story**: US2  
  - **Effort**: 3 SP / 8 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Displays main photo with thumbnail strip below
    - Left/right arrows navigate between photos
    - Keyboard navigation (arrow keys)
    - Thumbnail click selects photo
    - Lightbox modal view option
  - **Testing**: Component test for navigation; test with multiple photo arrays
  - **Risk**: Performance with many photos; lazy load thumbnails

#### User Story 4: Multi-Step Adoption Application Form

- [ ] T026 [P] [US4] Create AdoptionApplication entity and repository in `petstore-backend/src/main/java/com/petstore/entity/AdoptionApplication.java`
  - **Story**: US4  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Entity fields: id, cartId, applicantName, email, address, homeType, formAnswers (JSON), status (enum), submittedAt, adminNotes
    - JSON column for form answers (PostgreSQL jsonb)
    - Relationship to Pet (which pets are being adopted)
  - **Testing**: JPA mapping test; JSON serialization verified
  - **Risk**: JSON schema validation; ensure form answers match expected structure

- [ ] T027 [P] [US4] Create POST `/api/v1/applications` endpoint in `petstore-backend/src/main/java/com/petstore/controller/ApplicationController.java`
  - **Story**: US4  
  - **Effort**: 4 SP / 12 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Accepts request body with applicant info and form answers
    - Validates all required fields (email format, address, etc.)
    - Saves application with timestamp and status = "Pending"
    - Returns created application with ID
    - Error handling for invalid inputs (400) and server errors (500)
  - **Testing**: Integration test with valid/invalid payloads; verify application saved
  - **Risk**: Concurrent submissions of same user; consider duplicate detection

- [ ] T028 [P] [US4] Create AdoptionFormPage component with multi-step form in `petstore-frontend/src/pages/AdoptionFormPage.tsx`
  - **Story**: US4  
  - **Effort**: 6 SP / 18 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Step 1: Personal Information (name, email, phone, address)
    - Step 2: Home Environment (home type, yard, other pets)
    - Step 3: Pet Care Commitment (experience, references, time available)
    - Step 4: Review & Confirm
    - Progress indicator showing current step
    - Next/Previous buttons (Previous disabled on Step 1)
    - Form state persisted in context; survives back navigation
    - Submit button on final step; calls API
    - Success confirmation with application ID displayed
  - **Testing**: Component test for multi-step flow; test data persistence
  - **Risk**: Form state loss on page refresh; implement draft saving to localStorage

- [ ] T029 [P] [US4] Create FormStepper component in `petstore-frontend/src/components/FormStepper.tsx`
  - **Story**: US4  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Material-UI Stepper component showing steps 1-4
    - Current step highlighted
    - Completed steps show checkmark
    - Step names clear (Personal Info, Home, Care, Review)
  - **Testing**: Snapshot test; unit test for step navigation
  - **Risk**: None

### Phase 3b: P2 User Stories - Cart & Admin (8 days, 38 SP)

#### User Story 3: Add Pets to Furever Home Cart

- [ ] T030 [P] [US3] Create cart context API in `petstore-frontend/src/context/CartContext.tsx` with add/remove/clear operations
  - **Story**: US3  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - useCart hook provides: addPet, removePet, clearCart, getCartItems, getCartCount
    - Cart state persists to localStorage
    - Prevents duplicate pets (or shows warning/confirmation)
    - Cart survives browser refresh
  - **Testing**: Hook test with localStorage mock; verify persistence
  - **Risk**: localStorage quota exceeded with many items; add error handling

- [ ] T031 [P] [US3] Create CartPage component in `petstore-frontend/src/pages/CartPage.tsx`
  - **Story**: US3  
  - **Effort**: 4 SP / 12 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Displays all pets in cart as table/list with photo, name, breed
    - Remove button for each pet
    - "Clear Cart" button
    - "Proceed to Adoption Form" button (disabled if cart empty)
    - Cart item count displayed prominently
    - Empty cart message
    - Total pet count shown
  - **Testing**: Component test with cart context; test add/remove operations
  - **Risk**: None

- [ ] T032 [P] [US3] Create cart persistence endpoint GET `/api/v1/cart` (optional, for server-side cart) in `petstore-backend/src/main/java/com/petstore/controller/CartController.java`
  - **Story**: US3  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Session-based cart retrieval (no authentication required initially)
    - Returns cart with pet IDs and metadata
    - Optional implementation; frontend can use localStorage for MVP
  - **Testing**: Integration test for cart operations
  - **Risk**: Session management complexity; defer if localStorage sufficient

#### User Story 5: Admin Inventory Management

- [ ] T033 [P] [US5] Create AdminDashboardPage component in `petstore-frontend/src/pages/AdminDashboardPage.tsx`
  - **Story**: US5  
  - **Effort**: 3 SP / 8 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Navigation tabs: Inventory, Health Status, Applications
    - Inventory tab shows all pets in table
    - "Add Pet" button opens form/modal
    - "Edit" and "Delete" buttons per pet row
    - Loading state and error handling
  - **Testing**: Component test with admin context; test tab navigation
  - **Risk**: Access control verification; ensure only admins see this page

- [ ] T034 [P] [US5] Create GET `/api/v1/admin/pets` endpoint with pagination in `petstore-backend/src/main/java/com/petstore/controller/AdminPetController.java`
  - **Story**: US5  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Requires admin authentication (JWT)
    - Returns paginated list of all pets (including unavailable)
    - Query params: page, size, status (filter by availability)
    - Response includes created_at, updated_at timestamps
  - **Testing**: Integration test with admin token; verify unauthorized access denied
  - **Risk**: Information leakage; ensure only admins access endpoint

- [ ] T035 [P] [US5] Create POST `/api/v1/admin/pets` endpoint for adding new pet in `AdminPetController.java`
  - **Story**: US5  
  - **Effort**: 3 SP / 8 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Requires admin authentication
    - Request body: name, species, breed, age, photos (array of URLs), bio, initial health status
    - Validates required fields; returns 400 on validation error
    - Creates pet and returns created object with ID
    - Handles concurrent creates correctly (no race conditions)
  - **Testing**: Integration test; create pet and verify in database
  - **Risk**: Photo URL validation; ensure only valid URLs stored

- [ ] T036 [P] [US5] Create PATCH `/api/v1/admin/pets/{id}` endpoint for editing pet in `AdminPetController.java`
  - **Story**: US5  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Requires admin authentication
    - Accepts any subset of pet fields (partial update)
    - Validates inputs; returns 400 on error
    - Updates pet and returns updated object
    - Returns 404 if pet not found
  - **Testing**: Integration test with partial updates; verify only changed fields updated
  - **Risk**: Partial update issues; ensure PUT vs PATCH semantics clear

- [ ] T037 [P] [US5] Create DELETE `/api/v1/admin/pets/{id}` endpoint in `AdminPetController.java`
  - **Story**: US5  
  - **Effort**: 1 SP / 3 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Requires admin authentication
    - Soft delete or hard delete (decision: soft delete to preserve audit trail)
    - Returns 404 if pet already deleted
    - Returns success response
  - **Testing**: Integration test; verify deleted pet not in public listings
  - **Risk**: Data loss; ensure backup strategy in place before implementing

- [ ] T038 [P] [US5] Create AddPetForm component in `petstore-frontend/src/components/AddPetForm.tsx`
  - **Story**: US5  
  - **Effort**: 4 SP / 12 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Form fields: name, species (dropdown), breed, age (number), bio (textarea), photos (URL inputs)
    - Form validation with error messages
    - Submit button calls API; shows loading state
    - Success message and form reset on success
    - Error handling with user feedback
  - **Testing**: Component test with form submission; verify API call
  - **Risk**: Photo upload vs. URL input; MVP uses URL input only

#### User Story 6: Manage Pet Health Status

- [ ] T039 [P] [US6] Create HealthStatus entity and repository in `petstore-backend/src/main/java/com/petstore/entity/HealthStatus.java`
  - **Story**: US6  
  - **Effort**: 1 SP / 3 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Enum or entity with values: Healthy, Under Veterinary Care, Vaccination Pending
    - Relationship to Pet (one pet has one current status)
    - Updated_at timestamp
  - **Testing**: JPA mapping test
  - **Risk**: None

- [ ] T040 [P] [US6] Create PATCH `/api/v1/admin/pets/{id}/health-status` endpoint in `AdminPetController.java`
  - **Story**: US6  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Requires admin authentication
    - Request body: status (enum), notes (optional)
    - Updates pet's health status
    - Returns updated pet with new status
    - Audit logs the status change
  - **Testing**: Integration test; verify status change persists
  - **Risk**: Health status impacts storefront; ensure visibility

- [ ] T041 [P] [US6] Display health status badge on PetCard and PetDetailPage in frontend components
  - **Story**: US6  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Health status badge appears on PetCard (storefront)
    - Badge color indicates status: Green (Healthy), Orange (Care), Red (Pending)
    - PetDetailPage shows full health status with notes (if any)
  - **Testing**: Component test; verify status displays correctly
  - **Risk**: None

- [ ] T042 [P] [US6] Create HealthStatusForm component for admin edit in `petstore-frontend/src/components/HealthStatusForm.tsx`
  - **Story**: US6  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Dropdown to select new status
    - Text field for optional notes
    - Submit button calls API
    - Success/error feedback
  - **Testing**: Component test with form submission
  - **Risk**: None

### Phase 3c: P3 User Story - Application Tracking (3 days, 10 SP)

#### User Story 7: Track Adoption Applications

- [ ] T043 [P] [US7] Create GET `/api/v1/admin/applications` endpoint in `petstore-backend/src/main/java/com/petstore/controller/AdminApplicationController.java`
  - **Story**: US7  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Requires admin authentication
    - Query params: status filter, petId filter, page, size
    - Returns paginated list of applications with applicant details
    - Response includes submission timestamp and current status
  - **Testing**: Integration test; verify filtering by status and pet
  - **Risk**: None

- [ ] T044 [P] [US7] Create GET `/api/v1/admin/applications/{id}` endpoint in `AdminApplicationController.java`
  - **Story**: US7  
  - **Effort**: 1 SP / 3 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Requires admin authentication
    - Returns full application with all details and pet list
    - Returns 404 if not found
  - **Testing**: Integration test
  - **Risk**: None

- [ ] T045 [P] [US7] Create PATCH `/api/v1/admin/applications/{id}/status` endpoint in `AdminApplicationController.java`
  - **Story**: US7  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Requires admin authentication
    - Request body: status (Pending, Under Review, Approved, Rejected), notes (optional)
    - Updates application and returns updated object
    - Logs status change with timestamp and admin who made change
  - **Testing**: Integration test; verify status update and audit trail
  - **Risk**: Status change notifications (future feature); log for email/notification integration

- [ ] T046 [P] [US7] Create ApplicationsTable component in `petstore-frontend/src/components/ApplicationsTable.tsx`
  - **Story**: US7  
  - **Effort**: 3 SP / 8 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Table with columns: Application ID, Applicant Name, Pet(s), Submission Date, Status
    - Status shown as badge (color-coded: blue pending, orange reviewing, green approved, red rejected)
    - Click row to view application details
    - Filter dropdown for status
    - Pagination controls
  - **Testing**: Component test with application data; test filtering
  - **Risk**: Large number of applications; add sorting/searching

- [ ] T047 [P] [US7] Create ApplicationDetailPage component in `petstore-frontend/src/pages/ApplicationDetailPage.tsx`
  - **Story**: US7  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Displays full application details: applicant info, pets selected, form answers
    - Status dropdown to change status
    - Notes field for admin comments
    - Save button calls API
    - Loading and error states
  - **Testing**: Component test; test status update submission
  - **Risk**: None

---

## Phase 4: Polish & Cross-Cutting Concerns (5 days, 13 SP)

### Objective
Implement error handling, performance optimization, testing, documentation, and deployment hardening.

- [ ] T048 [P] Add comprehensive error handling and validation messages across frontend (all pages, components) in `petstore-frontend/src/`
  - **Story**: Polish  
  - **Effort**: 3 SP / 8 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Try-catch blocks on all API calls
    - User-friendly error messages (avoid technical jargon)
    - Fallback UI for network failures
    - Toast notifications for errors and successes
    - 404/500 error pages
  - **Testing**: Manual testing of various error scenarios
  - **Risk**: Over-engineering; keep error messages simple

- [ ] T049 [P] Implement frontend loading skeletons and optimistic UI updates for better UX in key components (PetGrid, CartTable, etc.)
  - **Story**: Polish  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Frontend Dev  
  - **Acceptance Criteria**:
    - Skeleton loaders shown while fetching data
    - Optimistic cart updates (add pet, then confirm with API)
    - Smooth transitions and animations
  - **Testing**: Visual regression testing; manual verification
  - **Risk**: Overly complex animations; keep animations under 300ms

- [ ] T050 [P] Write integration tests for all critical backend endpoints and flows in `petstore-backend/src/test/`
  - **Story**: Polish  
  - **Effort**: 3 SP / 8 hours  
  - **Owner**: Backend Dev / QA  
  - **Acceptance Criteria**:
    - Integration tests for public endpoints: GET /pets, GET /pets/{id}, GET /categories
    - Integration tests for admin endpoints with authentication verification
    - Integration tests for application submission flow
    - Tests use TestRestTemplate or similar; mock external dependencies
    - All tests pass; code coverage > 70%
  - **Testing**: Run `mvn test`; verify coverage with JaCoCo
  - **Risk**: Flaky tests due to database state; use @DirtiesContext or transactions

- [ ] T051 [P] Write E2E tests for critical user flows (browse → detail → add to cart → apply) in `petstore-frontend/e2e/` using Cypress or Playwright
  - **Story**: Polish  
  - **Effort**: 3 SP / 8 hours  
  - **Owner**: QA / Frontend Dev  
  - **Acceptance Criteria**:
    - E2E test: User browse, clicks pet, views details, adds to cart
    - E2E test: User completes adoption form and submits
    - E2E test: Admin adds pet and views in storefront
    - Tests run in CI/CD pipeline
    - No flaky tests; deterministic results
  - **Testing**: Run tests in headless mode; verify pass rate 100%
  - **Risk**: E2E test fragility; use stable selectors and wait strategies

- [ ] T052 [P] Implement database connection pooling and query optimization in backend (Hikari, query analysis) in `petstore-backend/src/main/resources/application.properties`
  - **Story**: Polish  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Backend Lead  
  - **Acceptance Criteria**:
    - HikariCP configured with pool size 10-20
    - Query analysis: identify slow queries (> 100ms)
    - Indexes added to frequently filtered columns (category, availability)
    - Pagination enforced to limit result sets
    - Query timeout set to 30 seconds
  - **Testing**: Load test with 100 concurrent users; verify response times
  - **Risk**: Connection pool exhaustion; monitor in production

- [ ] T053 [P] Set up frontend performance monitoring and error tracking (Sentry or similar) in `petstore-frontend/src/main.tsx`
  - **Story**: Polish  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: DevOps / Frontend Dev  
  - **Acceptance Criteria**:
    - Sentry SDK integrated
    - Error reporting on unhandled exceptions
    - Performance metrics tracked (page load, interaction)
    - Dashboard set up for error monitoring
  - **Testing**: Trigger test error; verify appears in Sentry dashboard
  - **Risk**: Sensitive data logging; ensure PII not captured

- [ ] T054 [P] Implement rate limiting on public APIs to prevent abuse in `petstore-backend/src/main/java/com/petstore/config/RateLimitingConfig.java`
  - **Story**: Polish  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Backend Lead  
  - **Acceptance Criteria**:
    - Rate limiting: 100 requests per minute per IP for public endpoints
    - 10 requests per minute for login endpoint (brute force protection)
    - Graceful 429 Too Many Requests response
    - Whitelist for admin endpoints (higher limit)
  - **Testing**: Hammer endpoint; verify 429 response when limit exceeded
  - **Risk**: Distributed attacks; consider WAF in future

- [ ] T055 [P] Write comprehensive API documentation (Swagger/OpenAPI) in `petstore-backend/src/main/java/com/petstore/config/SwaggerConfig.java`
  - **Story**: Polish  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: Backend Dev  
  - **Acceptance Criteria**:
    - Swagger UI accessible at `/swagger-ui.html`
    - All endpoints documented with descriptions, parameters, responses
    - Authentication requirements clearly marked
    - Example request/response bodies provided
  - **Testing**: Swagger UI loads; all endpoints listed and documented
  - **Risk**: Documentation drift; enforce updates in PR reviews

- [ ] T056 [P] Create production deployment checklist and runbook in `docs/DEPLOYMENT.md`
  - **Story**: Polish  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: DevOps / Tech Lead  
  - **Acceptance Criteria**:
    - Pre-deployment checks (all tests pass, code reviewed)
    - Deployment steps for backend (DB migration, app restart)
    - Deployment steps for frontend (build, upload to CDN)
    - Rollback procedures documented
    - Post-deployment verification (health checks, smoke tests)
  - **Testing**: Walk through checklist; verify all steps clear
  - **Risk**: Deployment failures; practice runbook before production

- [ ] T057 [P] Verify CORS, HTTPS, and security headers configuration for production in `petstore-backend/src/main/java/com/petstore/config/SecurityConfig.java`
  - **Story**: Polish  
  - **Effort**: 2 SP / 6 hours  
  - **Owner**: DevOps / Security  
  - **Acceptance Criteria**:
    - CORS configured correctly for frontend domain (not *)
    - HTTPS enforced in production (redirect HTTP → HTTPS)
    - Security headers: X-Frame-Options, X-Content-Type-Options, CSP
    - CSRF protection enabled (if using sessions; JWT less critical)
  - **Testing**: Test with curl; verify headers present
  - **Risk**: Security misconfiguration; code review required

---

## Effort Summary & Scheduling

| Phase | Tasks | Story Points | Hours | Duration | Owner |
|-------|-------|--------------|-------|----------|-------|
| Phase 1 | T001-T007 | 13 | 50 | 5 days | Backend Lead, Frontend Lead, DevOps |
| Phase 2 | T008-T018 | 24 | 92 | 7 days | Backend Dev, Frontend Dev |
| Phase 3a (P1) | T019-T029 | 27 | 100 | 5 days | Backend Dev, Frontend Dev |
| Phase 3b (P2) | T030-T042 | 32 | 120 | 6 days | Backend Dev, Frontend Dev |
| Phase 3c (P3) | T043-T047 | 10 | 35 | 2 days | Backend Dev, Frontend Dev |
| Phase 4 | T048-T057 | 18 | 68 | 5 days | All roles |
| **TOTAL** | **57** | **124** | **465** | **8-10 weeks** | |

---

## Parallel Execution Strategy

### Week 1-2 (Phase 1 & Early Phase 2)
```
Backend Team:              Frontend Team:
├─ T001 (setup)           ├─ T005 (setup)
├─ T002 (DB)              ├─ T006 (deploy)
├─ T003 (Docker)          ├─ T017 (context)
├─ T004 (CI/CD)           └─ T018 (API client)
└─ T008 (schema)
```

### Week 3-4 (Phase 2 Foundation & Early P1 Features)
```
Backend:                   Frontend:
├─ T009 (Entities)        ├─ T021 (Storefront)
├─ T010 (Contracts)       ├─ T022 (PetCard)
├─ T011 (DTOs)            ├─ T024 (DetailPage)
├─ T012 (Security)        └─ T025 (Gallery)
├─ T013 (Auth)
├─ T014 (Repos)
├─ T015 (PetService)
├─ T016 (Error Handling)
└─ T019-T020 (Browse API)
```

### Week 5-6 (P1 Form & P2 Cart/Admin Startup)
```
Backend:                   Frontend:
├─ T026-T027 (App Form API) ├─ T028-T029 (Form UI)
├─ T030 (optional cart)   ├─ T031 (CartPage)
├─ T033-T036 (Admin APIs) ├─ T033-T034 (Dashboard, Forms)
└─ T039-T040 (Health API) └─ T038-T042 (Admin Forms)
```

### Week 7 (P2 Completion)
```
Backend & Frontend Continue:
├─ T043-T045 (Applications API)
└─ T046-T047 (Applications UI)
```

### Week 8-10 (Phase 4 Polish & QA)
```
All Roles:
├─ T048-T049 (Frontend Polish)
├─ T050-T051 (Testing)
├─ T052-T054 (Backend Optimization)
├─ T055-T057 (Docs, Security, Deployment)
└─ Smoke testing & bug fixes
```

---

## Dependencies & Risk Flags

### Critical Path (Blocking)
```
T001 → T002 → T008 → T009 → T014-T015 → T019 → T021
(Setup) → (DB) → (Schema) → (Entities) → (Repos) → (API) → (UI)
```

### High-Risk Tasks (⚠️)
- **T002** (Database): PostgreSQL Render setup; database credentials must be secured
- **T004** (CI/CD): Deployment pipeline misconfiguration could cause production outages
- **T012** (Security): JWT token handling; ensure no token leakage
- **T027** (Form API): Concurrent submissions; race conditions possible
- **T050-T051** (Testing): Flaky tests could block CI/CD; invest in reliability

### Medium-Risk Tasks
- **T021** (Storefront Performance): 5000+ pets could cause slowdowns; requires pagination/caching
- **T025** (Photo Gallery): Image loading performance; optimize images
- **T054** (Rate Limiting): Rate limit bypass attacks; monitor in production

---

## Testing & Quality Gates

### Testing Requirements by Phase

| Phase | Unit Tests | Integration Tests | E2E Tests | Performance Tests |
|-------|-----------|------------------|-----------|------------------|
| Phase 1 | ✓ | ✓ | — | — |
| Phase 2 | ✓ | ✓ | — | — |
| Phase 3 | ✓ | ✓ | ✓ | — |
| Phase 4 | ✓ | ✓ | ✓ | ✓ |

### Quality Gates
- **Code Coverage**: Minimum 70% for backend, 60% for frontend
- **Linting**: Zero errors; warnings allowed if justified
- **Type Safety**: TypeScript strict mode; no `any` types in new code
- **Performance**: API response time < 500ms (p95); Page load < 2s
- **Security**: No hardcoded credentials; HTTPS enforced; OWASP top 10 reviewed

---

## Acceptance Criteria Checklist (MVP Gate)

To proceed from MVP to Phase 3b, ALL of the following must be true:

- [ ] Phase 1 all tasks complete (setup, DB, Docker, CI/CD, docs)
- [ ] Phase 2 all tasks complete (entities, APIs, security, services)
- [ ] US1 (Browse) fully functional: real-time category filtering works; < 500ms response time
- [ ] US2 (Detail) fully functional: pet details load; photo gallery works
- [ ] US4 (Form) fully functional: multi-step form completes; applications saved to database
- [ ] All P1 APIs tested with integration tests (T019-T020, T023, T026-T027)
- [ ] All P1 UI components tested with React Testing Library (T021-T025, T028-T029)
- [ ] E2E test for browse → detail → form flow passes
- [ ] Code coverage > 70% backend, 60% frontend
- [ ] Swagger documentation complete and accurate
- [ ] Security review passed (authentication, CORS, input validation)
- [ ] Load test: 100 concurrent users; 95th percentile response time < 1s
- [ ] Deployment runbook reviewed and tested

---

## Notes for Development Team

1. **Agile Ceremonies**: Daily standup (15 min), Sprint planning (2 hours bi-weekly), Sprint review (1 hour), Retro (1 hour)
2. **Definition of Done**: Code reviewed, tests passing, documentation updated, deployed to staging
3. **Branch Strategy**: feature/T### for tasks; PR required for main/develop; auto-squash before merge
4. **Communication**: Slack #petstore-dev for discussions; GitHub Issues for tracking; decision log in docs/
5. **Holidays/Blockers**: Identify and plan around team availability upfront
6. **Tools**: GitHub for source control, Render for deployment, Sentry for monitoring, Swagger for API docs

---

**Generated**: 2026-05-05  
**Next Review**: After Phase 1 completion (end of Week 2)  
**Owner**: Tech Lead  
