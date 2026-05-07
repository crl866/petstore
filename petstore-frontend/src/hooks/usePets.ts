import { useState, useEffect } from 'react';
import { Pet } from '../types';
import { petService } from '../services/petService';

export const usePets = (categoryId?: number | null) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const data = await petService.fetchAllPets(categoryId || undefined);
        setPets(data);
        setError(null);
      } catch (err) {
        setError('Failed to load pets');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [categoryId]);

  return { pets, loading, error };
};
