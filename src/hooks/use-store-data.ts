import { useQuery, keepPreviousData } from '@tanstack/react-query';

export interface ProductFilters {
  search?: string;
  brand?: string;
  category?: string;
  season?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  inStock?: boolean;
  page?: number;
  limit?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  shortDescription: string | null;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  images: any;
  size: string;
  width?: number;
  aspectRatio?: number;
  rimDiameter?: number;
  season: string;
  tireType?: string;
  speedRating: string | null;
  loadIndex: number | null;
  runFlat: boolean;
  fuelEfficiency?: string;
  wetGrip?: string;
  noiseLevel?: number;
  features: any;
  specifications: any;
  weight?: number;
  dimensions?: any;
  inStock: boolean;
  stockQuantity: number;
  lowStockThreshold?: number;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  brand: string | { id: string; name: string; slug: string; logo?: string; website?: string; countryOfOrigin?: string; } | null;
  brandLogo: string | null;
  category: string | { id: string; name: string; slug: string; description?: string; image?: string; } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function useProducts(filters: ProductFilters = {}) {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  return useQuery<ProductsResponse>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const response = await fetch(`/api/products?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return response.json();
    },
    enabled: !!id,
  });
}

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await fetch(`/api/products/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await response.json();
      return data.data as Product;
    },
    enabled: !!slug,
  });
};

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await fetch('/api/brands');
      if (!response.ok) {
        throw new Error('Failed to fetch brands');
      }
      return response.json();
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    },
  });
}

export function useCategoryProductCounts() {
  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.data || [];

  return useQuery({
    queryKey: ['category-product-counts', categories.map((c: any) => c.id)],
    queryFn: async () => {
      if (categories.length === 0) return {};
      
      const counts: { [key: string]: number } = {};
      
      // Fetch product count for each category
      await Promise.all(
        categories.map(async (category: any) => {
          try {
            const response = await fetch(`/api/products?category=${encodeURIComponent(category.name)}&limit=1`);
            if (response.ok) {
              const data = await response.json();
              counts[category.name] = data.pagination?.totalCount || 0;
            } else {
              counts[category.name] = 0;
            }
          } catch (error) {
            counts[category.name] = 0;
          }
        })
      );
      
      return counts;
    },
    enabled: categories.length > 0,
  });
}

export function useProductsByIds(ids: string[]) {
  return useQuery({
    queryKey: ['products-batch', ids],
    queryFn: async () => {
      if (ids.length === 0) {
        return { success: true, data: [] };
      }
      const response = await fetch('/api/products/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
    enabled: ids.length > 0,
  });
}

export interface QuoteData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  items: Array<{
    productId?: string;
    serviceId?: string;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
    metadata?: any;
  }>;
  notes?: string;
  requirements?: string[];
}

export async function submitQuote(quoteData: QuoteData) {
  const response = await fetch('/api/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit quote');
  }
  
  return response.json();
}
