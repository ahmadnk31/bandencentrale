"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus, Search, Folder, Package } from "lucide-react";
import { toast } from "sonner";
import CategoryApiService, { Category } from "@/lib/api/categories";
import ImageUpload, { UploadedImage } from "@/components/image-upload";


interface CategoryFormData {
  name: string;
  description: string;
  parentId: string; // Can be "none" for no parent or a category ID
  isActive: boolean;
  image: string; // Image URL
}

interface CategoryFormProps {
  formData: CategoryFormData;
  setFormData: (data: CategoryFormData) => void;
  uploadedImages: UploadedImage[];
  setUploadedImages: (images: UploadedImage[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  editingCategory: Category | null;
  getParentCategoryOptions: () => Array<{ value: string; label: string }>;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  formData,
  setFormData,
  uploadedImages,
  setUploadedImages,
  onSubmit,
  isLoading,
  editingCategory,
  getParentCategoryOptions,
  onCancel,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="name">Category Name *</Label>
      <Input
        id="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Enter category name"
        required
        className="h-11"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Enter category description"
        rows={3}
        className="resize-none"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="parentId">Parent Category</Label>
      <Select value={formData.parentId} onValueChange={(value) => setFormData({ ...formData, parentId: value })}>
        <SelectTrigger className="h-11">
          <SelectValue placeholder="Select parent category (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Parent (Top Level)</SelectItem>
          {getParentCategoryOptions().map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>Category Image</Label>
      <ImageUpload
        onImagesChange={(images) => {
          setUploadedImages(images);
          // Extract URLs from successfully uploaded images
          const imageUrls = images
            .filter((img): img is UploadedImage & { uploadResult: { success: true; url: string } } => 
              img.uploadResult?.success === true && typeof img.uploadResult.url === 'string'
            )
            .map(img => img.uploadResult.url);
          // Use the first uploaded image as the category image
          const imageUrl = imageUrls.length > 0 ? imageUrls[0] : formData.image;
          setFormData({ ...formData, image: imageUrl });
        }}
        existingImages={formData.image ? [formData.image] : []}
        maxFiles={1}
        uploadType="general"
        title="Upload Category Image"
        description="Add an image to represent this category"
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

    <div className="flex gap-3 pt-6">
      <Button
        type="submit"
        disabled={isLoading}
        className="flex-1"
      >
        {isLoading
          ? "Saving..."
          : editingCategory
          ? "Update Category"
          : "Create Category"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="flex-1"
      >
        Cancel
      </Button>
    </div>
  </form>
);

export default function CategoriesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    parentId: "none",
    isActive: true,
    image: "",
  });

  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryApiService.getAll(),
  });

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<CategoryFormData, 'id'>) => CategoryApiService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category created successfully");
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to create category");
      console.error(error);
    },
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryFormData> }) =>
      CategoryApiService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category updated successfully");
      setIsEditModalOpen(false);
      setEditingCategory(null);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to update category");
      console.error(error);
    },
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => CategoryApiService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete category");
      console.error(error);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      parentId: "none",
      isActive: true,
      image: "",
    });
    setUploadedImages([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      parentId: formData.parentId === "none" ? "" : formData.parentId
    };
    
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      parentId: category.parentId || "none",
      isActive: category.isActive,
      image: category.image || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get categories that can be parents (no circular references)
  const getParentCategoryOptions = () => {
    return categories
      .filter(cat => !editingCategory || cat.id !== editingCategory.id)
      .map(cat => ({
        value: cat.id,
        label: cat.name
      }));
  };

  const handleCancel = () => {
    if (editingCategory) {
      setIsEditModalOpen(false);
      setEditingCategory(null);
    } else {
      setIsAddModalOpen(false);
    }
    resetForm();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground mt-1">
            Organize your product categories and hierarchy
          </p>
        </div>
        <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <ModalTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </ModalTrigger>
          <ModalContent className="w-full h-full">
            <ModalHeader>
              <ModalTitle>Add New Category</ModalTitle>
            </ModalHeader>
            <div className="px-6 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
              <CategoryForm 
                formData={formData}
                setFormData={setFormData}
                uploadedImages={uploadedImages}
                setUploadedImages={setUploadedImages}
                onSubmit={handleSubmit}
                isLoading={createMutation.isPending}
                editingCategory={null}
                getParentCategoryOptions={getParentCategoryOptions}
                onCancel={handleCancel}
              />
            </div>
          </ModalContent>
        </Modal>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Total: {categories.length}</span>
          <span>Active: {categories.filter(c => c.isActive).length}</span>
          <span>Inactive: {categories.filter(c => !c.isActive).length}</span>
        </div>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded w-8"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No categories match your search criteria." : "Get started by creating your first category."}
            </p>
            {!searchTerm && (
              <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <ModalTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Category
                  </Button>
                </ModalTrigger>
              </Modal>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-3">
                      {category.parentId ? (
                        <Package className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Folder className="h-5 w-5 text-blue-500" />
                      )}
                      {category.name}
                    </CardTitle>
                    {category.parentId && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Subcategory
                      </p>
                    )}
                  </div>
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {category.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="flex-1"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent className="w-full h-full">
          <ModalHeader>
            <ModalTitle>Edit Category</ModalTitle>
          </ModalHeader>
          <div className="px-6 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
            <CategoryForm 
              formData={formData}
              setFormData={setFormData}
              uploadedImages={uploadedImages}
              setUploadedImages={setUploadedImages}
              onSubmit={handleSubmit}
              isLoading={updateMutation.isPending}
              editingCategory={editingCategory}
              getParentCategoryOptions={getParentCategoryOptions}
              onCancel={handleCancel}
            />
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}

