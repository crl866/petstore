import { apiClient } from './apiClient';
import { Category, Pet, ApiResponse } from '../types';

export const petService = {
  fetchAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  fetchAllPets: async (categoryId?: number): Promise<Pet[]> => {
    try {
      const url = categoryId
        ? `/pets?categoryId=${categoryId}`
        : '/pets';
      const response = await apiClient.get<ApiResponse<Pet[]>>(url);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching pets:', error);
      throw error;
    }
  },

  fetchPetDetail: async (petId: number): Promise<Pet> => {
    try {
      const response = await apiClient.get<ApiResponse<Pet>>(`/pets/${petId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching pet detail:', error);
      throw error;
    }
  },
};
