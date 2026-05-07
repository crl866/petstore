# Implementation Plan: Pet Browsing & Discovery

**Feature Branch**: `002-pet-browsing`  
**Created**: 2026-05-07  
**Status**: Draft  
**Technology Stack**:
- Backend: Java Spring Boot + PostgreSQL
- Frontend: React + Tailwind CSS
- Deployment: Docker + Docker Compose
- Package Structure: `com.david.*`

---

## 1. System Architecture

### Backend Architecture (Java Spring Boot)

**High-Level Components**:
```
Spring Boot Application (com.david.*)
├── API Layer (Controllers)
│   ├── PetController (/david/api/v1/pets)
│   └── CategoryController (/david/api/v1/categories)
├── Service Layer (Business Logic)
│   ├── PetService (pet retrieval, filtering)
│   ├── CategoryService (category management)
│   └── PhotoService (photo association)
├── Persistence Layer (Repositories)
│   ├── PetRepository
│   ├── CategoryRepository
│   ├── PetPhotoRepository
│   └── HealthStatusRepository
├── Entity Models (JPA)
│   ├── Pet
│   ├── Category
│   ├── PetPhoto
│   └── HealthStatus
├── DTOs (Data Transfer Objects)
│   ├── PetDTO
│   ├── CategoryDTO
│   ├── PetPhotoDTO
│   └── ApiResponse<T>
├── Exception Handling
│   ├── GlobalExceptionHandler
│   └── ResourceNotFoundException
└── Configuration
    ├── SecurityConfig (if needed for future auth)
    └── CacheConfig (optional: for performance)
```

**Package Structure**:
```
com.david.petstore
├── controller          # REST API endpoints
│   ├── PetController
│   └── CategoryController
├── service            # Business logic layer
│   ├── PetService
│   ├── CategoryService
│   └── PhotoService
├── repository         # Data access layer
│   ├── PetRepository
│   ├── CategoryRepository
│   ├── PetPhotoRepository
│   └── HealthStatusRepository
├── entity            # JPA entity models
│   ├── Pet
│   ├── Category
│   ├── PetPhoto
│   ├── HealthStatus
│   └── HealthStatusEnum
├── dto               # Data transfer objects
│   ├── PetDTO
│   ├── CategoryDTO
│   ├── PetPhotoDTO
│   └── ApiResponse
├── exception         # Custom exceptions
│   ├── GlobalExceptionHandler
│   └── ResourceNotFoundException
├── config            # Spring configuration
│   ├── SecurityConfig
│   └── CacheConfig
└── PetstoreBackendApplication.java
```

**Request/Response Flow**:
```
HTTP Request
    ↓
PetController / CategoryController
    ↓
PetService / CategoryService
    ↓
PetRepository / CategoryRepository
    ↓
PostgreSQL Database
    ↑
Entity → DTO Conversion
    ↑
HTTP Response (JSON)
```

### Frontend Architecture (React + Tailwind CSS)

**Component Structure**:
```
React Application
├── pages/
│   ├── StorefrontPage.tsx       # Main pet browsing page
│   └── PetDetailPage.tsx        # Individual pet details
├── components/
│   ├── Header.tsx               # Navigation header
│   ├── CategorySidebar.tsx       # Category filter list (NEW)
│   ├── PetGrid.tsx              # Grid layout for pet cards (NEW)
│   ├── PetCard.tsx              # Individual pet card display
│   ├── PhotoGallery.tsx         # Multi-image viewer
│   └── Footer.tsx               # Footer section
├── services/
│   ├── apiClient.ts             # Axios/fetch HTTP client
│   └── petService.ts            # Pet API service layer (NEW)
├── context/
│   └── PetFilterContext.tsx      # Category filter state (NEW)
├── hooks/
│   ├── usePets.ts               # Fetch and manage pet list (NEW)
│   ├── useCategories.ts         # Fetch categories (NEW)
│   └── usePetDetail.ts          # Fetch single pet details (NEW)
├── types/
│   └── index.ts                 # TypeScript interfaces (NEW)
└── styles/
    └── index.css                # Global + Tailwind CSS
```

