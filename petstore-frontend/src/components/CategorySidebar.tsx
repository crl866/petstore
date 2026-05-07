import React from 'react';
import { useCategories } from '../hooks/useCategories';
import { usePetFilter } from '../context/PetFilterContext';

export const CategorySidebar: React.FC = () => {
  const { categories, loading, error } = useCategories();
  const { selectedCategoryId, updateSelectedCategory } = usePetFilter();

  if (loading) {
    return (
      <div className="w-full lg:w-64 p-4">
        <div className="text-center text-gray-500">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full lg:w-64 p-4">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <aside className="w-full lg:w-64 bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Categories</h2>
      <button
        onClick={() => updateSelectedCategory(null)}
        className={`w-full text-left px-4 py-2 mb-2 rounded transition-colors ${
          selectedCategoryId === null
            ? 'bg-blue-500 text-white font-semibold'
            : 'text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Pets
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => updateSelectedCategory(category.id)}
          className={`w-full text-left px-4 py-2 mb-2 rounded transition-colors ${
            selectedCategoryId === category.id
              ? 'bg-blue-500 text-white font-semibold'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </aside>
  );
};
