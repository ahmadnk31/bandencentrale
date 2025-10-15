import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BrandApiService, { Brand, CreateBrandData } from '@/lib/api/brands';

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => BrandApiService.getAll(),
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateBrandData) => BrandApiService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};
