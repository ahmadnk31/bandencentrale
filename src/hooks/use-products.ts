import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  productApi, 
  Product, 
  ProductFilters, 
  CreateProductData, 
  UpdateProductData,
  ProductStats 
} from '@/lib/api/products';
import { handleApiError } from '@/lib/api-client';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  stats: () => [...productKeys.all, 'stats'] as const,
};

// Hooks
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productApi.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProduct(id),
    enabled: !!id,
  });
}

export function useProductStats() {
  return useQuery({
    queryKey: productKeys.stats(),
    queryFn: () => productApi.getProductStats(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateProductData) => productApi.createProduct(data),
    onSuccess: (response) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      
      toast({
        title: 'Success',
        description: response.message || 'Product created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: handleApiError(error),
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateProductData) => productApi.updateProduct(data),
    onSuccess: (response, variables) => {
      // Update the specific product in cache
      queryClient.setQueryData(
        productKeys.detail(variables.id),
        (old: any) => old ? { ...old, data: response.data } : old
      );
      
      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      
      toast({
        title: 'Success',
        description: response.message || 'Product updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: handleApiError(error),
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: (response, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      
      toast({
        title: 'Success',
        description: response.message || 'Product deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: handleApiError(error),
        variant: 'destructive',
      });
    },
  });
}

export function useBulkUpdateProducts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ ids, data }: { ids: string[]; data: Partial<CreateProductData> }) =>
      productApi.bulkUpdateProducts(ids, data),
    onSuccess: (response) => {
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      
      toast({
        title: 'Success',
        description: response.message || 'Products updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: handleApiError(error),
        variant: 'destructive',
      });
    },
  });
}

export function useDuplicateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => productApi.duplicateProduct(id),
    onSuccess: (response) => {
      // Invalidate lists to show new product
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      
      toast({
        title: 'Success',
        description: response.message || 'Product duplicated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: handleApiError(error),
        variant: 'destructive',
      });
    },
  });
}

export function useImportProducts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => productApi.importProducts(file),
    onSuccess: (response) => {
      // Invalidate all product queries
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      
      const { imported, errors } = response.data;
      
      toast({
        title: 'Import Complete',
        description: `${imported} products imported successfully${
          errors.length > 0 ? `. ${errors.length} errors occurred.` : ''
        }`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Import Failed',
        description: handleApiError(error),
        variant: 'destructive',
      });
    },
  });
}

export function useExportProducts() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (filters: ProductFilters = {}) => productApi.exportProducts(filters),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'Products exported successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Export Failed',
        description: handleApiError(error),
        variant: 'destructive',
      });
    },
  });
}
