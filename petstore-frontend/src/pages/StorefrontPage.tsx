import React from 'react';
import { PetFilterProvider } from '../context/PetFilterContext';
import { CategorySidebar } from '../components/CategorySidebar';
import { PetGrid } from '../components/PetGrid';

const StorefrontPage: React.FC = () => {
  return (
    <PetFilterProvider>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Find Your Perfect Companion
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <CategorySidebar />
          <PetGrid />
        </div>
      </div>
    </PetFilterProvider>
  );
};

export default StorefrontPage;
