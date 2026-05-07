import { useState, useEffect } from 'react';
import { Pet } from '../types';
import { petService } from '../services/petService';

export const usePetDetail = (petId?: number) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!petId) {
      setLoading(false);
      return;
    }

    const fetchPet = async () => {
      try {
        setLoading(true);
        const data = await petService.fetchPetDetail(petId);
        setPet(data);
        setError(null);
      } catch (err) {
        setError('Failed to load pet details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  return { pet, loading, error };
};
