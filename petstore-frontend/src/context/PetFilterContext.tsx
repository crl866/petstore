import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PetFilterContextType {
  selectedCategoryId: number | null;
  updateSelectedCategory: (categoryId: number | null) => void;
}

const PetFilterContext = createContext<PetFilterContextType | undefined>(
  undefined
);

export const PetFilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const updateSelectedCategory = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <PetFilterContext.Provider value={{ selectedCategoryId, updateSelectedCategory }}>
      {children}
    </PetFilterContext.Provider>
  );
};

export const usePetFilter = () => {
  const context = useContext(PetFilterContext);
  if (!context) {
    throw new Error('usePetFilter must be used within a PetFilterProvider');
  }
  return context;
};
