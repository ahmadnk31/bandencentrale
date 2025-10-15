import { apiClient, ApiResponse } from '@/lib/api-client';

// Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  parentId?: string;
  image?: string;
  isActive?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  parentId?: string;
  image?: string;
  isActive?: boolean;
}

class CategoryApiServiceClass {
  private basePath = '/categories';

  async getAll(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(this.basePath);
    return response.data;
  }

  async getById(id: string): Promise<Category> {
    const response = await apiClient.get<Category>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: CreateCategoryData): Promise<Category> {
    const response = await apiClient.post<Category>(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: UpdateCategoryData): Promise<Category> {
    const response = await apiClient.put<Category>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const CategoryApiService = new CategoryApiServiceClass();
export default CategoryApiService;
