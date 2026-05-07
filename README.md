# Pet Adoption Platform - Main README

A modern web application for pet adoption that helps potential pet owners find their perfect companion and complete adoption applications.

## Features

✨ **Pet Discovery**
- Browse pets by category (Dogs, Cats, Birds, Fish)
- Real-time search and filtering
- High-quality pet photos with gallery view
- Detailed pet information and personality bios
- Health status tracking

🛒 **Adoption Cart (Furever Home)**
- Add multiple pets to your adoption cart
- Persistent cart storage across sessions
- Quick cart management

📝 **Adoption Application Process**
- Multi-step adoption form
- Comprehensive applicant questionnaire
- Personality and compatibility questions
- Submission confirmation with application ID

🔐 **Admin Dashboard** (Phase 2+)
- Pet inventory management
- Health status tracking
- Adoption application tracking and review
- Application approval workflow

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Java 17, Spring Boot 3.2, Spring Data JPA, PostgreSQL |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Material-UI |
| **Database** | PostgreSQL 14+ with Flyway migrations |
| **Deployment** | Docker, Docker Compose, Render |
| **API** | RESTful with OpenAPI/Swagger documentation |

## Quick Start

### Prerequisites
- **Java 17+** (for backend)
- **Node.js 18+** (for frontend)
- **Docker & Docker Compose** (for containerized setup)
- **PostgreSQL 14+** (for database, not needed with Docker)

### Run Locally (Docker)

```bash
git clone <repo-url>
cd petstore

# Start all services (Backend + Frontend + Database)
docker-compose up

# Navigate to http://localhost
```

For detailed local setup instructions, see [docs/SETUP.md](./docs/SETUP.md).

## Project Structure

```
petstore/
├── petstore-backend/          # Spring Boot API server
│   ├── src/main/java/com/petstore/
│   │   ├── controller/        # REST endpoints
│   │   ├── service/           # Business logic
│   │   ├── repository/        # Database access (JPA)
│   │   ├── entity/            # Data models
│   │   ├── dto/               # Data transfer objects
│   │   ├── exception/         # Error handling
│   │   └── config/            # Spring configuration
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── db/migration/      # Flyway SQL migrations
│   ├── pom.xml                # Maven build config
│   └── README.md
│
├── petstore-frontend/         # React web application
│   ├── src/
│   │   ├── pages/             # Page components (routes)
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React Context (cart state)
│   │   ├── services/          # API client
│   │   ├── styles/            # CSS & Tailwind
│   │   ├── App.tsx            # Root component
│   │   └── main.tsx           # Entry point
│   ├── package.json           # npm dependencies
│   ├── vite.config.ts         # Vite build config
│   ├── tsconfig.json          # TypeScript config
│   └── README.md
│
├── docs/                      # Documentation
│   ├── SETUP.md               # Installation & setup guide
│   ├── ARCHITECTURE.md        # System design
│   ├── API.md                 # API documentation
│   └── DEPLOYMENT.md          # Production deployment
│
├── docker-compose.yml         # Multi-container setup
├── .github/workflows/         # CI/CD pipelines
└── specs/                     # Specification documents
    └── 001-pet-adoption-platform/
        ├── spec.md            # Feature specification
        ├── plan.md            # Implementation plan
        └── tasks.md           # Task breakdown
```

## API Endpoints

### Public Endpoints
```
GET  /api/v1/pets              # List pets (with filtering & pagination)
GET  /api/v1/pets/{id}         # Get pet details
GET  /api/v1/categories        # List pet categories
POST /api/v1/applications      # Submit adoption application
GET  /api/v1/health            # Health check
```

### Admin Endpoints (Phase 2+)
```
GET    /api/v1/admin/pets      # List all pets
POST   /api/v1/admin/pets      # Create pet
PATCH  /api/v1/admin/pets/{id} # Update pet
DELETE /api/v1/admin/pets/{id} # Delete pet
GET    /api/v1/admin/applications
PATCH  /api/v1/admin/applications/{id}/status
```

**API Documentation**: http://localhost:8080/swagger-ui.html

## Database Schema

