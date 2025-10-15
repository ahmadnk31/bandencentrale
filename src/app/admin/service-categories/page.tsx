'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Settings,
  Folder,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { toast } from 'sonner';

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface ServiceCategoryFormData {
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
}

// API functions for service categories
const serviceCategoryApi = {
  getAll: async (): Promise<ServiceCategory[]> => {
    const response = await fetch('/api/admin/service-categories?limit=100');
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch service categories');
    }
    return result.data;
  },
  create: async (data: Omit<ServiceCategoryFormData, 'id'>): Promise<ServiceCategory> => {
    const response = await fetch('/api/admin/service-categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to create service category');
    }
    return result.data;
  },
  update: async (id: string, data: Partial<ServiceCategoryFormData>): Promise<ServiceCategory> => {
    const response = await fetch(`/api/admin/service-categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to update service category');
    }
    return result.data;
  },
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/admin/service-categories/${id}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete service category');
    }
  },
};

export default function ServiceCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [viewingCategory, setViewingCategory] = useState<ServiceCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ServiceCategory | null>(null);
  const [formData, setFormData] = useState<ServiceCategoryFormData>({
    name: '',
    description: '',
    icon: '',
    isActive: true,
    sortOrder: 0,
  });

  const queryClient = useQueryClient();

  // Fetch service categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['service-categories'],
    queryFn: serviceCategoryApi.getAll,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: serviceCategoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-categories'] });
      toast.success('Service category created successfully');
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create service category');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceCategoryFormData> }) =>
      serviceCategoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-categories'] });
      toast.success('Service category updated successfully');
      setIsEditModalOpen(false);
      setEditingCategory(null);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update service category');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: serviceCategoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-categories'] });
      toast.success('Service category deleted successfully');
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete service category');
    },
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      isActive: true,
      sortOrder: 0,
    });
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleEdit = (category: ServiceCategory) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    });
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (!editingCategory) return;
    updateMutation.mutate({ id: editingCategory.id, data: formData });
  };

  const handleView = (category: ServiceCategory) => {
    setViewingCategory(category);
    setIsViewModalOpen(true);
  };

  const handleDelete = (category: ServiceCategory) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!categoryToDelete) return;
    deleteMutation.mutate(categoryToDelete.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Categories</h1>
          <p className="text-gray-600 mt-2">Manage service categories and organization</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Folder className="w-5 h-5 mr-2" />
              Categories ({filteredCategories.length})
            </CardTitle>
            
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['service-categories'] })}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading categories...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Sort Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-gray-500">{category.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {category.description || 'No description'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {category.icon && (
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-2">
                              <span className="text-sm">{category.icon}</span>
                            </div>
                          )}
                          <span className="text-sm text-gray-500">{category.icon || 'None'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{category.sortOrder}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleView(category)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(category)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                  <p className="text-gray-600">Create your first service category to get started.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Category Modal */}
      <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <ModalContent className='h-full w-full p-6 overflow-auto'>
          <ModalHeader>
            <ModalTitle>Add New Service Category</ModalTitle>
          </ModalHeader>
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Enter icon name or emoji"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active Category</Label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={createMutation.isPending || !formData.name.trim()}
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Category
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Edit Category Modal */}
      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit Service Category</ModalTitle>
          </ModalHeader>
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="editName">Category Name *</Label>
              <Input
                id="editName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="editIcon">Icon</Label>
              <Input
                id="editIcon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Enter icon name or emoji"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="editSortOrder">Sort Order</Label>
              <Input
                id="editSortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="editIsActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="editIsActive">Active Category</Label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdate}
                disabled={updateMutation.isPending || !formData.name.trim()}
              >
                {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Update Category
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* View Category Modal */}
      <Modal open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Category Details</ModalTitle>
          </ModalHeader>
          {viewingCategory && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{viewingCategory.name}</h3>
                <p className="text-sm text-gray-500">{viewingCategory.slug}</p>
              </div>
              {viewingCategory.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-700">{viewingCategory.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Status</h4>
                  <Badge className={viewingCategory.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {viewingCategory.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Sort Order</h4>
                  <p>{viewingCategory.sortOrder}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-1">Created</h4>
                <p className="text-sm text-gray-600">
                  {new Date(viewingCategory.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent className='h-full w-full p-6 overflow-auto'>
          <ModalHeader>
            <ModalTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Delete Category
            </ModalTitle>
          </ModalHeader>
          {categoryToDelete && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Are you sure you want to delete <strong>{categoryToDelete.name}</strong>? 
                  This action cannot be undone and may affect associated services.
                </AlertDescription>
              </Alert>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Delete Category
                </Button>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
