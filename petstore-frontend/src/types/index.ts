export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface PetPhoto {
  id: number;
  photoUrl: string;
  displayOrder: number;
}

export interface HealthStatus {
  id: number;
  status: string;
  createdAt: string;
}

export interface Pet {
  id: number;
  name: string;
  description?: string;
  category: Category;
  healthStatuses: HealthStatus[];
  photos: PetPhoto[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  status: number;
  data: T;
}
