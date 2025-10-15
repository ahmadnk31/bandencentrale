import { apiClient, ApiResponse } from '@/lib/api-client';

export interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  categoryId?: string;
  basePrice: string;
  hourlyRate?: string;
  estimatedDuration: number;
  requiresAppointment: boolean;
  availableOnline: boolean;
  features: string[];
  requirements?: string;
  included?: string;
  warranty?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceData {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  categoryId?: string;
  basePrice: number;
  hourlyRate?: number;
  estimatedDuration: number;
  requiresAppointment?: boolean;
  availableOnline?: boolean;
  features?: string[];
  requirements?: string;
  included?: string;
  warranty?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  id: string;
}

export interface ServiceFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ServiceStats {
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
  averagePrice: number;
  averageDuration: number;
  totalBookings: number;
  totalRevenue: number;
  topService: string;
}

class ServicesApiService {
  private readonly basePath = '/admin/services';

  async getServices(params?: ServiceFilters): Promise<ApiResponse<Service[]>> {
    return apiClient.get<Service[]>(this.basePath, params);
  }

  async getService(id: string): Promise<ApiResponse<Service>> {
    return apiClient.get<Service>(`${this.basePath}/${id}`);
  }

  async createService(data: CreateServiceData): Promise<ApiResponse<Service>> {
    return apiClient.post<Service>(this.basePath, data);
  }

  async updateService(data: UpdateServiceData): Promise<ApiResponse<Service>> {
    const { id, ...updateData } = data;
    return apiClient.put<Service>(this.basePath, { id, ...updateData });
  }

  async deleteService(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.basePath}?id=${id}`);
  }

  async getServiceStats(): Promise<ApiResponse<ServiceStats>> {
    return apiClient.get<ServiceStats>(`${this.basePath}/stats`);
  }

  async toggleServiceStatus(id: string, isActive: boolean): Promise<ApiResponse<Service>> {
    return apiClient.put<Service>(this.basePath, { id, isActive });
  }
}

export const servicesApi = new ServicesApiService();
