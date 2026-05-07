import React from 'react';
import { Pet } from '../types';
import { useNavigate } from 'react-router-dom';

interface PetCardProps {
  pet: Pet;
}

export const PetDetailSection: React.FC<{ pet: Pet }> = ({ pet }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{pet.name}</h1>
        <p className="text-lg text-gray-600 mb-4">
          <span className="font-semibold">Category:</span> {pet.category.name}
        </p>
      </div>

      {pet.description && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Description
          </h2>
          <p className="text-gray-700">{pet.description}</p>
        </div>
      )}

      {pet.healthStatuses && pet.healthStatuses.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Health Status
          </h2>
          <div className="flex flex-wrap gap-2">
            {pet.healthStatuses.map((status) => (
              <span
                key={status.id}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {status.status}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
