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
      { id: 1, photoUrl: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&auto=format&fit=crop&q=80', displayOrder: 0 },
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
      { id: 2, photoUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&auto=format&fit=crop&q=80', displayOrder: 0 },
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
    photos: [
      { id: 3, photoUrl: 'https://images.unsplash.com/photo-1508182310786-7b6b6f6f6f6f?w=800&auto=format&fit=crop&q=80', displayOrder: 0 },
    ],
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
    photos: [
      { id: 4, photoUrl: 'https://images.unsplash.com/photo-1501706362039-c6e8091aa82f?w=800&auto=format&fit=crop&q=80', displayOrder: 0 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default demoPets;