**Data Flow**:
```
StorefrontPage
    ├── CategorySidebar (displays categories)
    │   └── useCategories hook → CategoryController
    ├── PetGrid (displays pet list)
    │   └── usePets hook → PetController
    └── PetFilterContext (manages selected category)

PetDetailPage
    └── PhotoGallery (photo carousel)
        └── usePetDetail hook → PetController
```

### Integration Points

**API Base Path**: `/david/api/v1`

**API Endpoints**:
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/david/api/v1/categories` | Fetch all pet categories |
| GET | `/david/api/v1/pets` | Fetch all pets (with optional category filter) |
| GET | `/david/api/v1/pets/{petId}` | Fetch single pet details |

**CORS Configuration**:
- Allow frontend origin to call backend API
- No authentication required for browsing (public endpoints)

**Error Handling**:
```json
{
  "success": false,
  "message": "Resource not found",
  "status": 404,
  "data": null
}
```

---

## 2. Database Schema

### Entity: Category

```sql
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Properties**:
- `id`: Auto-generated primary key
- `name`: Category name (e.g., "Dogs", "Cats", "Birds")
- `description`: Optional category description
- `created_at`: Creation timestamp
- `updated_at`: Last modification timestamp

### Entity: Pet

```sql
CREATE TABLE pet (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);
```

**Properties**:
- `id`: Auto-generated primary key
- `name`: Pet name
- `description`: Detailed pet description (for detail page)
- `category_id`: Foreign key to Category
- `created_at`: Creation timestamp
- `updated_at`: Last modification timestamp

### Entity: PetPhoto

```sql
CREATE TABLE pet_photo (
    id SERIAL PRIMARY KEY,
    pet_id INT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pet(id) ON DELETE CASCADE
);
```

**Properties**:
- `id`: Auto-generated primary key
- `pet_id`: Foreign key to Pet
- `photo_url`: URL of the photo
- `display_order`: Order for displaying multiple photos in gallery
- `created_at`: Creation timestamp

### Entity: HealthStatus

```sql
CREATE TABLE health_status (
    id SERIAL PRIMARY KEY,
    pet_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,  -- healthy, vaccinated, neutered, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pet(id) ON DELETE CASCADE
);
```

**Properties**:
- `id`: Auto-generated primary key
- `pet_id`: Foreign key to Pet
- `status`: Health status enum value
- `created_at`: Creation timestamp
- `updated_at`: Last modification timestamp

### Relationships

```
Category (1) ──── (M) Pet
                   ↓
             (1) ──── (M) PetPhoto
             (1) ──── (M) HealthStatus
```

### Migration Script (Flyway)

File: `src/main/resources/db/migration/V2_0_0__pet_browsing_schema.sql`

```sql
-- Categories
INSERT INTO category (name, description) VALUES 
('Dogs', 'Friendly canine companions'),
('Cats', 'Independent feline friends'),
('Birds', 'Colorful feathered pets');

-- Sample Pet Data (with photos and health status populated)
INSERT INTO pet (name, description, category_id) VALUES 
('Buddy', 'A friendly Golden Retriever mix', 1),
('Whiskers', 'Playful tabby cat', 2),
('Polly', 'Bright green parrot', 3);

-- Photos for each pet
INSERT INTO pet_photo (pet_id, photo_url, display_order) VALUES 
(1, '/images/buddy-1.jpg', 0),
(1, '/images/buddy-2.jpg', 1),
(2, '/images/whiskers-1.jpg', 0),
(3, '/images/polly-1.jpg', 0);

-- Health statuses
INSERT INTO health_status (pet_id, status) VALUES 
(1, 'healthy'),
(1, 'vaccinated'),
(2, 'healthy'),
(3, 'healthy');
```

---

## 3. REST API Endpoints

### GET /david/api/v1/categories

**Purpose**: Fetch all available pet categories

**Request**:
```
GET /david/api/v1/categories
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Dogs",
      "description": "Friendly canine companions"
    },
    {
      "id": 2,
      "name": "Cats",
      "description": "Independent feline friends"
    },
    {
      "id": 3,
      "name": "Birds",
      "description": "Colorful feathered pets"
    }
  ],
  "status": 200
}
```

