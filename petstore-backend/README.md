# Pet Adoption Platform - Backend

Spring Boot REST API for the Pet Adoption Platform. Provides endpoints for pet browsing, adoption applications, and admin inventory management.

## Tech Stack

- **Framework**: Spring Boot 3.2.0
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA with Hibernate
- **Security**: Spring Security + JWT
- **API Docs**: Springdoc OpenAPI (Swagger UI)
- **Build**: Maven
- **Java Version**: 17

## Quick Start

### Prerequisites

- Java 17+
- Maven 3.9+
- PostgreSQL 14+
- Node.js 18+ (for running frontend)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd petstore-backend
   ```

2. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials.

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   
   The API will be available at `http://localhost:8080`

### Docker Setup

**Run all services** (Backend + Frontend + PostgreSQL):
```bash
docker-compose up -d
```

Services will be available at:
- Frontend: http://localhost
- Backend: http://localhost:8080
- PostgreSQL: localhost:5432

## API Endpoints

### Public Endpoints

**GET** `/api/v1/pets` - List available pets
- Query params: `page`, `size`, `categoryId`, `search`
- Example: `/api/v1/pets?page=0&size=20&categoryId=1`

**GET** `/api/v1/pets/{id}` - Get pet details

**GET** `/api/v1/categories` - List pet categories

**POST** `/api/v1/applications` - Submit adoption application

**GET** `/api/v1/health` - Health check

### Admin Endpoints (Require JWT Token)

**GET** `/api/v1/admin/pets` - List all pets

**POST** `/api/v1/admin/pets` - Create new pet

**PATCH** `/api/v1/admin/pets/{id}` - Update pet

**DELETE** `/api/v1/admin/pets/{id}` - Delete pet

**GET** `/api/v1/admin/applications` - List applications

**PATCH** `/api/v1/admin/applications/{id}/status` - Update application status

## Database Schema

The application uses Flyway for database migrations. Initial schema is created in:
- `src/main/resources/db/migration/V1_0_0__initial_schema.sql`

### Tables
- `categories` - Pet categories
- `pets` - Pet listings
- `pet_photos` - Pet photos
- `health_statuses` - Pet health information
- `adoption_applications` - Adoption application submissions

## Configuration

### application.properties

Key properties in `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/petstore
spring.datasource.username=postgres
spring.datasource.password=postgres

# Caching
spring.cache.type=simple
spring.cache.cache-names=pets,pet,categories

# JPA
spring.jpa.hibernate.ddl-auto=validate
```

## Logging

Logging configuration via `application.properties`:

```properties
logging.level.root=INFO
logging.level.com.petstore=DEBUG
logging.level.org.springframework.web=DEBUG
```

## Testing

Run tests:
```bash
mvn test
```

View coverage:
```bash
mvn jacoco:report
open target/site/jacoco/index.html
```

## API Documentation

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## Project Structure

```
petstore-backend/
├── src/main/java/com/petstore/
│   ├── controller/          # REST controllers
│   ├── service/             # Business logic
│   ├── repository/          # Data access (JPA)
│   ├── entity/              # JPA entities
│   ├── dto/                 # Data transfer objects
│   ├── exception/           # Custom exceptions & handlers
│   ├── config/              # Spring configurations
│   └── PetstoreBackendApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── db/migration/        # Flyway migrations
└── pom.xml
```

## Performance Considerations

- **Caching**: Pet and category data cached with simple cache provider
- **Pagination**: All list endpoints support pagination (default 20 items per page)
- **Database Indexes**: Created on frequently queried columns (category_id, availability_status, name)
- **Connection Pooling**: HikariCP configured for optimal pool size

## Security

- CORS configured for frontend domain
- JWT token validation for admin endpoints
- Password hashing with BCrypt
- SQL injection protection via parameterized queries (JPA)

## Troubleshooting

### Database Connection Error
Check PostgreSQL is running and credentials in `.env` are correct.

### Build Issues
```bash
mvn clean install -U  # Force update dependencies
```

### Port Already in Use
Change port in `application.properties`:
```properties
server.port=8081
```

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/name`
4. Submit pull request

## License

MIT License - See LICENSE file for details
