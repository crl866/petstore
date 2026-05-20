import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Normalize base URL: remove any trailing slashes to avoid double-slash in requests
const normalizedBase = API_BASE_URL.replace(/\/+$/, '');

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${normalizedBase}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const petApi = {
  getPets: (page = 0, size = 20, categoryId?: number, search?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (categoryId) params.append('categoryId', categoryId.toString());
    if (search) params.append('search', search);
    return apiClient.get(`/pets?${params.toString()}`);
  },

  getPetById: (id: number) => apiClient.get(`/pets/${id}`),

  getCategories: () => apiClient.get('/categories'),
};

export const applicationApi = {
  createApplication: (data: any) => apiClient.post('/applications', data),

  getApplicationById: (id: number) => apiClient.get(`/applications/${id}`),
};

export const adminApi = {
  getPets: (page = 0, size = 20) =>
    apiClient.get(`/admin/pets?page=${page}&size=${size}`),

  createPet: (data: any) => apiClient.post('/admin/pets', data),

  updatePet: (id: number, data: any) => apiClient.patch(`/admin/pets/${id}`, data),

  deletePet: (id: number) => apiClient.delete(`/admin/pets/${id}`),

  getApplications: (page = 0, size = 20, status?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (status) params.append('status', status);
    return apiClient.get(`/admin/applications?${params.toString()}`);
  },

  getApplicationById: (id: number) => apiClient.get(`/admin/applications/${id}`),

  updateApplicationStatus: (id: number, status: string, notes?: string) =>
    apiClient.patch(`/admin/applications/${id}/status`, { status, notes }),
};

export default apiClient;