**Implementation** (Controller):
```java
@RestController
@RequestMapping("/david/api/v1")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Categories retrieved successfully", categories, 200)
        );
    }
}
```

---

### GET /david/api/v1/pets

**Purpose**: Fetch all pets with optional category filtering

**Request**:
```
GET /david/api/v1/pets?categoryId=1&page=0&size=10
```

**Query Parameters**:
- `categoryId` (optional): Filter by category ID
- `page` (optional): Page number (0-indexed), default 0
- `size` (optional): Number of results per page, default 10

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Pets retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Buddy",
      "description": "A friendly Golden Retriever mix",
      "category": {
        "id": 1,
        "name": "Dogs"
      },
      "photos": [
        {
          "id": 1,
          "photoUrl": "/images/buddy-1.jpg",
          "displayOrder": 0
        },
        {
          "id": 2,
          "photoUrl": "/images/buddy-2.jpg",
          "displayOrder": 1
        }
      ],
      "healthStatuses": ["healthy", "vaccinated"]
    }
  ],
  "status": 200
}
```

**Implementation** (Service Layer):
```java
@Service
public class PetService {
    
    @Autowired
    private PetRepository petRepository;
    
    public List<PetDTO> getPets(Integer categoryId) {
        List<Pet> pets;
        if (categoryId != null) {
            pets = petRepository.findByCategoryId(categoryId);
        } else {
            pets = petRepository.findAll();
        }
        return pets.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    private PetDTO convertToDTO(Pet pet) {
        PetDTO dto = new PetDTO();
        dto.setId(pet.getId());
        dto.setName(pet.getName());
        dto.setDescription(pet.getDescription());
        dto.setCategory(new CategoryDTO(pet.getCategory()));
        dto.setPhotos(pet.getPhotos().stream()
            .map(PetPhotoDTO::new)
            .collect(Collectors.toList()));
        dto.setHealthStatuses(pet.getHealthStatuses().stream()
            .map(HealthStatus::getStatus)
            .collect(Collectors.toList()));
        return dto;
    }
}
```

---

### GET /david/api/v1/pets/{petId}

**Purpose**: Fetch detailed information for a specific pet

**Request**:
```
GET /david/api/v1/pets/1
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Pet retrieved successfully",
  "data": {
    "id": 1,
    "name": "Buddy",
    "description": "A friendly Golden Retriever mix who loves to play fetch and swim. Buddy is energetic, affectionate, and great with families.",
    "category": {
      "id": 1,
      "name": "Dogs",
      "description": "Friendly canine companions"
    },
    "photos": [
      {
        "id": 1,
        "photoUrl": "/images/buddy-1.jpg",
        "displayOrder": 0
      },
      {
        "id": 2,
        "photoUrl": "/images/buddy-2.jpg",
        "displayOrder": 1
      }
    ],
    "healthStatuses": ["healthy", "vaccinated", "neutered"]
  },
  "status": 200
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "message": "Pet not found with id: 999",
  "data": null,
  "status": 404
}
```

**Implementation** (Controller):
```java
@RestController
@RequestMapping("/david/api/v1")
public class PetController {
    
    @Autowired
    private PetService petService;
    
