import { useState, useEffect } from 'react';
import { Pet } from '../types';
import { petService } from '../services/petService';
import demoPets from '../data/demoPets';

export const usePets = (categoryId?: number | null) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const data = await petService.fetchAllPets(categoryId || undefined);
        // If API returns no pets, fallback to local demo data so UI shows examples
        if (!data || data.length === 0) {
          console.warn('API returned no pets — using demo fallback');
          setPets(demoPets.filter((p) => (categoryId ? p.category.id === categoryId : true)));
        } else {
          setPets(data);
        }
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
