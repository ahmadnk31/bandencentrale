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
import { Pencil, Trash2, Plus, Search, Building2 } from "lucide-react";
import { toast } from "sonner";
import { BrandApiService } from "@/lib/api/brands";
import ImageUpload, { UploadedImage } from "@/components/image-upload";

interface Brand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BrandFormData {
  name: string;
  description: string;
  logo: string;
  website: string;
  isActive: boolean;
}

// Form component moved outside to prevent re-renders and focus loss
interface BrandFormProps {
  formData: BrandFormData;
  setFormData: (data: BrandFormData) => void;
  uploadedImages: UploadedImage[];
  setUploadedImages: (images: UploadedImage[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  editingBrand: Brand | null;
  onCancel: () => void;
}

const BrandForm: React.FC<BrandFormProps> = ({
  formData,
  setFormData,
  uploadedImages,
  setUploadedImages,
  onSubmit,
  isLoading,
  editingBrand,
  onCancel
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="name">Brand Name *</Label>
      <Input
        id="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Enter brand name"
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
        placeholder="Enter brand description"
        rows={3}
        className="resize-none"
      />
    </div>

    <div className="space-y-2">
      <Label>Brand Logo</Label>
      <ImageUpload
        onImagesChange={(images) => {
          setUploadedImages(images);
          // Extract URLs from successfully uploaded images
          const imageUrls = images
            .filter((img): img is UploadedImage & { uploadResult: { success: true; url: string } } => 
              img.uploadResult?.success === true && typeof img.uploadResult.url === 'string'
            )
            .map(img => img.uploadResult.url);
          // Use the first uploaded image as the brand logo
          const logoUrl = imageUrls.length > 0 ? imageUrls[0] : formData.logo;
          setFormData({ ...formData, logo: logoUrl });
        }}
        existingImages={formData.logo ? [formData.logo] : []}
        maxFiles={1}
        uploadType="logo"
        title="Upload Brand Logo"
        description="Add your brand logo for recognition"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="website">Website</Label>
      <Input
        id="website"
        value={formData.website}
        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        placeholder="https://brand-website.com"
        className="h-11"
      />
    </div>

    <div className="flex items-center space-x-2">
      <Switch
        id="isActive"
        checked={formData.isActive}
        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
      />
      <Label htmlFor="isActive">Active Brand</Label>
    </div>

    <div className="flex gap-3 pt-6">
      <Button
        type="submit"
        disabled={isLoading}
        className="flex-1"
      >
        {isLoading
          ? "Saving..."
          : editingBrand
          ? "Update Brand"
          : "Create Brand"}
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

export default function BrandsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [formData, setFormData] = useState<BrandFormData>({
    name: "",
    description: "",
    logo: "",
    website: "",
    isActive: true,
  });

  const queryClient = useQueryClient();

  // Fetch brands
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => BrandApiService.getAll(),
  });

  // Create brand mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<BrandFormData, 'id'>) => BrandApiService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success("Brand created successfully");
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to create brand");
      console.error(error);
    },
  });

  // Update brand mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BrandFormData> }) =>
      BrandApiService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success("Brand updated successfully");
      setIsEditModalOpen(false);
      setEditingBrand(null);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to update brand");
      console.error(error);
    },
  });

  // Delete brand mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => BrandApiService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success("Brand deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete brand");
      console.error(error);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      logo: "",
      website: "",
      isActive: true,
    });
    setUploadedImages([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || "",
      logo: brand.logo || "",
      website: brand.website || "",
      isActive: brand.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCancel = () => {
    if (editingBrand) {
      setIsEditModalOpen(false);
      setEditingBrand(null);
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
          <h1 className="text-3xl font-bold">Brand Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage tire brands and their information
          </p>
        </div>
        <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <ModalTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Brand
            </Button>
          </ModalTrigger>
          <ModalContent className="w-full h-full">
            <ModalHeader>
              <ModalTitle>Add New Brand</ModalTitle>
            </ModalHeader>
            <div className="px-6 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
              <BrandForm 
                formData={formData}
                setFormData={setFormData}
                uploadedImages={uploadedImages}
                setUploadedImages={setUploadedImages}
                onSubmit={handleSubmit}
                isLoading={createMutation.isPending}
                editingBrand={null}
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
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Total: {brands.length}</span>
          <span>Active: {brands.filter(b => b.isActive).length}</span>
          <span>Inactive: {brands.filter(b => !b.isActive).length}</span>
        </div>
      </div>

      {/* Brands Grid */}
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
      ) : filteredBrands.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No brands found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No brands match your search criteria." : "Get started by creating your first brand."}
            </p>
            {!searchTerm && (
              <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <ModalTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Brand
                  </Button>
                </ModalTrigger>
              </Modal>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <Card key={brand.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-3">
                      {brand.logo && (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-8 h-8 object-contain rounded"
                        />
                      )}
                      {brand.name}
                    </CardTitle>
                    {brand.website && (
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-1"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                  <Badge variant={brand.isActive ? "default" : "secondary"}>
                    {brand.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {brand.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {brand.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(brand)}
                    className="flex-1"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(brand.id)}
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
            <ModalTitle>Edit Brand</ModalTitle>
          </ModalHeader>
          <div className="px-6 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
            <BrandForm 
              formData={formData}
              setFormData={setFormData}
              uploadedImages={uploadedImages}
              setUploadedImages={setUploadedImages}
              onSubmit={handleSubmit}
              isLoading={updateMutation.isPending}
              editingBrand={editingBrand}
              onCancel={handleCancel}
            />
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
