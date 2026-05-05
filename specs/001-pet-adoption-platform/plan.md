# Implementation Plan: Pet Adoption Platform

**Feature Branch**: `001-pet-adoption-platform`  
**Created**: 2026-05-05  
**Status**: Draft  
**Technology Stack**: 
- Backend: Java Spring Boot + PostgreSQL
- Frontend: React + Tailwind CSS + Material-UI (MUI)
- Deployment: Docker + Render CI/CD

---

## 1. System Architecture

### Backend Architecture (Java Spring Boot)

**Components**:
- **REST API Layer**: Spring Web MVC handling HTTP requests/responses
- **Service Layer**: Business logic for pet browsing, cart management, adoption applications
- **Persistence Layer**: Spring Data JPA for database access with PostgreSQL
- **Security Layer**: Spring Security for admin authentication & authorization
- **Caching Layer**: Spring Cache with Redis (optional, for high-traffic scenarios)

**Deployment Unit**: Single monolithic backend service running on Render

```
Backend Service
├── Controllers (REST endpoints)
├── Services (business logic)
├── Repositories (database access)
├── Entities (JPA models)
├── DTOs (data transfer objects)
├── Utilities (filters, validators, helpers)
└── Config (Spring beans, security config)
```

### Frontend Architecture (React + Tailwind + MUI)

**Components**:
- **Pages**: Storefront, PetDetail, Cart, AdoptionForm, AdminDashboard
- **Layout Components**: Header, Sidebar (categories), Footer
- **Feature Components**: PetGrid, PetCard, CartTable, FormStepper, InventoryTable
- **Context API**: Global state for cart, user session, admin state
- **Custom Hooks**: usePets, useCart, useAdoptionForm

**Deployment Unit**: Static SPA served via Render frontend or CDN

```
Frontend Application
├── pages/
├── components/
├── hooks/
├── context/
├── services/ (API client)
├── styles/ (Tailwind + custom CSS)
└── utils/
```

### Integration Points

- **API Contract**: REST endpoints at `/api/v1/*` 
- **CORS**: Enable for frontend domain
- **Session Management**: JWT tokens for authenticated endpoints (admin operations)
- **Error Handling**: Standardized error response format with HTTP status codes
- **Rate Limiting**: Consider implementing for public endpoints (browsing, search)

---

## 2. API Design (RESTful Endpoints)

### Public Pet Browsing API

```
GET /api/v1/pets
  Query params: category, search, page, size
  Response: {data: [Pet], totalCount, page, pageSize}
  
GET /api/v1/pets/{id}
  Response: {Pet with full details}
  
GET /api/v1/categories
  Response: [Category]
  
GET /api/v1/health-statuses
  Response: [HealthStatus enum values]
```

### Cart Management API (Session-based, no auth required for v1)

```
GET /api/v1/cart
  Response: {cartId, pets: [Pet], createdAt, lastModifiedAt}
  
POST /api/v1/cart/add
  Body: {petId}
  Response: {cartId, pets: [Pet]}
  
DELETE /api/v1/cart/items/{petId}
  Response: {cartId, pets: [Pet]}
  
DELETE /api/v1/cart
  Response: {success}
```

### Adoption Applications API

```
POST /api/v1/applications
  Body: {cartId, applicantName, email, address, homeType, [...formFields]}
  Response: {applicationId, status, submittedAt}
  
GET /api/v1/applications/{id}
  Response: {AdoptionApplication with full details}
```

### Admin Inventory API (Requires Authentication)

```
GET /api/v1/admin/pets
  Response: {data: [Pet], totalCount}
  
POST /api/v1/admin/pets
  Body: {name, species, breed, age, photos: [urls], bio, healthStatus}
  Response: {Pet}
  
PATCH /api/v1/admin/pets/{id}
  Body: {name?, species?, breed?, age?, photos?, bio?, availability?, healthStatus?}
  Response: {Pet}
  
PATCH /api/v1/admin/pets/{id}/health-status
  Body: {status, notes}
  Response: {Pet}
  
DELETE /api/v1/admin/pets/{id}
  Response: {success}
```

