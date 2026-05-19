import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
}

export const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pets/${pet.id}`);
  };

  const imageUrl =
    pet.photos && pet.photos.length > 0
      ? pet.photos[0].photoUrl
      : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:shadow-2xl hover:scale-105"
    >
      <div className="w-full h-48 overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={pet.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
          }}
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
          {pet.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3">{pet.category.name}</p>

        {pet.description && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {pet.description}
          </p>
        )}

        {pet.healthStatuses && pet.healthStatuses.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {pet.healthStatuses.slice(0, 2).map((status) => (
              <span
                key={status.id}
                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
              >
                {status.status}
              </span>
            ))}
            {pet.healthStatuses.length > 2 && (
              <span className="text-xs text-gray-600">
                +{pet.healthStatuses.length - 2} more
              </span>
            )}
          </div>
        )}

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

export default PetCard;
