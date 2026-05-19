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

const makeAnimalPhoto = (kind, lock) => `https://loremflickr.com/640/480/${kind}?lock=${lock}`;

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
      { id: 1, photoUrl: makeAnimalPhoto('dog', 101), displayOrder: 1 },
      { id: 2, photoUrl: makeAnimalPhoto('dog', 102), displayOrder: 2 }
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
      { id: 3, photoUrl: makeAnimalPhoto('cat', 201), displayOrder: 1 },
      { id: 4, photoUrl: makeAnimalPhoto('cat', 202), displayOrder: 2 }
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
      { id: 5, photoUrl: makeAnimalPhoto('bird', 301), displayOrder: 1 }
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
      { id: 6, photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Goldfish3.jpg', displayOrder: 1 }
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
      { id: 7, photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Greatdane.jpg', displayOrder: 1 }
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
      { id: 8, photoUrl: makeAnimalPhoto('cat', 203), displayOrder: 1 }
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
