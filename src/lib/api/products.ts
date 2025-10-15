import { apiClient, ApiResponse } from '@/lib/api-client';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  trackQuantity: boolean;
  isActive: boolean;
  isFeatured: boolean;
  images?: string[];
  categoryId: string;
  brandId: string;
  
  // Tire-specific fields
  size?: string;
  width?: number;
  aspectRatio?: number;
  rimDiameter?: number;
  season?: string;
  tireType?: string;
  speedRating?: string;
  loadIndex?: number;
  runFlat?: boolean;
  fuelEfficiency?: string;
  wetGrip?: string;
  noiseLevel?: number;
  
  // Additional product attributes
  weight?: number;
  dimensions?: object;
  features?: string[];
  specifications?: object;
  
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  
  createdAt: string;
  updatedAt: string;
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  brand?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductData {
  name: string;
  slug?: string;
  sku: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  trackQuantity?: boolean;
  isActive: boolean;
  isFeatured?: boolean;
  images?: string[];
  categoryId: string;
  brandId: string;
  
  // Tire-specific fields
  size?: string;
  width?: number;
  aspectRatio?: number;
  rimDiameter?: number;
  season?: string;
  tireType?: string;
  speedRating?: string;
  loadIndex?: number;
  runFlat?: boolean;
  fuelEfficiency?: string;
  wetGrip?: string;
  noiseLevel?: number;
  
  // Additional product attributes
  weight?: number;
  dimensions?: object;
  features?: string[];
  specifications?: object;
  
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalValue: number;
  featuredProducts: number;
  averagePrice: number;
}

class ProductApiService {
  private basePath = '/admin/products';

  async getProducts(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    const params = Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== '')
      .reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>);

    return apiClient.get<Product[]>(this.basePath, params);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`${this.basePath}/${id}`);
  }

  async createProduct(data: CreateProductData): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>(this.basePath, data);
  }

  async updateProduct(data: UpdateProductData): Promise<ApiResponse<Product>> {
    const { id, ...updateData } = data;
    return apiClient.put<Product>(`${this.basePath}/${id}`, updateData);
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  async getProductStats(): Promise<ApiResponse<ProductStats>> {
    return apiClient.get<ProductStats>(`${this.basePath}/stats`);
  }

  async bulkUpdateProducts(
    ids: string[], 
    data: Partial<CreateProductData>
  ): Promise<ApiResponse<void>> {
    return apiClient.patch<void>(`${this.basePath}/bulk`, { ids, data });
  }

  async duplicateProduct(id: string): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>(`${this.basePath}/${id}/duplicate`);
  }

  async importProducts(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);

    // For file uploads, we need to handle differently
    const response = await fetch(`/api${this.basePath}/import`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || 'Import failed',
        status: response.status,
        errors: errorData.errors,
      };
    }

    return response.json();
  }

  async exportProducts(filters: ProductFilters = {}): Promise<Blob> {
    const params = new URLSearchParams(
      Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => [key, String(value)])
    );

    const response = await fetch(`/api${this.basePath}/export?${params}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }
}

export const productApi = new ProductApiService();
