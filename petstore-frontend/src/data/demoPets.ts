import { Pet } from '../types';

const demoPets: Pet[] = [
  {
    id: 1001,
    name: 'Max',
    breed: 'Golden Retriever',
    age: 1,
    description: 'A friendly golden retriever who loves to play fetch',
    category: { id: 1, name: 'Dogs', description: 'Dog' },
    healthStatuses: [{ id: 1, status: 'HEALTHY', createdAt: new Date().toISOString() }],
    photos: [
      { id: 1, photoUrl: 'https://images.unsplash.com/photo-1633722715463-d30628cbe0d3?w=400', displayOrder: 0 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 1002,
    name: 'Whiskers',
    breed: 'Persian',
    age: 4,
    description: 'A fluffy Persian cat with a calm demeanor',
    category: { id: 2, name: 'Cats', description: 'Cat' },
    healthStatuses: [{ id: 2, status: 'VACCINATED', createdAt: new Date().toISOString() }],
    photos: [
      { id: 2, photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03bf1a4f8c?w=400', displayOrder: 0 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 1003,
    name: 'Goldie',
    breed: 'Goldfish',
    age: 1,
    description: 'Goldfish, 3 inches',
    category: { id: 3, name: 'Fish', description: 'Fish' },
    healthStatuses: [],
    photos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 1004,
    name: 'Kiwi',
    breed: 'Parrot',
    age: 2,
    description: 'Parrot with bright feathers',
    category: { id: 4, name: 'Birds', description: 'Bird' },
    healthStatuses: [],
    photos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default demoPets;
