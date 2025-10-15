import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CategoryApiService, { Category, CreateCategoryData } from '@/lib/api/categories';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryApiService.getAll(),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCategoryData) => CategoryApiService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
