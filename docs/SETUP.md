# Pet Adoption Platform - Setup Guide

## Prerequisites

- **Java 17+** - Required for backend
- **Node.js 18+** - Required for frontend
- **PostgreSQL 14+** - Database
- **Docker & Docker Compose** (optional, for containerized setup)
- **Git** - Version control

## Installation

### Option 1: Docker Compose (Recommended)

Fastest way to run all services locally:

```bash
# Clone repository
git clone <repo-url>
cd petstore

# Start all services
docker-compose up

# Wait for all services to be healthy (~30 seconds)
```

Services will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Swagger Docs**: http://localhost:8080/swagger-ui.html
- **Database**: localhost:5432 (postgres/postgres)

To stop services:
```bash
docker-compose down
```

### Option 2: Manual Setup (Local Development)

#### Backend Setup

1. **Prerequisites**
   ```bash
   java -version  # Should be 17+
   mvn -version   # Should be 3.9+
   ```

2. **Start PostgreSQL**
   ```bash
   # On macOS with Homebrew
   brew services start postgresql

   # On Windows, use PostgreSQL installer
   # On Linux
   sudo service postgresql start
   ```

3. **Create database**
   ```bash
   psql -U postgres -c "CREATE DATABASE petstore;"
   ```

4. **Build backend**
   ```bash
   cd petstore-backend
   cp .env.example .env
   mvn clean install
   ```

5. **Run backend**
   ```bash
   mvn spring-boot:run
   ```
   
   Backend will start at http://localhost:8080

#### Frontend Setup

1. **Prerequisites**
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 9+
   ```

2. **Install and run**
   ```bash
   cd petstore-frontend
   cp .env.example .env
   npm install
   npm run dev
   ```
   
   Frontend will start at http://localhost:5173

### Option 3: IDE Setup (IntelliJ IDEA)

**Backend Development**
1. Open `petstore-backend` as project in IntelliJ
2. Configure project SDK: Java 17
3. Enable annotation processing for Lombok:
   - Settings → Compiler → Annotation Processors → Enable annotation processing
4. Run `PetstoreBackendApplication` from IDE
5. Set breakpoints and debug as needed

**Frontend Development**
1. Open `petstore-frontend` in VS Code or WebStorm
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open http://localhost:5173

## Configuration

### Backend (application.properties)

Key properties to configure:
```properties
# Database connection
spring.datasource.url=jdbc:postgresql://localhost:5432/petstore
spring.datasource.username=postgres
spring.datasource.password=postgres

# Server port (default 8080)
server.port=8080

# Logging level
logging.level.com.petstore=DEBUG
```

### Frontend (.env)

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Petstore
```

## Verification

### Backend Health Check

```bash
curl http://localhost:8080/api/v1/health
```

Expected response:
```json
{
  "status": "UP",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Frontend Access

Navigate to http://localhost:5173 and verify:
- ✅ Header with Petstore logo and navigation
- ✅ Category sidebar
- ✅ Pet listing grid
- ✅ Cart badge in header
- ✅ Search input works
- ✅ Click pet card navigates to detail page

### API Endpoints

Try some endpoints:

```bash
# Get all categories
curl http://localhost:8080/api/v1/categories

# Get pets (paginated)
curl http://localhost:8080/api/v1/pets?page=0&size=20

# Get specific pet
curl http://localhost:8080/api/v1/pets/1

# View API documentation
open http://localhost:8080/swagger-ui.html
```

## Database Access

### Using psql

```bash
psql -U postgres -d petstore

# List tables
\dt

# View pets
SELECT id, name, species, breed FROM pets;

# View categories
SELECT * FROM categories;

# Exit
\q
```

### Using DBeaver (GUI)
1. Download from https://dbeaver.io
2. Create connection to PostgreSQL
3. Host: localhost, Port: 5432
4. User: postgres, Password: postgres
5. Database: petstore

## Troubleshooting

### Port Already in Use

**Backend (8080)**
```bash
# macOS/Linux
lsof -i :8080
kill -9 <PID>

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Frontend (5173)**
Vite will automatically use next available port (5174, 5175, etc)

### Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready

# Check credentials in .env file
cat .env | grep DATABASE

# Verify database exists
psql -U postgres -c "\l" | grep petstore
```

### Build Errors

**Maven build fails**
```bash
cd petstore-backend
mvn clean install -U  # Force update dependencies
```

**npm install fails**
```bash
cd petstore-frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

If you see CORS errors in browser console:
1. Check backend is running and accessible
2. Verify VITE_API_BASE_URL in .env matches backend URL
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

## Development Workflow

### Making Changes

**Backend**
1. Edit Java code in `src/`
2. Backend automatically reloads with Spring DevTools
3. Test in http://localhost:8080/swagger-ui.html

**Frontend**
1. Edit React/TypeScript code in `src/`
2. Changes auto-reload in browser (Vite HMR)
3. Check browser console for TypeScript errors

### Testing

**Backend Unit Tests**
```bash
cd petstore-backend
mvn test
```

**Frontend Component Tests** (to be added)
```bash
cd petstore-frontend
npm test
```

## Production Deployment

### Build Docker Images

```bash
# Build all images
docker-compose build

# Or build individual services
docker build -t petstore-backend:latest ./petstore-backend
docker build -t petstore-frontend:latest ./petstore-frontend
```

### Deploy to Render

1. Push code to GitHub
2. Connect repository to Render
3. Create services:
   - **Backend**: Choose "Web Service", connect to backend folder
   - **Frontend**: Choose "Static Site", connect to frontend folder
   - **Database**: Create PostgreSQL instance
4. Set environment variables in Render dashboard
5. Deploy services

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Next Steps

1. **Explore the API**
   - Visit http://localhost:8080/swagger-ui.html
   - Try endpoints using "Try it out" button

2. **Add Sample Data**
   - Use admin endpoints to create pets (Phase 2)
   - Or SQL script to populate categories and sample pets

3. **Review Code**
   - Backend structure in `petstore-backend/src/main/java/com/petstore/`
   - Frontend structure in `petstore-frontend/src/`

4. **Run Tests**
   - Unit tests: `mvn test` (backend)
   - Integration tests: `mvn integration-test` (backend)

5. **View Logs**
   - Backend: Check terminal where `mvn spring-boot:run` is running
   - Frontend: Check browser console (F12)

## Support

For issues or questions:
1. Check [README.md](../README.md) files in backend and frontend
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. Check logs for error messages
4. Review tasks in specs/001-pet-adoption-platform/tasks.md

---

**Last Updated**: 2026-05-05
**Version**: 1.0.0