### Key Tables
- **categories** - Pet categories (Dogs, Cats, Birds, Fish)
- **pets** - Pet listings with details
- **pet_photos** - Photo URLs for each pet
- **health_statuses** - Health tracking for pets
- **adoption_applications** - Submitted adoption forms

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md#data-model) for full schema details.

## Features by Phase

### Phase 1 - MVP (Complete ✅)
- Pet browsing by category
- Pet detail pages with galleries
- Add pets to adoption cart
- Multi-step adoption form
- Basic project setup

### Phase 2 (Planned)
- Admin inventory management
- Pet health status management
- Admin application dashboard
- JWT authentication
- Rate limiting

### Phase 3 (Planned)
- Application tracking for admins
- Status notifications
- Advanced search with Elasticsearch
- User accounts

## Development

### Backend Development
```bash
cd petstore-backend

# Build
mvn clean install

# Run locally
mvn spring-boot:run

# Run tests
mvn test

# View coverage
open target/site/jacoco/index.html
```

### Frontend Development
```bash
cd petstore-frontend

# Install dependencies
npm install

# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Testing

### Backend Tests
```bash
mvn test           # Unit tests
mvn integration-test  # Integration tests
```

### Frontend Tests
```bash
npm test
npm test -- --coverage
```

### E2E Tests (Phase 2)
```bash
npm run test:e2e
```

## Deployment

### Local Deployment (Docker Compose)
```bash
docker-compose up
# Services: Frontend (80), Backend (8080), Database (5432)
```

### Production Deployment (Render)
1. Push code to GitHub
2. Connect repository to Render
3. Configure environment variables
4. Deploy services

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

## Performance

- **Response Time**: Pet listing < 500ms (SC-001)
- **Page Load**: Storefront < 2 seconds
- **Concurrent Users**: Support 1,000+ concurrent users (SC-004)
- **Availability**: 99.5% uptime (SC-009)
- **Cart Persistence**: 24+ hour retention (SC-010)

## Documentation

- **[Setup Guide](./docs/SETUP.md)** - Installation and configuration
- **[Architecture](./docs/ARCHITECTURE.md)** - System design and patterns
- **[API Reference](./docs/API.md)** - Complete endpoint documentation
- **[Deployment](./docs/DEPLOYMENT.md)** - Production deployment guide
- **[Backend README](./petstore-backend/README.md)** - Backend specifics
- **[Frontend README](./petstore-frontend/README.md)** - Frontend specifics

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8080 (backend)
lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1;"

# Check database exists
psql -U postgres -c "\l" | grep petstore
```

### CORS Errors
1. Verify backend is running at configured URL
2. Check `.env` file has correct `VITE_API_BASE_URL`
3. Clear browser cache and hard refresh

For more troubleshooting, see [docs/SETUP.md#troubleshooting](./docs/SETUP.md#troubleshooting).

## Contributing

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes and test**
   ```bash
   mvn test          # Backend tests
   npm test          # Frontend tests
   ```

3. **Format code**
   ```bash
   mvn spotless:apply  # Backend
   npm run format      # Frontend
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add feature: ..."
   git push origin feature/your-feature
   ```

5. **Create pull request** on GitHub

## License

MIT License - See [LICENSE](./LICENSE) file for details.

## Support

Need help? Check these resources:
1. **[Setup Guide](./docs/SETUP.md)** - Installation instructions
2. **[Architecture](./docs/ARCHITECTURE.md)** - How the system works
3. **[Backend README](./petstore-backend/README.md)** - Java/Spring Boot specific
4. **[Frontend README](./petstore-frontend/README.md)** - React/TypeScript specific
5. **Specification**: [specs/001-pet-adoption-platform/spec.md](./specs/001-pet-adoption-platform/spec.md)

## Status

| Component | Status | Version |
|-----------|--------|---------|
| Backend API | ✅ Complete | 1.0.0 |
| Frontend SPA | ✅ Complete | 1.0.0 |
| Docker Setup | ✅ Complete | 1.0.0 |
| Admin Features | 🚧 Phase 2 | TBD |
| User Accounts | 🚧 Phase 3 | TBD |

---

**Created**: May 5, 2026  
**Last Updated**: May 5, 2026  
**Maintained By**: Pet Adoption Platform Team
