# Pet Adoption Platform - Frontend

Modern React + Tailwind CSS frontend for the Pet Adoption Platform. Provides an intuitive interface for browsing pets, managing a cart, and submitting adoption applications.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + Material-UI
- **Language**: TypeScript
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Package Manager**: npm

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Local Development

1. **Navigate to frontend directory**
   ```bash
   cd petstore-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```
   Update `VITE_API_BASE_URL` if backend is running on different port:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```
   Output will be in `dist/` directory.

### Docker Setup

Build and run with Docker:
```bash
docker build -t petstore-frontend .
docker run -p 80:80 petstore-frontend
```

Or use docker-compose from root directory:
```bash
docker-compose up frontend
```

## Project Structure

```
petstore-frontend/
├── src/
│   ├── pages/               # Page components (routes)
│   │   ├── StorefrontPage.tsx      # Browse pets
│   │   ├── PetDetailPage.tsx       # Pet details
│   │   ├── CartPage.tsx            # Shopping cart
│   │   ├── AdoptionFormPage.tsx    # Multi-step form
│   │   └── AdminDashboardPage.tsx  # Admin panel
│   ├── components/          # Reusable components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Footer.tsx       # Footer
│   │   ├── PetCard.tsx      # Pet card listing
│   │   └── PhotoGallery.tsx # Image gallery
│   ├── context/             # React Context
│   │   └── CartContext.tsx  # Cart state management
│   ├── services/            # API calls
│   │   └── apiClient.ts     # Axios wrapper
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Helper functions
│   ├── styles/              # Global CSS
│   │   └── index.css        # Tailwind imports
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
└── package.json
```

## Features

### Pages

1. **Storefront Page** (`/`)
   - Browse all available pets
   - Filter by category
   - Real-time search
   - Pagination support

2. **Pet Detail Page** (`/pet/:id`)
   - Full pet information
   - Photo gallery with navigation
   - Add to cart button
   - Health status display

3. **Cart Page** (`/cart`)
   - View selected pets
   - Remove items
   - Persistent storage (localStorage)
   - Proceed to adoption form

4. **Adoption Form Page** (`/adoption-form`)
   - Multi-step form (4 steps)
   - Personal information
   - Home environment questions
   - Pet care commitment questions
   - Review and submit

5. **Admin Dashboard** (`/admin`)
   - Inventory management (Phase 2)
   - Application tracking (Phase 3)

### Components

- **Header**: Navigation with cart badge
- **Footer**: Company info and links
- **PetCard**: Responsive pet listing card
- **PhotoGallery**: Image carousel with thumbnails

### State Management

**Cart Context** (`CartContext.tsx`):
- Global cart state
- Persist cart to localStorage
- useCart hook for accessing cart

## API Configuration

API base URL is configured via environment variable:
```env
VITE_API_BASE_URL=http://localhost:8080
```

API client includes:
- Request interceptor for auth tokens
- Response error handling
- Axios instance with default config

## Styling

### Tailwind CSS
- Configured in `tailwind.config.js`
- Custom colors for primary/secondary theming
- Responsive design patterns

### Material-UI
- Components: `@mui/material`
- Icons: `@mui/icons-material`
- Theme integration with Tailwind

### Custom Styles
Global styles in `src/styles/index.css`:
- Loading skeletons
- Health status badges
- Pet card styling

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Environment Variables

Create `.env` file:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080

# App Configuration
VITE_APP_NAME=Petstore
```

## Performance

- **Code Splitting**: Vite automatically splits code by route
- **Image Lazy Loading**: Pet images load on demand
- **Component Memoization**: React.memo on frequently rendered components
- **Debounced Search**: 300ms debounce on search input

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Troubleshooting

### Blank Page at Startup
- Check `index.html` is in root directory
- Verify `vite.config.ts` is correct
- Clear browser cache: `Ctrl+Shift+Delete`

### API Connection Issues
- Verify backend is running on configured URL
- Check browser console for CORS errors
- Ensure `.env` has correct `VITE_API_BASE_URL`

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use
Vite will automatically use next available port, or specify:
```bash
npm run dev -- --port 3000
```

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Install dependencies: `npm install`
3. Run linter: `npm run lint`
4. Format code: `npm run format`
5. Build & test: `npm run build`
6. Commit and push

## License

MIT License - See LICENSE file for details
