import React, { useState } from 'react';
import { PetPhoto } from '../types';

interface PhotoGalleryProps {
  photos: PetPhoto[];
  petName: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, petName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const maxSteps = photos.length || 1;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };

  const currentPhoto = photos[activeIndex]?.photoUrl || 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div className="w-full">
      <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <img
          src={currentPhoto}
          alt={`${petName} - Photo ${activeIndex + 1}`}
          className="max-h-full max-w-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/600x400?text=No+Image';
          }}
        />

        {maxSteps > 1 && (
          <>
            <button
              onClick={handleBack}
              className="absolute left-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
              aria-label="Previous photo"
            >
              ←
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
              aria-label="Next photo"
            >
              →
            </button>

            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
              {activeIndex + 1} / {maxSteps}
            </div>
          </>
        )}
      </div>

      {maxSteps > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden transition-all ${
                activeIndex === index
                  ? 'border-blue-500 ring-2 ring-blue-300'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={photo.photoUrl}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/80x80?text=No+Image';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