    @GetMapping("/pets")
    public ResponseEntity<ApiResponse<List<PetDTO>>> getPets(
            @RequestParam(required = false) Integer categoryId) {
        List<PetDTO> pets = petService.getPets(categoryId);
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Pets retrieved successfully", pets, 200)
        );
    }
    
    @GetMapping("/pets/{petId}")
    public ResponseEntity<ApiResponse<PetDTO>> getPetById(@PathVariable Long petId) {
        PetDTO pet = petService.getPetById(petId);
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Pet retrieved successfully", pet, 200)
        );
    }
}
```

---

## 4. Frontend Implementation

### Pages

#### StorefrontPage.tsx

**Purpose**: Main browsing page with category filter and pet list

**Features**:
- Displays list of categories in left sidebar
- Shows grid of pet cards
- Filters pets by selected category
- Handles loading and error states

**State Management**:
- `selectedCategoryId`: Currently selected category
- `pets`: List of pets to display
- `categories`: List of available categories
- `isLoading`: Loading state
- `error`: Error state

**Component Hierarchy**:
```
StorefrontPage
├── CategorySidebar
│   └── Category items (clickable)
├── PetGrid
│   ├── PetCard
│   ├── PetCard
│   └── PetCard (mapped from pets array)
└── No Pets Message (conditional)
```

**Pseudo Code**:
```typescript
const StorefrontPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { pets, isLoading: petsLoading } = usePets(selectedCategoryId);
  
  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };
  
  return (
    <div className="flex">
      <CategorySidebar 
        categories={categories}
        onCategorySelect={handleCategorySelect}
      />
      <div className="flex-1">
        {petsLoading ? <LoadingSpinner /> : <PetGrid pets={pets} />}
        {pets.length === 0 && <NoPetsMessage />}
      </div>
    </div>
  );
};
```

#### PetDetailPage.tsx

**Purpose**: Display detailed information about a single pet

**Features**:
- Shows pet name, full description, category
- Displays photo gallery with navigation
- Shows health status badges
- Back navigation to storefront

**Pseudo Code**:
```typescript
const PetDetailPage = () => {
  const { petId } = useParams();
  const { pet, isLoading, error } = usePetDetail(petId);
  const navigate = useNavigate();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <div className="pet-detail-content">
        <PhotoGallery photos={pet.photos} />
        <div className="pet-info">
          <h1>{pet.name}</h1>
          <p>{pet.description}</p>
          <span>{pet.category.name}</span>
          <HealthStatusBadges statuses={pet.healthStatuses} />
        </div>
      </div>
    </div>
  );
};
```

### Components

#### CategorySidebar.tsx

**Purpose**: Display clickable list of pet categories

**Props**:
```typescript
interface CategorySidebarProps {
  categories: CategoryDTO[];
  onCategorySelect: (categoryId: number | null) => void;
}
```

**Features**:
- "All Pets" option at top
- Clickable category items
- Visual indicator of selected category
- Loading state

#### PetGrid.tsx

**Purpose**: Display pets in responsive grid layout

**Props**:
```typescript
interface PetGridProps {
  pets: PetDTO[];
}
```

**Features**:
- 3-4 column grid on desktop
- Responsive layout (tablets 2-3 columns)
- Maps PetCard components
- Handles empty state

#### PetCard.tsx

**Purpose**: Display individual pet in compact card format

**Props**:
```typescript
interface PetCardProps {
  pet: PetDTO;
}
```

**Features**:
- Pet image (first photo)
- Pet name
- Category badge
- Clickable navigation to detail page
- Hover effects

**Styling** (Tailwind):
```html
<div class="rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
  <img class="w-full h-48 object-cover rounded-t-lg" />
  <div class="p-4">
    <h3 class="font-bold text-lg">Pet Name</h3>
    <span class="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded">
      Category
    </span>
  </div>
