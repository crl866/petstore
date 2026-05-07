import axios from 'axios';
import { Category, Pet, ApiResponse } from '../types';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_ENDPOINT = `${API_BASE_URL}/david/api/v1`;

export const petService = {
  fetchAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await axios.get<ApiResponse<Category[]>>(
        `${API_ENDPOINT}/categories`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  fetchAllPets: async (categoryId?: number): Promise<Pet[]> => {
    try {
      const url = categoryId
        ? `${API_ENDPOINT}/pets?categoryId=${categoryId}`
        : `${API_ENDPOINT}/pets`;
      const response = await axios.get<ApiResponse<Pet[]>>(url);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching pets:', error);
      throw error;
    }
  },

  fetchPetDetail: async (petId: number): Promise<Pet> => {
    try {
      const response = await axios.get<ApiResponse<Pet>>(
        `${API_ENDPOINT}/pets/${petId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching pet detail:', error);
      throw error;
    }
  },
};
