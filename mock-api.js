import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Mock data
const categories = [
  { id: 1, name: 'Dogs' },
  { id: 2, name: 'Cats' },
  { id: 3, name: 'Birds' },
  { id: 4, name: 'Fish' }
];

const pets = [
  {
    id: 1,
    name: 'Max',
    breed: 'Golden Retriever',
    age: 3,
    categoryId: 1,
    description: 'Friendly and energetic dog who loves playing fetch!',
    category: { id: 1, name: 'Dogs' },
    healthStatuses: [{ id: 1, status: 'vaccinated', createdAt: new Date().toISOString() }],
    photos: [
      { id: 1, photoUrl: 'https://images.unsplash.com/photo-1633722715463-d30628cff4a5?w=400', displayOrder: 1 },
      { id: 2, photoUrl: 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=400', displayOrder: 2 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Luna',
    breed: 'Siamese Cat',
    age: 2,
    categoryId: 2,
    description: 'Beautiful and affectionate cat perfect for a loving home.',
    category: { id: 2, name: 'Cats' },
    healthStatuses: [{ id: 2, status: 'vaccinated', createdAt: new Date().toISOString() }],
    photos: [
      { id: 3, photoUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400', displayOrder: 1 },
      { id: 4, photoUrl: 'https://images.unsplash.com/photo-1591133573892-8a28eda01a3e?w=400', displayOrder: 2 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Tweety',
    breed: 'Budgie',
    age: 1,
    categoryId: 3,
    description: 'Colorful and cheerful budgie that loves to sing.',
    category: { id: 3, name: 'Birds' },
    healthStatuses: [{ id: 3, status: 'healthy', createdAt: new Date().toISOString() }],
    photos: [
      { id: 5, photoUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400', displayOrder: 1 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Bubbles',
    breed: 'Goldfish',
    age: 1,
    categoryId: 4,
    description: 'Peaceful goldfish that brings calm to any space.',
    category: { id: 4, name: 'Fish' },
    healthStatuses: [{ id: 4, status: 'healthy', createdAt: new Date().toISOString() }],
    photos: [
      { id: 6, photoUrl: 'https://images.unsplash.com/photo-1576149192919-7dd142d898b2?w=400', displayOrder: 1 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Bella',
    breed: 'Labrador',
    age: 4,
    categoryId: 1,
    description: 'Gentle giant perfect for families.',
    category: { id: 1, name: 'Dogs' },
    healthStatuses: [{ id: 5, status: 'vaccinated', createdAt: new Date().toISOString() }],
    photos: [
      { id: 7, photoUrl: 'https://images.unsplash.com/photo-1587300411515-fef2d60f5ed3?w=400', displayOrder: 1 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Mittens',
    breed: 'Tabby Cat',
    age: 3,
    categoryId: 2,
    description: 'Playful and curious cat who loves attention.',
    category: { id: 2, name: 'Cats' },
    healthStatuses: [{ id: 6, status: 'vaccinated', createdAt: new Date().toISOString() }],
    photos: [
      { id: 8, photoUrl: 'https://images.unsplash.com/photo-1606214174585-fe31582dc1d4?w=400', displayOrder: 1 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Routes
app.get('/david/api/v1/categories', (req, res) => {
  res.json({
    success: true,
    message: 'Categories fetched successfully',
    status: 200,
    data: categories
  });
});

app.get('/david/api/v1/pets', (req, res) => {
  const { categoryId } = req.query;
  let data = pets;
  if (categoryId) {
    data = pets.filter(p => p.categoryId === parseInt(categoryId));
  }
  res.json({
    success: true,
    message: 'Pets fetched successfully',
    status: 200,
    data
  });
});

app.get('/david/api/v1/pets/:id', (req, res) => {
  const pet = pets.find(p => p.id === parseInt(req.params.id));
  if (!pet) {
    return res.status(404).json({
      success: false,
      message: 'Pet not found',
      status: 404,
      data: null
    });
  }
  res.json({
    success: true,
    message: 'Pet fetched successfully',
    status: 200,
    data: pet
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log(`✅ Endpoints ready:`);
  console.log(`   GET /david/api/v1/categories`);
  console.log(`   GET /david/api/v1/pets`);
  console.log(`   GET /david/api/v1/pets/:id`);
});
