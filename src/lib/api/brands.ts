import { apiClient, ApiResponse } from '@/lib/api-client';

// Types
export interface Brand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandData {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive?: boolean;
}

export interface UpdateBrandData {
  name?: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive?: boolean;
}

class BrandApiServiceClass {
  private basePath = '/brands';

  async getAll(): Promise<Brand[]> {
    const response = await apiClient.get<Brand[]>(this.basePath);
    return response.data;
  }

  async getById(id: string): Promise<Brand> {
    const response = await apiClient.get<Brand>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: CreateBrandData): Promise<Brand> {
    const response = await apiClient.post<Brand>(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: UpdateBrandData): Promise<Brand> {
    const response = await apiClient.put<Brand>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const BrandApiService = new BrandApiServiceClass();
export default BrandApiService;