</div>
```

#### PhotoGallery.tsx

**Purpose**: Display multiple pet photos with navigation

**Props**:
```typescript
interface PhotoGalleryProps {
  photos: PetPhotoDTO[];
}
```

**Features**:
- Carousel/slideshow of photos
- Previous/Next buttons
- Thumbnail preview (if multiple photos)
- Placeholder for missing photos
- Sorted by displayOrder

### Services

#### petService.ts

**Purpose**: Encapsulate API calls for pet-related operations

**Functions**:
```typescript
export const petService = {
  getCategories: async (): Promise<CategoryDTO[]> => {
    const response = await apiClient.get('/david/api/v1/categories');
    return response.data.data;
  },
  
  getPets: async (categoryId?: number): Promise<PetDTO[]> => {
    const params = categoryId ? { categoryId } : {};
    const response = await apiClient.get('/david/api/v1/pets', { params });
    return response.data.data;
  },
  
  getPetById: async (petId: number): Promise<PetDTO> => {
    const response = await apiClient.get(`/david/api/v1/pets/${petId}`);
    return response.data.data;
  }
};
```

### Custom Hooks

#### useCategories.ts

```typescript
export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await petService.getCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  return { categories, isLoading, error };
};
```

#### usePets.ts

```typescript
export const usePets = (categoryId: number | null) => {
  const [pets, setPets] = useState<PetDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setIsLoading(true);
        const data = await petService.getPets(categoryId || undefined);
        setPets(data);
      } catch (err) {
        setError('Failed to load pets');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPets();
  }, [categoryId]);
  
  return { pets, isLoading, error };
};
```

#### usePetDetail.ts

```typescript
export const usePetDetail = (petId: string | undefined) => {
  const [pet, setPet] = useState<PetDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!petId) return;
    
    const fetchPet = async () => {
      try {
        const data = await petService.getPetById(parseInt(petId));
        setPet(data);
      } catch (err) {
        setError('Failed to load pet details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPet();
  }, [petId]);
  
  return { pet, isLoading, error };
};
```

### TypeScript Types

```typescript
// types/index.ts

export interface CategoryDTO {
  id: number;
  name: string;
  description?: string;
}

export interface PetPhotoDTO {
  id: number;
  photoUrl: string;
  displayOrder: number;
}

export interface PetDTO {
  id: number;
  name: string;
  description: string;
  category: CategoryDTO;
  photos: PetPhotoDTO[];
  healthStatuses: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}
```

---

## 5. Deployment Strategy

### Docker Containerization

#### Backend Dockerfile
```dockerfile
FROM openjdk:17-slim as build
WORKDIR /app
COPY petstore-backend .
RUN mvn clean package -DskipTests

FROM openjdk:17-slim
WORKDIR /app
COPY --from=build /app/target/petstore-backend-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Environment Variables**:
- `SPRING_DATASOURCE_URL`: PostgreSQL connection string
- `SPRING_DATASOURCE_USERNAME`: Database user
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: Migration setting (validate)

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY petstore-frontend .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: petstore
      POSTGRES_USER: petstore_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U petstore_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: petstore-backend/Dockerfile
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/petstore
      SPRING_DATASOURCE_USERNAME: petstore_user
      SPRING_DATASOURCE_PASSWORD: secure_password
      SPRING_JPA_HIBERNATE_DDL_AUTO: validate
    ports:
      - "8080:8080"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: .
      dockerfile: petstore-frontend/Dockerfile
    depends_on:
      - backend
    ports:
      - "80:80"
    environment:
      VITE_API_BASE_URL: http://backend:8080

volumes:
  postgres_data:
```

### Deployment Flow

**Local Development**:
```bash
docker-compose up -d
# Access frontend at http://localhost
# API at http://localhost:8080/david/api/v1
```

**Production Deployment** (e.g., to cloud):
1. Build Docker images for backend and frontend
2. Push to container registry
3. Deploy with orchestration tool (Docker Swarm, Kubernetes, etc.)
4. Configure environment variables for production DB
5. Set up reverse proxy (nginx) for routing
6. Enable HTTPS with SSL certificates

### Health Checks

- **Backend**: `GET /health` endpoint (Spring Boot Actuator)
- **Database**: Connection pool and query validation
- **Frontend**: HTTP 200 response from Nginx

### Performance Considerations

1. **Database Indexing**: Add indexes on `pet.category_id`, `pet_photo.pet_id`, `health_status.pet_id`
2. **Caching**: Consider Spring Cache for category list (changes infrequently)
3. **Image Optimization**: Serve images from CDN in production
4. **API Response Pagination**: Implement for large pet lists
5. **Frontend Code Splitting**: Lazy load detail page components

---

## 6. Development Workflow

### Backend Setup

```bash
cd petstore-backend
# Add to pom.xml if not present: Spring Web, Spring Data JPA, PostgreSQL Driver
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

**Key Dependencies** (pom.xml):
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
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

### Frontend Setup