### Admin Applications API (Requires Authentication)

```
GET /api/v1/admin/applications
  Query params: status, petId, page, size
  Response: {data: [AdoptionApplication], totalCount}
  
GET /api/v1/admin/applications/{id}
  Response: {AdoptionApplication with full details}
  
PATCH /api/v1/admin/applications/{id}/status
  Body: {status: "Pending|Under Review|Approved|Rejected", notes?}
  Response: {AdoptionApplication}
```

### Health Check & Meta API

```
GET /api/v1/health
  Response: {status: "UP", timestamp}
```

---

## 3. Database Schema

### PostgreSQL Design

#### Table: `categories`
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  species_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_species ON categories(species_type);
```

#### Table: `pets`
```sql
CREATE TABLE pets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL,
  breed VARCHAR(100),
  age INT,
  bio TEXT,
  category_id INT NOT NULL REFERENCES categories(id),
  availability_status VARCHAR(50) DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pets_category ON pets(category_id);
CREATE INDEX idx_pets_availability ON pets(availability_status);
CREATE INDEX idx_pets_name ON pets(name);
```

#### Table: `pet_photos`
```sql
CREATE TABLE pet_photos (
  id SERIAL PRIMARY KEY,
  pet_id INT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  photo_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pet_photos_pet ON pet_photos(pet_id);
```

#### Table: `health_statuses`
```sql
CREATE TABLE health_statuses (
  id SERIAL PRIMARY KEY,
  pet_id INT NOT NULL UNIQUE REFERENCES pets(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'Healthy',
  notes TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_statuses_pet ON health_statuses(pet_id);
CREATE INDEX idx_health_statuses_status ON health_statuses(status);
```

#### Table: `furever_home_carts`
```sql
CREATE TABLE furever_home_carts (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_carts_session ON furever_home_carts(session_id);
```

#### Table: `cart_items`
```sql
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INT NOT NULL REFERENCES furever_home_carts(id) ON DELETE CASCADE,
  pet_id INT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(cart_id, pet_id)
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_pet ON cart_items(pet_id);
```

#### Table: `adoption_applications`
```sql
CREATE TABLE adoption_applications (
  id SERIAL PRIMARY KEY,
  cart_id INT NOT NULL REFERENCES furever_home_carts(id),
  applicant_name VARCHAR(200) NOT NULL,
  applicant_email VARCHAR(200) NOT NULL,
  applicant_address TEXT NOT NULL,
  applicant_phone VARCHAR(20),
  home_type VARCHAR(50),
  form_answers JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  admin_notes TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_cart ON adoption_applications(cart_id);
CREATE INDEX idx_applications_status ON adoption_applications(status);
CREATE INDEX idx_applications_email ON adoption_applications(applicant_email);
CREATE INDEX idx_applications_submitted ON adoption_applications(submitted_at DESC);
```

#### Table: `admin_users` (for v1)
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(200) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
```

### Entity Relationships

```
Category (1) ←→ (N) Pet
Pet (1) ←→ (N) PetPhoto
Pet (1) ←→ (1) HealthStatus
Cart (1) ←→ (N) CartItem
CartItem (N) ←→ (1) Pet
Cart (1) ←→ (1) AdoptionApplication
```

---

## 4. Frontend Components Hierarchy

### Page Structure

```
App
├── Header
│   └── Navigation (Logo, Admin Login Link)
├── Router
│   ├── StorefrontPage
│   │   ├── Sidebar (CategoryFilter)
│   │   │   └── CategoryList
│   │   │       └── CategoryItem
│   │   └── MainContent
│   │       ├── SearchBar
│   │       └── PetGrid
│   │           └── PetCard (clickable)
│   ├── PetDetailPage
│   │   ├── PetGallery (photo carousel)
│   │   ├── PetInfo (name, breed, age, bio, health status)
│   │   └── AddToCartButton
│   ├── CartPage
│   │   ├── CartSummary
│   │   └── CartTable
│   │       └── CartItem (with remove action)
│   │       └── ProceedToFormButton
│   ├── AdoptionFormPage
│   │   ├── FormStepper (multi-step progress indicator)
│   │   └── FormStep (renders conditionally)
│   │       ├── Step1: PersonalInfo
│   │       ├── Step2: HomeEnvironment
│   │       ├── Step3: PetCareExperience
│   │       ├── Step4: ReviewSubmit
│   │       └── StepNavigation (back/next/submit)
│   ├── AdminDashboardPage (Protected)
│   │   ├── DashboardNav (Inventory, Applications)
│   │   ├── InventoryTab
│   │   │   ├── PetTable (with edit/delete actions)
│   │   │   └── AddPetModal (form for new pets)
│   │   └── ApplicationsTab
│   │       ├── ApplicationsTable (with status update)
│   │       └── ApplicationDetail (modal)
│   └── LoginPage (admin)
└── Footer
```

### Reusable Components

- **Button**: Primary, secondary, danger variants
- **Card**: Pet card, application card
- **Modal**: For forms and detail views
- **FormInput**: Controlled input with validation
- **Select**: Dropdown for categories, statuses
- **Table**: Data table with sorting, pagination
- **LoadingSpinner**: For async operations
- **ErrorBoundary**: Error handling UI
- **Toast**: Success/error notifications

### Global State (Context API)

```javascript
// CartContext: {cart, addPet, removePet, clearCart}
// AuthContext: {isAdmin, login, logout}
// PetsContext: {pets, loading, error, fetchPets, filterByCategory}
```

### Custom Hooks

```javascript
usePets(category, search)      // Fetch and filter pets
useCart()                       // CRUD cart operations
useAdoptionForm()               // Multi-step form state
usePagination(data, pageSize)   // Pagination logic
useLocalStorage(key)            // Persist data
useDebounce(value, delay)       // Debounce search input
```

---

## 5. Implementation Phases (Priority-Ordered User Stories)

### Phase 1: Core Storefront Discovery (Weeks 1-2)

**Objective**: Enable users to browse and discover pets with real-time filtering

**User Stories**:
1. **US1 - Browse Pets by Category** (P1)
   - Implement Category entity & API endpoints
   - Build Sidebar component with category list
   - Implement PetGrid component to display all pets
   - Add real-time filtering logic (debounce search input)
   - Backend: CategoryRepository, PetService.filterByCategory()
   - Frontend: usePets() hook, CategoryFilter component, PetGrid

2. **US2 - View Detailed Pet Information** (P1)
   - Implement Pet detail page with routing
   - Build PetGallery component (photo carousel)
   - Display full pet info: name, breed, age, bio, health status
   - Add "Add to Furever Home" button (no backend call yet)
   - Backend: PetService.getPetById(), PhotoRepository
   - Frontend: PetDetailPage, PetGallery component

**Deliverables**:
- Storefront UI fully functional (browsing, filtering, detail view)
- Pet categories and listings populated in database
- Basic Tailwind styling applied

**Testing**:
- Unit tests: CategoryService, PetService
- Integration tests: GET /api/v1/pets, GET /api/v1/pets/{id}
- E2E tests: Browse pets → click category → view detail → return to listings

---

### Phase 2: Shopping Cart & Form Foundation (Weeks 3-4)

**Objective**: Enable cart management and multi-step form submission

**User Stories**:
3. **US3 - Add Pets to Furever Home Cart** (P2)
   - Implement Cart entity with session-based tracking
   - Build CartContext for global state
   - Implement cart API endpoints (GET, POST, DELETE)
   - Build CartPage component with cart table
   - Add cart persistence (localStorage + backend session)
   - Backend: FureverHomeCartService, CartItemRepository
   - Frontend: CartContext, CartPage, CartTable component

4. **US4 - Multi-Step Adoption Application Form** (P1)
   - Implement AdoptionApplication entity
   - Build multi-step form with FormStepper component
   - Define form steps: PersonalInfo → HomeEnvironment → PetCareExperience → Review
   - Implement form validation on each step
   - Add draft state saving (optional: localStorage)
   - Backend: AdoptionApplicationService, validation logic
   - Frontend: AdoptionFormPage, FormStepper, useAdoptionForm() hook

**Deliverables**:
- Cart functionality fully working (add, remove, persist)
- Multi-step form rendering all steps
- Form submission endpoint created

**Testing**:
- Unit tests: AdoptionApplicationService validation
- Integration tests: POST /api/v1/applications
- E2E tests: Add pet to cart → navigate to form → complete all steps → submit

---

### Phase 3: Admin Capabilities (Week 5)

**Objective**: Enable admins to manage inventory, health status, and application tracking

**User Stories**:
5. **US5 - Admin Inventory Management** (P2)
   - Build AdminDashboardPage with protected routing
   - Implement Spring Security for admin authentication
   - Build InventoryTab with PetTable component
   - Implement Add/Edit Pet forms with photo upload handling
   - Build AddPetModal for new pet creation
   - Backend: AdminService, SecurityConfig, JWT token generation
   - Frontend: AdminDashboardPage, InventoryTab, PetTable, AddPetModal

6. **US6 - Manage Pet Health Status** (P2)
   - Add HealthStatus entity and repository
   - Build HealthStatus update modal in admin dashboard
   - Display health status on storefront pet profiles
   - Add health status badge/indicator to PetCard
   - Backend: HealthStatusService, PATCH endpoint
   - Frontend: HealthStatusModal component, PetCard update

7. **US7 - Track Adoption Applications** (P3)
   - Build ApplicationsTab with ApplicationsTable component
   - Implement status filtering (Pending, Under Review, Approved, Rejected)
   - Build ApplicationDetail modal showing full application
   - Add status update functionality
   - Backend: ApplicationService.updateStatus(), filtering logic
   - Frontend: ApplicationsTab, ApplicationDetail modal

**Deliverables**:
- Admin dashboard fully functional
- Admin authentication working (JWT tokens)
- Inventory management CRUD operations
- Application tracking and status management

**Testing**:
- Unit tests: AdminService, HealthStatusService
- Integration tests: Admin endpoints (PATCH, POST, DELETE)
- E2E tests: Admin login → add pet → update health status → manage applications

---

### Phase 4: Polish, Performance & Deployment (Week 6)

**Objective**: Optimize, test thoroughly, and deploy to production

**Tasks**:
- Real-time filtering performance optimization (debounce, pagination)
- API rate limiting and error handling
- Comprehensive E2E testing (Cypress/Playwright)
- Load testing: Render deployment configuration
- Docker containerization (both backend and frontend)
- Environment configuration (dev, staging, prod)
- Database backup strategy
- Monitoring setup (Render native + optional third-party)
- Cache strategy implementation (Redis optional based on load testing)

**Deliverables**:
- Fully tested, production-ready system
- Deployed on Render with CI/CD pipeline
- Performance baseline verified against SC-001 through SC-010

---

## 6. Technology Integration Details

### Java Spring Boot Backend

**Dependencies**:
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt</artifactId>
  <version>0.11.5</version>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
<dependency>
  <groupId>com.fasterxml.jackson.datatype</groupId>
  <artifactId>jackson-datatype-jsr310</artifactId>
</dependency>
```

**Configuration**:
- `application.yml`: Database connection, JWT secret, CORS settings
- `SecurityConfig.java`: JWT filter, authentication provider, CORS configuration
- `JpaConfig.java`: Entity scan, repository scan locations

**Key Classes**:
- `PetController.java`: REST endpoints for pet browsing
- `CartController.java`: Cart management endpoints
- `ApplicationController.java`: Adoption form endpoints
- `AdminController.java`: Admin-only inventory & application endpoints
- `JwtAuthenticationFilter.java`: Token-based auth middleware
- Repositories: `PetRepository`, `CartRepository`, `ApplicationRepository`, etc.
- Services: `PetService`, `CartService`, `ApplicationService`, `AdminService`

### React Frontend

**Dependencies**:
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "@mui/material": "^5.0.0",
  "@mui/icons-material": "^5.0.0",
  "@emotion/react": "^11.0.0",
  "@emotion/styled": "^11.0.0",
  "tailwindcss": "^3.0.0",
  "axios": "^1.0.0"
}
```

**Project Structure**:
```
src/
├── pages/
│   ├── StorefrontPage.jsx
│   ├── PetDetailPage.jsx
│   ├── CartPage.jsx
│   ├── AdoptionFormPage.jsx
│   └── AdminDashboardPage.jsx
├── components/
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── PetCard.jsx
│   ├── PetGrid.jsx
│   ├── PetGallery.jsx
│   ├── CartTable.jsx
│   ├── FormStepper.jsx
│   ├── InventoryTable.jsx
│   ├── ApplicationDetail.jsx
│   └── ...
├── context/
│   ├── CartContext.jsx
│   ├── AuthContext.jsx
│   └── PetsContext.jsx
├── hooks/
│   ├── usePets.js
│   ├── useCart.js
│   ├── useAdoptionForm.js
│   └── ...
├── services/
│   └── api.js (axios instance, endpoints)
├── styles/
│   ├── tailwind.config.js
│   └── index.css
└── App.jsx
```

**Styling Strategy**:
- **Tailwind CSS**: Utility-first approach for layout, spacing, colors
- **MUI Components**: Pre-built components (Button, Modal, Table, etc.)
- **Custom CSS**: Component-specific styling in CSS modules when needed
- **Responsive Design**: Mobile-first with breakpoints (sm, md, lg, xl)

### PostgreSQL Database

**Connection String** (Render):
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Initialization**:
- SQL migration scripts in `src/main/resources/db/migration/`
- Flyway or Liquibase for schema versioning (optional)
- Initial data seed: categories, sample pets

### Docker & Deployment

**Backend Dockerfile**:
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

**Frontend Dockerfile**:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Render Deployment**:
- Backend: Deploy Docker image from GitHub via Render
- Frontend: Deploy as static site or Docker via Render
- Environment variables: DATABASE_URL, JWT_SECRET, FRONTEND_URL
- PostgreSQL database: Render managed database instance

---

## 7. Testing Strategy

### Unit Testing (Backend)

**Framework**: JUnit 5 + Mockito

**Coverage Target**: 70%+ for services and repositories

**Test Classes**:
- `PetServiceTest`: Test filtering, searching, pagination
- `CartServiceTest`: Test add/remove/clear operations
- `ApplicationServiceTest`: Test validation, status updates
- `HealthStatusServiceTest`: Test health status updates
- `AdminServiceTest`: Test admin-only operations

**Example**:
```java
@SpringBootTest
public class PetServiceTest {
  @MockBean private PetRepository petRepository;
  @Autowired private PetService petService;
  
  @Test
  public void testFilterByCategory() {
    // Arrange
    // Act
    // Assert
  }
}
```

### Unit Testing (Frontend)

**Framework**: Jest + React Testing Library

**Coverage Target**: 70%+ for custom hooks and components

**Test Files**:
- `usePets.test.js`: Test fetch, filter, pagination
- `useCart.test.js`: Test add, remove, clear cart
- `PetCard.test.js`: Test rendering, click handlers
- `FormStepper.test.js`: Test step navigation, validation
- `useAdoptionForm.test.js`: Test form state management

**Example**:
```javascript
describe('useCart', () => {
  it('should add pet to cart', () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addPet(petId));
    expect(result.current.cart.pets).toHaveLength(1);
  });
});
```

### Integration Testing

**Framework**: 
- Backend: Spring Boot TestRestTemplate or MockMvc
- Frontend: React Testing Library with MSW (Mock Service Worker)

**Test Scenarios**:
- **Pet Browsing**: GET /api/v1/pets (all, filtered, paginated)
- **Cart Operations**: POST/DELETE cart items, validate persistence
- **Application Submission**: POST /api/v1/applications with validation
- **Admin Operations**: Admin login, pet CRUD, status updates
- **Concurrent Requests**: Two users adding same pet to cart

**Example Backend**:
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PetIntegrationTest {
  @Autowired private TestRestTemplate restTemplate;
  
  @Test
  public void testGetPetsWithCategory() {
    ResponseEntity<PetsResponse> response = 
      restTemplate.getForEntity("/api/v1/pets?category=Dogs", PetsResponse.class);
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
  }
}
```

### End-to-End Testing

**Framework**: Cypress or Playwright

**Critical User Flows**:
1. **Discovery Flow**: Load storefront → select category → view pet details → add to cart
2. **Application Flow**: View cart → proceed to form → fill all steps → submit application
3. **Admin Flow**: Login → add new pet → update health status → review application → update status

**Example**:
```javascript
describe('Complete Adoption Flow', () => {
  it('should complete pet adoption from storefront to form submission', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-cy=category-Dogs]').click();
    cy.get('[data-cy=pet-card]').first().click();
    cy.get('[data-cy=add-to-cart]').click();
    cy.get('[data-cy=view-cart]').click();
    cy.get('[data-cy=proceed-form]').click();
    // Fill form steps...
    cy.get('[data-cy=submit-application]').click();
    cy.contains('Application submitted successfully').should('be.visible');
  });
});
```

### Performance Testing

**Tools**: Apache JMeter, Wrk, or Render's built-in monitoring

**Scenarios**:
- 1000 concurrent users browsing pet listings (SC-004)
- Real-time filter response time < 500ms (SC-001)
- Pet listing page load < 2 seconds (SC-002)
- Admin dashboard with 10,000 applications

---

## 8. Performance & Scaling Optimization

### Frontend Optimization

**Code Splitting**:
- Route-based splitting using React.lazy()
- Lazy load admin dashboard (only for authenticated users)

**Image Optimization**:
- Serve WebP with fallback to JPEG
- Use responsive images with srcset
- Implement lazy loading for pet photos below fold
- Compress images: max 200KB per pet photo

**Rendering Optimization**:
- Memoize expensive components (useMemo, React.memo)
- Virtual scrolling for large pet lists (react-window)
- Debounce search input (300ms delay)
- Pagination: 20 pets per page

**Bundle Optimization**:
- Tree-shaking unused MUI components
- Minify and gzip on deployment
- Target bundle size < 500KB (gzipped)

### Backend Optimization

**Database Indexing** (already in schema):
- `idx_pets_category`: Fast category filtering
- `idx_pets_availability`: Fast availability filtering
- `idx_pet_photos_pet`: Fast photo retrieval
- `idx_applications_status`: Fast status filtering
- `idx_applications_submitted`: Fast sorting by date

**Caching Strategy**:
- **Cache Layer 1** (Application): Spring Cache for pet categories (TTL: 1 hour)
- **Cache Layer 2** (Database): PostgreSQL connection pooling (HikariCP)
- **Cache Layer 3** (Optional Redis)**: For sessions, cart data if scaling beyond 1K concurrent
- Invalidate cache on pet updates

**Query Optimization**:
- Use Pagination: `/api/v1/pets?page=0&size=20` (never fetch all)
- Eager load relationships: Pet + Category + HealthStatus in single query
- Use projection DTOs to avoid over-fetching fields

**Rate Limiting**:
- Implement request throttling: 100 requests/min per IP for public endpoints
- Use Spring's RateLimitingFilter or Bucket4j library

### Database Scaling

**Connection Pool**:
```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
```

**For 5,000+ Pets** (mentioned in assumptions):
- Ensure pagination is enforced
- Implement filtering at database level (WHERE clauses)
- Monitor slow query logs
- Add appropriate indices (already planned)

**Archiving**:
- Move old applications (>6 months) to archive table or cold storage

### Load Balancing (Future)

- Render auto-scales backend based on CPU/memory
- Consider multi-region deployment if global traffic

---

## 9. Deployment Strategy

### Docker Containerization

**Backend Build**:
```bash
mvn clean package -DskipTests
docker build -t petstore-backend:latest .
docker push [registry]/petstore-backend:latest
```

**Frontend Build**:
```bash
npm run build
docker build -t petstore-frontend:latest .
docker push [registry]/petstore-frontend:latest
```

### Render CI/CD Pipeline

**Backend Service Setup**:
- Connect GitHub repo to Render
- Trigger build on push to `001-pet-adoption-platform` branch
- Dockerfile: `FROM openjdk:17-jdk-slim`, start on port 8080
- Environment variables: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`
- Auto-deploy after successful build

**Frontend Service Setup**:
- Deploy as "Static Site" or "Web Service" with Docker
- Trigger build on same branch
- Build command: `npm install && npm run build`
- Public directory: `build/`
- Environment variables: `REACT_APP_API_URL=https://backend-service.onrender.com`

**Database Setup**:
- Create PostgreSQL instance on Render
- Initialize schema with SQL migration scripts
- Set `DATABASE_URL` in backend service environment
- Enable automated backups

**Deployment Steps**:
1. Push code to GitHub (branch: `001-pet-adoption-platform`)
2. Render detects push → triggers build
3. Backend: Runs tests, builds Docker image, deploys to service
4. Frontend: Builds React app, deploys static files
5. Database: Already running on Render
6. Services communicate via HTTPS

### Environment Configuration

**application.yml (Spring Boot)**:
```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate  # Use Flyway for migrations
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

server:
  servlet:
    context-path: /api
  
jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000  # 24 hours

cors:
  allowed-origins: ${FRONTEND_URL}
```

**.env (Frontend)**:
```
REACT_APP_API_URL=https://backend-service.onrender.com/api/v1
REACT_APP_ENVIRONMENT=production
```

### Database Migrations

Use Flyway for version-controlled schema:
```
src/main/resources/db/migration/
├── V1__initial_schema.sql
├── V2__add_health_statuses.sql
└── V3__add_indices.sql
```

Flyway auto-runs on application startup.

### Monitoring & Observability

**Render Built-in**:
- CPU, memory, disk usage
- Request/response metrics
- Logs streaming

**Application Logs**:
- Structured logging: SLF4J + Logback in Spring Boot
- Log errors, warnings, and key business events
- Log rotation: max 100MB per file

**Health Checks**:
- Render monitors `/api/health` endpoint
- Auto-restart on failure
- Set timeout to 30 seconds

**Optional Third-Party**:
- Datadog or New Relic for advanced APM
- Sentry for error tracking

### Backup & Disaster Recovery

**Database Backups**:
- Render: Automatic daily backups (7-day retention default)
- Manual backup before major deployments

**Code Backups**:
- GitHub is the source of truth
- Tag releases in Git

**Disaster Recovery Plan**:
- RTO (Recovery Time Objective): < 1 hour
- RPO (Recovery Point Objective): < 1 day
- Restore from Render backup or GitHub + database snapshot

### Security Considerations

**HTTPS**: All traffic over HTTPS (enforced by Render)
**JWT Tokens**: 
- Secret stored in Render environment variable
- 24-hour expiration for admin tokens
- Refresh token support (optional, v2)

**CORS**: Only allow frontend domain
**SQL Injection**: Use parameterized queries (JPA prevents this)
**XSS**: React auto-escapes JSX content
**CSRF**: Stateless JWT approach eliminates CSRF tokens

**Admin Authentication**:
- Email + password (hashed with bcrypt)
- No guest admin access
- Admin operations require valid JWT token

---

## Implementation Checklist

### Pre-Implementation Setup
- [ ] Repository structure created (backend, frontend, docker, docs)
- [ ] Technology stack verified (Spring Boot 3.x, React 18, PostgreSQL 14+)
- [ ] Development environment setup (IntelliJ/VS Code, Docker, Node.js 18+)
- [ ] Git workflow established (feature branch `001-pet-adoption-platform`)

### Phase 1 Deliverables
- [ ] Spring Boot project initialized with dependencies
- [ ] PostgreSQL schema created (categories, pets, pet_photos, health_statuses)
- [ ] PetController with GET endpoints
- [ ] PetService with filtering/searching logic
- [ ] React project scaffolded with Tailwind + MUI
- [ ] StorefrontPage, PetDetailPage, Sidebar components built
- [ ] usePets() hook implemented
- [ ] E2E test for discovery flow

### Phase 2 Deliverables
- [ ] FureverHomeCart entity and CartService
- [ ] CartController endpoints (GET, POST, DELETE)
- [ ] CartContext and useCart() hook
- [ ] CartPage component with table
- [ ] AdoptionApplication entity
- [ ] ApplicationController with POST endpoint
- [ ] AdoptionFormPage with FormStepper
- [ ] Form validation logic
- [ ] E2E test for application flow

### Phase 3 Deliverables
- [ ] Spring Security configuration + JWT
- [ ] AdminUser entity and authentication endpoint
- [ ] AdminController with CRUD endpoints
- [ ] HealthStatus entity and management
- [ ] AdminDashboardPage with InventoryTab and ApplicationsTab
- [ ] Protected routing (admin routes)
- [ ] Login modal/page
- [ ] E2E tests for admin flow

### Phase 4 Deliverables
- [ ] Performance optimization (debounce, pagination, caching)
- [ ] Comprehensive unit tests (70%+ coverage)
- [ ] Integration tests for all endpoints
- [ ] E2E tests for critical flows
- [ ] Load testing results
- [ ] Docker images created and tested
- [ ] Render CI/CD pipeline configured
- [ ] Environment variables set up
- [ ] Database migration scripts validated
- [ ] Monitoring and logging configured
- [ ] Security review completed
- [ ] Production deployment

---

## Success Criteria Mapping

| Criterion | Solution |
|-----------|----------|
| SC-001: Real-time filtering < 500ms | Debounce search input (300ms), pagination, database indexing |
| SC-002: Page load < 2s | Image optimization, code splitting, pagination, CDN (if needed) |
| SC-003: Full flow < 10 min | Streamlined UI/UX, fast API responses, form auto-save |
| SC-004: 1K concurrent users | Render auto-scaling, HikariCP connection pooling, caching |
| SC-005: 95% submission success | Form validation, error handling, retry logic |
| SC-006: Status updates < 1 min | WebSocket for real-time (optional v2), polling fallback |
| SC-007: Photo load < 2s | Image optimization, lazy loading, responsive sizing |
| SC-008: 90% first-time success | Intuitive UX, clear form instructions, error messages |
| SC-009: 99.5% availability | Render redundancy, health checks, auto-restart |
| SC-010: Cart persistence | localStorage + session backend, cookie tracking |

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| High concurrent cart updates | Data inconsistency | Implement row-level locking or optimistic concurrency |
| Same pet adopted twice | Business logic failure | Add transaction isolation, check availability before confirmation |
| Image upload failures | Missing pet photos | Fallback placeholder images, admin retry/re-upload functionality |
| Database scaling with 5K+ pets | Query performance | Pagination enforced, indices planned, archive old data |
| Admin user credentials leaked | Security breach | Use bcrypt, JWT expiration, HTTPS enforcement |
| Cart abandonment | Incomplete orders | Implement email reminders (optional v2), session persistence |

---

## Future Enhancements (v2+)

- OAuth authentication (Google, GitHub login)
- Email notifications (form submission, status updates)
- Real-time WebSocket for live pet availability
- Redis caching for high-traffic scenarios
- Advanced admin analytics dashboard
- Mobile app (React Native)
- Payment integration (for donations/premium features)
- User accounts and adoption history
- Pet matching algorithm (recommended pets based on profile)
- Community reviews/ratings for adopted pets
