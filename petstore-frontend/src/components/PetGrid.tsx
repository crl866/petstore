import React from 'react';
import { usePets } from '../hooks/usePets';
import { usePetFilter } from '../context/PetFilterContext';
import { PetCard } from './PetCard';

export const PetGrid: React.FC = () => {
  const { selectedCategoryId } = usePetFilter();
  const { pets, loading, error } = usePets(selectedCategoryId);

  if (loading) {
    return (
      <div className="flex-1 p-4">
        <div className="text-center text-gray-500">Loading pets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="flex-1 p-4">
        <div className="text-center text-gray-500">
          No pets available in this category
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
};
