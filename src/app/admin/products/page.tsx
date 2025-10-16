'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ImageUpload, { UploadedImage } from '@/components/image-upload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import ProductCard from '@/components/product-card';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Save,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List
} from 'lucide-react';
import Image from 'next/image';
import { 
  useProducts, 
  useProductStats, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct,
  useExportProducts
} from '@/hooks/use-products';
import { Product, ProductFilters, CreateProductData } from '@/lib/api/products';
import { useCategories } from '@/lib/hooks/useCategories';
import { useBrands } from '@/lib/hooks/useBrands';
import { safeToNumber } from '@/lib/utils/price';

export default function ProductsPage() {
  // Filter states
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: 'all',
    brand: 'all',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 10
  });

  // TanStack Query hooks
  const { data: productsResponse, isLoading, refetch } = useProducts(filters);
  const { data: statsResponse, isLoading: isStatsLoading } = useProductStats();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const exportProductsMutation = useExportProducts();

  // Local state for UI
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
   const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    sku: '',
    description: '',
    shortDescription: '',
    price: 0,
    compareAtPrice: 0,
    cost: 0,
    stockQuantity: 0,
    lowStockThreshold: 10,
    trackQuantity: true,
    isActive: true,
    isFeatured: false,
    images: [],
    categoryId: '',
    brandId: '',
    
    // Tire-specific fields
    size: '',
    width: 0,
    aspectRatio: 0,
    rimDiameter: 0,
    season: '',
    tireType: '',
    speedRating: '',
    loadIndex: 0,
    runFlat: false,
    fuelEfficiency: '',
    wetGrip: '',
    noiseLevel: 0,
    
    // Additional attributes
    weight: 0,
    dimensions: {},
    features: [],
    specifications: {},
    
    // SEO fields
    metaTitle: '',
    metaDescription: ''
  });

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [editCurrentStep, setEditCurrentStep] = useState(1);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const totalSteps = 6;

  // Add React Query hooks for categories and brands
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories();
  const { data: brandsResponse, isLoading: brandsLoading } = useBrands();

  const categories = categoriesResponse || [];
  const brands = brandsResponse || [];

  // localStorage key for form persistence
  const FORM_STORAGE_KEY = 'product-form-draft';

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData.formData || formData);
        setCurrentStep(parsedData.currentStep || 1);
        setIsFormDirty(true);
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (isFormDirty) {
      const dataToSave = {
        formData,
        currentStep,
        timestamp: Date.now(),
      };
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [formData, currentStep, isFormDirty]);

  // Clear localStorage when form is submitted or reset
  const clearFormStorage = useCallback(() => {
    localStorage.removeItem(FORM_STORAGE_KEY);
    setIsFormDirty(false);
  }, [FORM_STORAGE_KEY]);

  // Step navigation functions
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  // Edit dialog step navigation functions
  const editNextStep = useCallback(() => {
    if (editCurrentStep < totalSteps) {
      setEditCurrentStep(prev => prev + 1);
    }
  }, [editCurrentStep, totalSteps]);

  const editPrevStep = useCallback(() => {
    if (editCurrentStep > 1) {
      setEditCurrentStep(prev => prev - 1);
    }
  }, [editCurrentStep]);

  const editGoToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setEditCurrentStep(step);
    }
  }, [totalSteps]);

  // Step validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Basic Information
        return !!(formData.name?.trim() && formData.sku?.trim() && formData.categoryId && formData.brandId);
      case 2: // Pricing & Inventory
        return !!(formData.price > 0 && formData.stockQuantity >= 0);
      case 3: // Tire Specifications
        return true; // Optional fields
      case 4: // Physical Properties
        return true; // Optional fields
      case 5: // Images
        return true; // Optional
      case 6: // SEO & Meta
        return true; // Optional
      default:
        return true;
    }
  };

  const canProceedToNextStep = validateStep(currentStep);

  // Get step title for navigation
  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return 'Basic Info';
      case 2: return 'Pricing';
      case 3: return 'Tire Specs';
      case 4: return 'Physical';
      case 5: return 'Images';
      case 6: return 'SEO';
      default: return `Step ${step}`;
    }
  };

  // Updated form change handler to track dirty state
  const handleFormDataChange = useCallback((updates: Partial<CreateProductData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setIsFormDirty(true);
  }, []);

  // Form state
 

  // Derived data
  const products = productsResponse?.data || [];
  const stats = statsResponse?.data || null;
  const loading = isLoading || isStatsLoading;
  const pagination = productsResponse?.pagination;

  // Handlers
  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleCreateProduct = async () => {
    try {
      await createProductMutation.mutateAsync(formData);
      setIsAddDialogOpen(false);
      resetForm();
      clearFormStorage();
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    try {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        ...formData
      });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProductMutation.mutateAsync(productToDelete.id);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      price: product.price,
      compareAtPrice: product.compareAtPrice || 0,
      cost: product.cost || 0,
      stockQuantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold || 10,
      trackQuantity: product.trackQuantity ?? true,
      isActive: product.isActive,
      isFeatured: product.isFeatured || false,
      images: product.images || [],
      categoryId: product.categoryId || '',
      brandId: product.brandId || '',
      
      // Tire-specific fields
      size: product.size || '',
      width: product.width || 0,
      aspectRatio: product.aspectRatio || 0,
      rimDiameter: product.rimDiameter || 0,
      season: product.season || '',
      tireType: product.tireType || '',
      speedRating: product.speedRating || '',
      loadIndex: product.loadIndex || 0,
      runFlat: product.runFlat || false,
      fuelEfficiency: product.fuelEfficiency || '',
      wetGrip: product.wetGrip || '',
      noiseLevel: product.noiseLevel || 0,
      
      // Additional attributes
      weight: product.weight || 0,
      dimensions: product.dimensions || {},
      features: product.features || [],
      specifications: product.specifications || {},
      
      // SEO fields
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || ''
    });
    setUploadedImages([]); // Clear any uploaded images when editing
    setEditCurrentStep(1); // Reset to first step
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      sku: '',
      description: '',
      shortDescription: '',
      price: 0,
      compareAtPrice: 0,
      cost: 0,
      stockQuantity: 0,
      lowStockThreshold: 10,
      trackQuantity: true,
      isActive: true,
      isFeatured: false,
      images: [],
      categoryId: '',
      brandId: '',
      
      // Tire-specific fields
      size: '',
      width: 0,
      aspectRatio: 0,
      rimDiameter: 0,
      season: '',
      tireType: '',
      speedRating: '',
      loadIndex: 0,
      runFlat: false,
      fuelEfficiency: '',
      wetGrip: '',
      noiseLevel: 0,
      
      // Additional attributes
      weight: 0,
      dimensions: {},
      features: [],
      specifications: {},
      
      // SEO fields
      metaTitle: '',
      metaDescription: ''
    });
    setUploadedImages([]);
    setCurrentStep(1);
    clearFormStorage();
  }, []);

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStockColor = (stock: number, threshold: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock <= threshold) return 'text-yellow-600';
    return 'text-green-600';
  };

  const StatCard = ({ title, value, change, icon: Icon, format }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {format ? format(value) : value?.toLocaleString() || 0}
            </p>
          </div>
          <div className="p-3 rounded-full bg-blue-100">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        {change && (
          <div className="flex items-center mt-4">
            <span className="text-sm font-medium text-green-600">{change}</span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">Manage your tire inventory and product catalog</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => exportProductsMutation.mutate(filters)}
            disabled={exportProductsMutation.isPending}
          >
            {exportProductsMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Export
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            change="+12"
            icon={Package}
          />
          <StatCard
            title="Active Products"
            value={stats.activeProducts}
            change="+8"
            icon={CheckCircle}
          />
          <StatCard
            title="Low Stock"
            value={stats.lowStockProducts}
            icon={AlertTriangle}
          />
          <StatCard
            title="Total Value"
            value={stats.totalValue}
            format={(val: number) => `€${val.toLocaleString()}`}
            change="+€15,420"
            icon={TrendingUp}
          />
        </div>
      )}

      {/* Products Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Products
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex border rounded-lg p-1 bg-gray-50">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="px-3"
                >
                  <Package className="w-4 h-4" />
                </Button>
              </div>

              {/* Refresh */}
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : (
            <>
              {/* Grid/List View */}
              {(viewMode === 'grid' || viewMode === 'list') && (
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                    : 'space-y-4'
                }`}>
                  {products.map((product) => (
                    <div key={product.id} className="relative group">
                      <ProductCard
                        id={parseInt(product.id)}
                        slug={product.slug}
                        name={product.name}
                        brand={product.brand?.name || 'Unknown'}
                        price={safeToNumber(product.price)}
                        originalPrice={safeToNumber(product.compareAtPrice)}
                        images={Array.isArray(product.images) ? 
                          product.images.map((img: any, index: number) => ({
                            src: typeof img === 'string' ? img : img?.url || img?.src || '',
                            alt: img?.alt || `${product.name} - Image ${index + 1}`
                          })).filter((img: any) => img.src && img.src.length > 0 && !img.src.includes('placeholder')) :
                          []
                        }
                        rating={4.5} // You might want to add rating to your Product model
                        reviews={Math.floor(Math.random() * 100) + 10} // Placeholder
                        size={product.size}
                        season={product.season as any}
                        speedRating={product.speedRating}
                        features={product.features || []}
                        badge={product.isFeatured ? 'Featured' : undefined}
                        badgeColor={product.isFeatured ? 'bg-orange-500' : undefined}
                        category={product.category?.name || 'Passenger'}
                        inStock={product.stockQuantity > 0}
                        className={viewMode === 'list' ? 'flex' : ''}
                        onAddToCart={() => {}} // Disabled for admin
                        onViewDetails={(id, slug) => handleViewProduct(product)}
                        onToggleFavorite={() => {}} // Disabled for admin
                      />
                      
                      {/* Admin Action Overlay */}
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProduct(product);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(product);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Stock Status Indicator */}
                      <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                        product.stockQuantity > 0 
                          ? product.stockQuantity <= (product.lowStockThreshold || 10)
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Stock: {product.stockQuantity}
                      </div>
                      
                      {/* Active Status Badge */}
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Table View */}
              {viewMode === 'table' && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.size}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">€{product.price}</span>
                              {product.compareAtPrice && product.compareAtPrice > product.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  €{product.compareAtPrice}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${
                              product.stockQuantity === 0 
                                ? 'text-red-600' 
                                : product.stockQuantity <= (product.lowStockThreshold || 10)
                                ? 'text-yellow-600' 
                                : 'text-green-600'
                            }`}>
                              {product.stockQuantity}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${
                              product.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            } border-0`}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {product.brand?.name || 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewProduct(product)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteProduct(product)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} products
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {products.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your filters or add some products to get started.</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Multi-Step Add Product Modal */}
      <Modal open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <ModalContent className="w-full h-full overflow-hidden p-0">
          <div className="flex flex-col h-full">
            <ModalHeader className="pb-4 px-6 pt-6">
              <ModalTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-lg sm:text-xl font-semibold">Add New Product</span>
                {isFormDirty && (
                  <Badge variant="outline" className="text-xs w-fit">
                    <Save className="w-3 h-3 mr-1" />
                    Auto-saved
                  </Badge>
                )}
              </ModalTitle>
            </ModalHeader>
          
          {/* Progress Indicator */}
          <div className="space-y-4 px-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="font-medium">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-3" />
            
            {/* Step Navigation */}
            <div className="flex items-center justify-center space-x-1 overflow-x-auto pb-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <Button
                  key={step}
                  variant={currentStep === step ? "default" : currentStep > step ? "secondary" : "outline"}
                  size="lg"
                  className="min-w-[100px] sm:min-w-[140px] px-4 sm:px-6 py-3 text-sm sm:text-base font-medium whitespace-nowrap"
                  onClick={() => goToStep(step)}
                >
                  <span className="sm:hidden">{step}</span>
                  <span className="hidden sm:inline">{step}. {getStepTitle(step)}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6" style={{ maxHeight: 'calc(100vh - 250px)' }}>
            <div className="space-y-8 pb-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <p className="text-sm text-muted-foreground">Enter the essential product details</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleFormDataChange({ name: e.target.value })}
                        placeholder="Michelin Pilot Sport 4"
                        required
                        className="text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU *</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => handleFormDataChange({ sku: e.target.value })}
                        placeholder="MICH-PS4-225-45-17"
                        required
                        className="text-base"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleFormDataChange({ description: e.target.value })}
                      placeholder="Detailed product description..."
                      rows={4}
                      className="text-base resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Textarea
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) => handleFormDataChange({ shortDescription: e.target.value })}
                      placeholder="Brief product summary for listings"
                      rows={2}
                      className="text-base resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select 
                        value={formData.categoryId} 
                        onValueChange={(value) => handleFormDataChange({ categoryId: value })}
                      >
                        <SelectTrigger className="text-base h-11">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesLoading ? (
                            <SelectItem value="loading-categories" disabled>Loading categories...</SelectItem>
                          ) : (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand *</Label>
                      <Select 
                        value={formData.brandId} 
                        onValueChange={(value) => handleFormDataChange({ brandId: value })}
                      >
                        <SelectTrigger className="text-base h-11">
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brandsLoading ? (
                            <SelectItem value="loading-brands" disabled>Loading brands...</SelectItem>
                          ) : (
                            brands.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id}>
                                {brand.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4 border-t">
                    <div className="flex items-center space-x-3">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleFormDataChange({ isActive: checked })}
                      />
                      <Label htmlFor="isActive" className="text-base font-medium">Active Product</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Switch
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => handleFormDataChange({ isFeatured: checked })}
                      />
                      <Label htmlFor="isFeatured" className="text-base font-medium">Featured Product</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Pricing & Inventory */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                  <p className="text-sm text-muted-foreground">Set pricing and manage inventory</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (€) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => handleFormDataChange({ price: parseFloat(e.target.value) || 0 })}
                        placeholder="150.00"
                        required
                        className="text-base h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compareAtPrice">Compare At Price (€)</Label>
                      <Input
                        id="compareAtPrice"
                        type="number"
                        step="0.01"
                        value={formData.compareAtPrice}
                        onChange={(e) => handleFormDataChange({ compareAtPrice: parseFloat(e.target.value) || 0 })}
                        placeholder="180.00"
                        className="text-base h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost">Cost (€)</Label>
                      <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        value={formData.cost}
                        onChange={(e) => handleFormDataChange({ cost: parseFloat(e.target.value) || 0 })}
                        placeholder="120.00"
                        className="text-base h-11"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                      <Input
                        id="stockQuantity"
                        type="number"
                        value={formData.stockQuantity}
                        onChange={(e) => handleFormDataChange({ stockQuantity: parseInt(e.target.value) || 0 })}
                        placeholder="100"
                        required
                        className="text-base h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        value={formData.lowStockThreshold}
                        onChange={(e) => handleFormDataChange({ lowStockThreshold: parseInt(e.target.value) || 10 })}
                        placeholder="10"
                        className="text-base h-11"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 pt-4 border-t">
                    <Switch
                      id="trackQuantity"
                      checked={formData.trackQuantity}
                      onCheckedChange={(checked) => handleFormDataChange({ trackQuantity: checked })}
                    />
                    <Label htmlFor="trackQuantity" className="text-base font-medium">Track Quantity</Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Tire Specifications */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tire Specifications</CardTitle>
                  <p className="text-sm text-muted-foreground">Enter tire-specific details and ratings</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="size">Size</Label>
                      <Input
                        id="size"
                        value={formData.size}
                        onChange={(e) => handleFormDataChange({ size: e.target.value })}
                        placeholder="225/45R17"
                        className="text-base h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (mm)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={formData.width}
                        onChange={(e) => handleFormDataChange({ width: parseInt(e.target.value) || 0 })}
                        placeholder="225"
                        className="text-base h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                      <Input
                        id="aspectRatio"
                        type="number"
                        value={formData.aspectRatio}
                        onChange={(e) => handleFormDataChange({ aspectRatio: parseInt(e.target.value) || 0 })}
                        placeholder="45"
                        className="text-base h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rimDiameter">Rim Diameter</Label>
                      <Input
                        id="rimDiameter"
                        type="number"
                        value={formData.rimDiameter}
                        onChange={(e) => handleFormDataChange({ rimDiameter: parseInt(e.target.value) || 0 })}
                        placeholder="17"
                        className="text-base h-11"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="season">Season</Label>
                      <Select value={formData.season} onValueChange={(value) => handleFormDataChange({ season: value })}>
                        <SelectTrigger className="text-base h-11">
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summer">Summer</SelectItem>
                          <SelectItem value="winter">Winter</SelectItem>
                          <SelectItem value="all-season">All Season</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tireType">Tire Type</Label>
                      <Select value={formData.tireType} onValueChange={(value) => handleFormDataChange({ tireType: value })}>
                        <SelectTrigger className="text-base h-11">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="performance">Performance</SelectItem>
                          <SelectItem value="touring">Touring</SelectItem>
                          <SelectItem value="comfort">Comfort</SelectItem>
                          <SelectItem value="sport">Sport</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="speedRating">Speed Rating</Label>
                      <Select value={formData.speedRating} onValueChange={(value) => handleFormDataChange({ speedRating: value })}>
                        <SelectTrigger className="text-base h-11">
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="H">H (210 km/h)</SelectItem>
                          <SelectItem value="V">V (240 km/h)</SelectItem>
                          <SelectItem value="W">W (270 km/h)</SelectItem>
                          <SelectItem value="Y">Y (300 km/h)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="loadIndex">Load Index</Label>
                      <Input
                        id="loadIndex"
                        type="number"
                        value={formData.loadIndex}
                        onChange={(e) => handleFormDataChange({ loadIndex: parseInt(e.target.value) || 0 })}
                        placeholder="91"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuelEfficiency">Fuel Efficiency</Label>
                      <Select value={formData.fuelEfficiency} onValueChange={(value) => handleFormDataChange({ fuelEfficiency: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A (Best)</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                          <SelectItem value="F">F</SelectItem>
                          <SelectItem value="G">G (Worst)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wetGrip">Wet Grip</Label>
                      <Select value={formData.wetGrip} onValueChange={(value) => handleFormDataChange({ wetGrip: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A (Best)</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                          <SelectItem value="F">F</SelectItem>
                          <SelectItem value="G">G (Worst)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="noiseLevel">Noise Level (dB)</Label>
                      <Input
                        id="noiseLevel"
                        type="number"
                        value={formData.noiseLevel}
                        onChange={(e) => handleFormDataChange({ noiseLevel: parseInt(e.target.value) || 0 })}
                        placeholder="72"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        id="runFlat"
                        checked={formData.runFlat}
                        onCheckedChange={(checked) => handleFormDataChange({ runFlat: checked })}
                      />
                      <Label htmlFor="runFlat">Run Flat Tire</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Physical Properties */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Physical Properties</CardTitle>
                  <p className="text-sm text-muted-foreground">Physical characteristics and measurements</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => handleFormDataChange({ weight: parseFloat(e.target.value) || 0 })}
                      placeholder="10.5"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Features</Label>
                    <Textarea
                      placeholder="Enter features separated by commas (e.g., All-weather grip, Low rolling resistance, Enhanced durability)"
                      rows={3}
                      value={Array.isArray(formData.features) ? formData.features.join(', ') : ''}
                      onChange={(e) => {
                        const featuresArray = e.target.value.split(',').map(f => f.trim()).filter(f => f.length > 0);
                        handleFormDataChange({ features: featuresArray });
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Product Images */}
            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <p className="text-sm text-muted-foreground">Upload high-quality product images</p>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    onImagesChange={(images) => {
                      setUploadedImages(images);
                      // Extract URLs from successfully uploaded images
                      const imageUrls = images
                        .filter((img): img is UploadedImage & { uploadResult: { success: true; url: string } } => 
                          img.uploadResult?.success === true && typeof img.uploadResult.url === 'string'
                        )
                        .map(img => img.uploadResult.url);
                      handleFormDataChange({ images: imageUrls });
                    }}
                    existingImages={formData.images}
                    maxFiles={8}
                    uploadType="product"
                    title="Upload Product Images"
                    description="Add high-quality images to showcase your tire products"
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 6: SEO & Meta Information */}
            {currentStep === 6 && (
              <Card>
                <CardHeader>
                  <CardTitle>SEO & Meta Information</CardTitle>
                  <p className="text-sm text-muted-foreground">Optimize for search engines</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => handleFormDataChange({ metaTitle: e.target.value })}
                      placeholder="SEO title for search engines"
                      maxLength={60}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.metaTitle?.length || 0}/60 characters
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => handleFormDataChange({ metaDescription: e.target.value })}
                      placeholder="SEO description for search engines"
                      rows={3}
                      maxLength={160}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.metaDescription?.length || 0}/160 characters
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">SEO Preview</h4>
                    <div className="space-y-1">
                      <div className="text-blue-600 text-lg font-medium">
                        {formData.metaTitle || formData.name || 'Product Title'}
                      </div>
                      <div className="text-green-600 text-sm">
                        bandencentrale.com/products/{formData.sku?.toLowerCase().replace(/\s+/g, '-') || 'product-sku'}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {formData.metaDescription || formData.shortDescription || 'Product description will appear here...'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t bg-white px-6 pb-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center min-w-[140px] h-12 text-base"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="min-w-[120px] h-12 text-base"
                >
                  Cancel
                </Button>
                
                {currentStep === totalSteps ? (
                  <Button 
                    onClick={handleCreateProduct}
                    disabled={createProductMutation.isPending || !canProceedToNextStep}
                    className="flex items-center min-w-[160px] h-12 text-base"
                  >
                    {createProductMutation.isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                    Create Product
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    disabled={!canProceedToNextStep}
                    className="flex items-center min-w-[120px] h-12 text-base"
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          </div>
        </ModalContent>
      </Modal>
            

      {/* Edit Product Modal */}
      <Modal open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <ModalContent className="w-full h-full overflow-hidden p-0">
          <div className="flex flex-col h-full">
            <ModalHeader className="pb-4 px-6 pt-6">
              <ModalTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-lg sm:text-xl font-semibold">Edit Product</span>
                {editingProduct && (
                  <Badge variant="secondary" className="text-xs w-fit">
                    {editingProduct.name}
                  </Badge>
                )}
              </ModalTitle>
            </ModalHeader>
          
          {/* Progress Indicator */}
          <div className="space-y-4 px-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="font-medium">Step {editCurrentStep} of {totalSteps}</span>
              <span className="font-medium">{Math.round((editCurrentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <Progress value={(editCurrentStep / totalSteps) * 100} className="h-3" />
            
            {/* Step Navigation */}
            <div className="flex items-center justify-center space-x-1 overflow-x-auto pb-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <Button
                  key={step}
                  variant={editCurrentStep === step ? "default" : editCurrentStep > step ? "secondary" : "outline"}
                  size="lg"
                  className="min-w-[100px] sm:min-w-[140px] px-4 sm:px-6 py-3 text-sm sm:text-base font-medium whitespace-nowrap"
                  onClick={() => editGoToStep(step)}
                >
                  <span className="sm:hidden">{step}</span>
                  <span className="hidden sm:inline">{step}. {getStepTitle(step)}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6" style={{ maxHeight: 'calc(100vh - 250px)' }}>
            <div className="space-y-8 pb-8">
            {/* Step 1: Basic Information */}
            {editCurrentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <p className="text-sm text-muted-foreground">Enter the essential product details</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="editName">Product Name *</Label>
                      <Input
                        id="editName"
                        value={formData.name}
                        onChange={(e) => handleFormDataChange({ name: e.target.value })}
                        placeholder="Michelin Pilot Sport 4"
                        required
                        className="text-base h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editSku">SKU *</Label>
                      <Input
                        id="editSku"
                        value={formData.sku}
                        onChange={(e) => handleFormDataChange({ sku: e.target.value })}
                        placeholder="MICH-PS4-225-45-17"
                        required
                        className="text-base h-11"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editDescription">Description</Label>
                    <Textarea
                      id="editDescription"
                      value={formData.description}
                      onChange={(e) => handleFormDataChange({ description: e.target.value })}
                      placeholder="Detailed product description..."
                      rows={4}
                      className="text-base resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editShortDescription">Short Description</Label>
                    <Textarea
                      id="editShortDescription"
                      value={formData.shortDescription}
                      onChange={(e) => handleFormDataChange({ shortDescription: e.target.value })}
                      placeholder="Brief product summary for listings"
                      rows={2}
                      className="text-base resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="editCategory">Category *</Label>
                      <Select 
                        value={formData.categoryId} 
                        onValueChange={(value) => handleFormDataChange({ categoryId: value })}
                      >
                        <SelectTrigger className="text-base h-11">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesLoading ? (
                            <SelectItem value="loading-categories-edit" disabled>Loading categories...</SelectItem>
                          ) : (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="editBrand">Brand *</Label>
                      <Select 
                        value={formData.brandId} 
                        onValueChange={(value) => handleFormDataChange({ brandId: value })}
                      >
                        <SelectTrigger className="text-base h-11">
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brandsLoading ? (
                            <SelectItem value="loading-brands-edit" disabled>Loading brands...</SelectItem>
                          ) : (
                            brands.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id}>
                                {brand.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4 border-t">
                    <div className="flex items-center space-x-3">
                      <Switch
                        id="editIsActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleFormDataChange({ isActive: checked })}
                      />
                      <Label htmlFor="editIsActive" className="text-base font-medium">Active Product</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Switch
                        id="editIsFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => handleFormDataChange({ isFeatured: checked })}
                      />
                      <Label htmlFor="editIsFeatured" className="text-base font-medium">Featured Product</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Pricing & Inventory */}
            {editCurrentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                  <p className="text-sm text-muted-foreground">Set pricing and manage inventory</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="editPrice">Price (€) *</Label>
                      <Input
                        id="editPrice"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => handleFormDataChange({ price: parseFloat(e.target.value) || 0 })}
                        placeholder="150.00"
                        required
                        className="text-base h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editCompareAtPrice">Compare At Price (€)</Label>
                      <Input
                        id="editCompareAtPrice"
                        type="number"
                        step="0.01"
                        value={formData.compareAtPrice}
                        onChange={(e) => handleFormDataChange({ compareAtPrice: parseFloat(e.target.value) || 0 })}
                        placeholder="180.00"
                        className="text-base h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editCost">Cost (€)</Label>
                      <Input
                        id="editCost"
                        type="number"
                        step="0.01"
                        value={formData.cost}
                        onChange={(e) => handleFormDataChange({ cost: parseFloat(e.target.value) || 0 })}
                        placeholder="120.00"
                        className="text-base h-11"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="editStockQuantity">Stock Quantity *</Label>
                      <Input
                        id="editStockQuantity"
                        type="number"
                        value={formData.stockQuantity}
                        onChange={(e) => handleFormDataChange({ stockQuantity: parseInt(e.target.value) || 0 })}
                        placeholder="100"
                        required
                        className="text-base h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editLowStockThreshold">Low Stock Threshold</Label>
                      <Input
                        id="editLowStockThreshold"
                        type="number"
                        value={formData.lowStockThreshold}
                        onChange={(e) => handleFormDataChange({ lowStockThreshold: parseInt(e.target.value) || 10 })}
                        placeholder="10"
                        className="text-base h-11"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 pt-4 border-t">
                    <Switch
                      id="editTrackQuantity"
                      checked={formData.trackQuantity}
                      onCheckedChange={(checked) => handleFormDataChange({ trackQuantity: checked })}
                    />
                    <Label htmlFor="editTrackQuantity" className="text-base font-medium">Track Quantity</Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Tire Specifications */}
            {editCurrentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tire Specifications</CardTitle>
                  <p className="text-sm text-muted-foreground">Enter tire-specific details and ratings</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="editSize">Size</Label>
                      <Input
                        id="editSize"
                        value={formData.size}
                        onChange={(e) => handleFormDataChange({ size: e.target.value })}
                        placeholder="225/45R17"
                        className="text-base h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editWidth">Width (mm)</Label>
                      <Input
                        id="editWidth"
                        type="number"
                        value={formData.width}
                        onChange={(e) => handleFormDataChange({ width: parseInt(e.target.value) || 0 })}
                        placeholder="225"
                        className="text-base h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editAspectRatio">Aspect Ratio</Label>
                      <Input
                        id="editAspectRatio"
                        type="number"
                        value={formData.aspectRatio}
                        onChange={(e) => handleFormDataChange({ aspectRatio: parseInt(e.target.value) || 0 })}
                        placeholder="45"
                        className="text-base h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editRimDiameter">Rim Diameter</Label>
                      <Input
                        id="editRimDiameter"
                        type="number"
                        value={formData.rimDiameter}
                        onChange={(e) => handleFormDataChange({ rimDiameter: parseInt(e.target.value) || 0 })}
                        placeholder="17"
                        className="text-base h-11"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="editSeason">Season</Label>
                      <Select value={formData.season} onValueChange={(value) => handleFormDataChange({ season: value })}>
                        <SelectTrigger className="text-base h-11">
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summer">Summer</SelectItem>
                          <SelectItem value="winter">Winter</SelectItem>
                          <SelectItem value="all-season">All Season</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editTireType">Tire Type</Label>
                      <Select value={formData.tireType} onValueChange={(value) => handleFormDataChange({ tireType: value })}>
                        <SelectTrigger className="text-base h-11">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="performance">Performance</SelectItem>
                          <SelectItem value="touring">Touring</SelectItem>
                          <SelectItem value="comfort">Comfort</SelectItem>
                          <SelectItem value="sport">Sport</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editSpeedRating">Speed Rating</Label>
                      <Select value={formData.speedRating} onValueChange={(value) => handleFormDataChange({ speedRating: value })}>
                        <SelectTrigger className="text-base h-11">
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="H">H (210 km/h)</SelectItem>
                          <SelectItem value="V">V (240 km/h)</SelectItem>
                          <SelectItem value="W">W (270 km/h)</SelectItem>
                          <SelectItem value="Y">Y (300 km/h)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="editLoadIndex">Load Index</Label>
                      <Input
                        id="editLoadIndex"
                        type="number"
                        value={formData.loadIndex}
                        onChange={(e) => handleFormDataChange({ loadIndex: parseInt(e.target.value) || 0 })}
                        placeholder="91"
                        className="text-base h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editFuelEfficiency">Fuel Efficiency</Label>
                      <Select value={formData.fuelEfficiency} onValueChange={(value) => handleFormDataChange({ fuelEfficiency: value })}>
                        <SelectTrigger className="text-base h-11">
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A (Best)</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                          <SelectItem value="F">F</SelectItem>
                          <SelectItem value="G">G (Worst)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editWetGrip">Wet Grip</Label>
                      <Select value={formData.wetGrip} onValueChange={(value) => handleFormDataChange({ wetGrip: value })}>
                        <SelectTrigger className="text-base h-11">
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A (Best)</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                          <SelectItem value="F">F</SelectItem>
                          <SelectItem value="G">G (Worst)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="editNoiseLevel">Noise Level (dB)</Label>
                      <Input
                        id="editNoiseLevel"
                        type="number"
                        value={formData.noiseLevel}
                        onChange={(e) => handleFormDataChange({ noiseLevel: parseInt(e.target.value) || 0 })}
                        placeholder="72"
                        className="text-base h-11"
                      />
                    </div>
                    <div className="flex items-center space-x-3 pt-6">
                      <Switch
                        id="editRunFlat"
                        checked={formData.runFlat}
                        onCheckedChange={(checked) => handleFormDataChange({ runFlat: checked })}
                      />
                      <Label htmlFor="editRunFlat" className="text-base font-medium">Run Flat Tire</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Physical Properties */}
            {editCurrentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Physical Properties</CardTitle>
                  <p className="text-sm text-muted-foreground">Physical characteristics and measurements</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="editWeight">Weight (kg)</Label>
                    <Input
                      id="editWeight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => handleFormDataChange({ weight: parseFloat(e.target.value) || 0 })}
                      placeholder="10.5"
                      className="text-base h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Features</Label>
                    <Textarea
                      placeholder="Enter features separated by commas (e.g., All-weather grip, Low rolling resistance, Enhanced durability)"
                      rows={3}
                      value={Array.isArray(formData.features) ? formData.features.join(', ') : ''}
                      onChange={(e) => {
                        const featuresArray = e.target.value.split(',').map(f => f.trim()).filter(f => f.length > 0);
                        handleFormDataChange({ features: featuresArray });
                      }}
                      className="text-base resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Product Images */}
            {editCurrentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <p className="text-sm text-muted-foreground">Manage product images</p>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    onImagesChange={(images) => {
                      setUploadedImages(images);
                      // Extract URLs from successfully uploaded images
                      const imageUrls = images
                        .filter((img): img is UploadedImage & { uploadResult: { success: true; url: string } } => 
                          img.uploadResult?.success === true && typeof img.uploadResult.url === 'string'
                        )
                        .map(img => img.uploadResult.url);
                      // Combine existing images with new uploads
                      const existingUrls = editingProduct?.images || [];
                      handleFormDataChange({ images: [...existingUrls, ...imageUrls] });
                    }}
                    existingImages={editingProduct?.images || []}
                    maxFiles={8}
                    uploadType="product"
                    title="Update Product Images"
                    description="Add new images or manage existing product images"
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 6: SEO & Meta Information */}
            {editCurrentStep === 6 && (
              <Card>
                <CardHeader>
                  <CardTitle>SEO & Meta Information</CardTitle>
                  <p className="text-sm text-muted-foreground">Optimize for search engines</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="editMetaTitle">Meta Title</Label>
                    <Input
                      id="editMetaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => handleFormDataChange({ metaTitle: e.target.value })}
                      placeholder="SEO title for search engines"
                      maxLength={60}
                      className="text-base h-11"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.metaTitle?.length || 0}/60 characters
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editMetaDescription">Meta Description</Label>
                    <Textarea
                      id="editMetaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => handleFormDataChange({ metaDescription: e.target.value })}
                      placeholder="SEO description for search engines"
                      rows={3}
                      maxLength={160}
                      className="text-base resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.metaDescription?.length || 0}/160 characters
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">SEO Preview</h4>
                    <div className="space-y-1">
                      <div className="text-blue-600 text-lg font-medium">
                        {formData.metaTitle || formData.name || 'Product Title'}
                      </div>
                      <div className="text-green-600 text-sm">
                        bandencentrale.com/products/{formData.sku?.toLowerCase().replace(/\s+/g, '-') || 'product-sku'}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {formData.metaDescription || formData.shortDescription || 'Product description will appear here...'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional steps 3-6 would be duplicated here with edit prefixes */}
            {editCurrentStep > 6 && (
              <Card>
                <CardHeader>
                  <CardTitle>{getStepTitle(editCurrentStep)}</CardTitle>
                  <p className="text-sm text-muted-foreground">This step will be implemented with the same structure as the add form</p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Step {editCurrentStep} content will be added here</p>
                    <p className="text-xs mt-2">For now, you can navigate between steps to see the structure</p>
                  </div>
                </CardContent>
              </Card>
            )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t bg-white px-6 pb-6">
              <Button
                variant="outline"
                onClick={editPrevStep}
                disabled={editCurrentStep === 1}
                className="flex items-center min-w-[140px] h-12 text-base"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="min-w-[120px] h-12 text-base"
                >
                  Cancel
                </Button>
                
                {editCurrentStep === totalSteps ? (
                  <Button 
                    onClick={handleUpdateProduct}
                    disabled={updateProductMutation.isPending || !validateStep(editCurrentStep)}
                    className="flex items-center min-w-[160px] h-12 text-base"
                  >
                    {updateProductMutation.isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                    Update Product
                  </Button>
                ) : (
                  <Button
                    onClick={editNextStep}
                    disabled={!validateStep(editCurrentStep)}
                    className="flex items-center min-w-[120px] h-12 text-base"
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          </div>
        </ModalContent>
      </Modal>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <Image
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                  <p className="text-gray-600">{selectedProduct.sku}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(selectedProduct.isActive)}>
                      {selectedProduct.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {selectedProduct.isFeatured && (
                      <Badge variant="outline">Featured</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedProduct.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700">{selectedProduct.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Pricing</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">€{selectedProduct.price}</span>
                    </div>
                    {selectedProduct.compareAtPrice && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Compare At:</span>
                        <span className="font-medium">€{selectedProduct.compareAtPrice}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Inventory</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-medium ${getStockColor(selectedProduct.stockQuantity, selectedProduct.lowStockThreshold)}`}>
                        {selectedProduct.stockQuantity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Low Stock Threshold:</span>
                      <span className="font-medium">{selectedProduct.lowStockThreshold}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Delete Product
            </DialogTitle>
          </DialogHeader>
          {productToDelete && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Are you sure you want to delete <strong>{productToDelete.name}</strong>? 
                  This action cannot be undone.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDeleteProduct}
                  disabled={deleteProductMutation.isPending}
                >
                  {deleteProductMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Delete Product
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