```bash
cd petstore-frontend
npm install
npm run dev
# Access at http://localhost:5173 (Vite default)
```

**Key Dependencies** (package.json):
- React 18+
- React Router v6
- Tailwind CSS
- Axios (for HTTP)

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/002-pet-browsing

# Development commits
git add <files>
git commit -m "feat: add category filtering"

# Push and create PR when ready
git push origin feature/002-pet-browsing
```

---

## 7. Testing Strategy

### Backend Testing

**Unit Tests** (Service Layer):
```java
@Test
public void testGetPetsByCategory() {
    List<Pet> pets = petService.getPets(1);
    assertThat(pets).hasSize(2);
    assertThat(pets.get(0).getCategory().getId()).isEqualTo(1);
}
```

**Integration Tests** (Controller):
```java
@Test
public void testGetPetsEndpoint() {
    mockMvc.perform(get("/david/api/v1/pets?categoryId=1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true));
}
```

### Frontend Testing

**Component Tests**:
- PetCard renders correctly with props
- CategorySidebar handles category selection
- PetGrid displays pet list

**E2E Tests**:
- User can browse categories
- Pet list updates on category selection
- Pet detail page loads all information

---

## 8. Success Metrics

| Requirement | Target | Validation |
|-------------|--------|-----------|
| Categories load within 2s | ≤ 2000ms | Browser DevTools network |
| Pet list updates on filter | ≤ 1000ms | Browser DevTools |
| Detail page loads fully | ≤ 3000ms | Lighthouse performance |
| Photo gallery scrolls smoothly | 60 FPS | Chrome DevTools |
| No layout issues on 1920px | 100% | Visual regression tests |
| No layout issues on 768px | 100% | Responsive design tests |
| Handles 100+ concurrent users | ≤ 500ms avg | Load testing |
| All data displays accurately | 100% | Integration tests |

---

## 9. Dependencies & Constraints

### Backend Dependencies
- Java 17+
- Spring Boot 3.0+
- PostgreSQL 12+
- Maven 3.8+

### Frontend Dependencies
- Node.js 18+
- npm 9+
- React 18+
- TypeScript 5+

### Infrastructure
- Docker & Docker Compose
- PostgreSQL database (persistent volume)
- Network connectivity between services

### Assumptions
- Database already initialized with base tables
- Flyway migration runner configured
- Photo URLs point to accessible endpoints
- Frontend CORS configured to call backend
- No authentication required for MVP browsing

---

## 10. Phased Implementation

### Phase 1: Backend API (Week 1)
- [ ] Create entity classes (Pet, Category, PetPhoto, HealthStatus)
- [ ] Create repositories
- [ ] Create services with business logic
- [ ] Create controllers for /categories and /pets endpoints
- [ ] Add global exception handling
- [ ] Test endpoints with Postman/curl

### Phase 2: Frontend Pages & Components (Week 1-2)
- [ ] Create StorefrontPage with layout
- [ ] Implement CategorySidebar
- [ ] Implement PetGrid and PetCard
- [ ] Create PetDetailPage with PhotoGallery
- [ ] Implement API service layer
- [ ] Implement custom hooks

### Phase 3: Integration & Testing (Week 2)
- [ ] Test API endpoints end-to-end
- [ ] Test frontend-backend integration
- [ ] Performance testing and optimization
- [ ] User acceptance testing

### Phase 4: Deployment (Week 3)
- [ ] Dockerize backend and frontend
- [ ] Set up Docker Compose
- [ ] Test in containerized environment
- [ ] Deploy to staging environment
- [ ] Final QA and launch

---

## 11. Known Unknowns & Future Enhancements

- **Pagination**: Large pet lists may need server-side pagination
- **Search**: Full-text search on pet names/descriptions
- **Sorting**: Sort pets by name, age, or recently added
- **Image Optimization**: Lazy loading, WebP format, CDN delivery
- **Caching**: Redis cache for categories and frequently viewed pets
- **Analytics**: Track popular categories and viewing patterns
- **Mobile Responsiveness**: Optimize for mobile devices (v2)
- **Authentication**: User accounts for saved favorites (v2)
