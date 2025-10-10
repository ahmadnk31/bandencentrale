"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  Package,
  TrendingUp,
  TrendingDown,
  Image as ImageIcon,
  Upload,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Tag,
  Layers,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X
} from "lucide-react";
import ProductForm from "@/components/product-form";
import { UploadedImage } from "@/components/image-upload";
import { 
  Product, 
  ProductFilter, 
  ProductStats, 
  ProductFormData, 
  productAPI 
} from "@/lib/product-data";
import Image from "next/image";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeView, setActiveView] = useState<'grid' | 'table'>('table');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<ProductFilter>({
    search: '',
    category: 'all',
    brand: 'all',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Load products
  useEffect(() => {
    loadProducts();
  }, [filters]);

  // Keyboard navigation for images
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isViewDialogOpen || isImageFullscreen) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            previousImage();
            break;
          case 'ArrowRight':
            event.preventDefault();
            nextImage();
            break;
          case 'Escape':
            if (isImageFullscreen) {
              setIsImageFullscreen(false);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isViewDialogOpen, isImageFullscreen, currentImageIndex, selectedProduct]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await productAPI.getProducts(filters);
      setProducts(result.products);
      setStats(result.stats);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productData: ProductFormData, images: UploadedImage[]) => {
    try {
      if (selectedProduct) {
        await productAPI.updateProduct(selectedProduct.id, productData);
      } else {
        await productAPI.createProduct(productData);
      }
      
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      await loadProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      await productAPI.deleteProduct(productToDelete.id);
      await loadProducts();
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteProduct = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0); // Reset to first image
    setIsViewDialogOpen(true);
  };

  const nextImage = () => {
    if (selectedProduct && currentImageIndex < selectedProduct.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const previousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const toggleFullscreen = () => {
    setIsImageFullscreen(!isImageFullscreen);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'discontinued': return 'bg-red-100 text-red-800';
      case 'coming-soon': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (product: Product) => {
    const available = product.inventory.availableQuantity;
    const reorder = product.inventory.reorderLevel;
    
    if (available === 0) return { status: 'out-of-stock', color: 'text-red-600' };
    if (available <= reorder) return { status: 'low-stock', color: 'text-yellow-600' };
    return { status: 'in-stock', color: 'text-green-600' };
  };

  const StatCard = ({ title, value, change, changeType, description, icon: Icon }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${
            changeType === 'increase' ? 'bg-tire-orange/10' : 'bg-green-100'
          }`}>
            <Icon className={`w-6 h-6 ${
              changeType === 'increase' ? 'text-tire-orange' : 'text-green-600'
            }`} />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <span className={`text-sm font-medium ${
            changeType === 'increase' ? 'text-tire-orange' : 'text-green-600'
          }`}>
            {change}
          </span>
          <span className="text-sm text-gray-500 ml-2">{description}</span>
        </div>
      </CardContent>
    </Card>
  );

  const ProductCard = ({ product }: { product: Product }) => {
    const stockStatus = getStockStatus(product);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="group"
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="relative aspect-square">
            <Image
              src={product.thumbnailImage}
              alt={product.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                <Button size="sm" variant="ghost" className="text-white hover:text-white hover:bg-black/20" onClick={() => handleViewProduct(product)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:text-white hover:bg-black/20" onClick={() => handleEditProduct(product)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => handleDeleteProduct(product)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Status badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {product.featured && <Badge className="bg-tire-orange text-white"><Star className="w-3 h-3" /></Badge>}
              {product.newArrival && <Badge variant="secondary">New</Badge>}
              {product.onSale && <Badge className="bg-red-500 text-white">Sale</Badge>}
            </div>
            
            {/* Image count indicator */}
            {product.images.length > 1 && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                  <ImageIcon className="w-3 h-3 mr-1" />
                  {product.images.length}
                </Badge>
              </div>
            )}
            
            {/* Stock status */}
            <div className={`absolute ${product.images.length > 1 ? 'bottom-2 right-2' : 'top-2 right-2'}`}>
              <Badge className={getStatusColor(product.status)}>
                {product.status.replace('-', ' ')}
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.brand} • {product.category}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-gray-900">€{product.pricing.basePrice}</span>
                  {product.pricing.salePrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">€{product.pricing.salePrice}</span>
                  )}
                </div>
                <span className={`text-sm font-medium ${stockStatus.color}`}>
                  {product.inventory.availableQuantity} in stock
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>SKU: {product.inventory.sku}</span>
                <span>{product.salesData.totalSold} sold</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage your tire inventory and product catalog with advanced image uploading and AWS S3 integration.</p>
        </div>
        <Button 
          className="bg-tire-gradient"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Products"
            value={stats.totalProducts.toLocaleString()}
            change="+12"
            changeType="increase"
            description="this month"
            icon={Package}
          />
          <StatCard
            title="Total Value"
            value={`€${stats.totalValue.toLocaleString()}`}
            change="+8.2%"
            changeType="increase"
            description="inventory value"
            icon={BarChart3}
          />
          <StatCard
            title="Low Stock"
            value={stats.lowStockProducts}
            change="-5"
            changeType="decrease"
            description="need restocking"
            icon={AlertTriangle}
          />
          <StatCard
            title="Featured"
            value={stats.featuredProducts}
            change="+3"
            changeType="increase"
            description="featured products"
            icon={Star}
          />
        </div>
      )}

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <CardTitle className="flex items-center">
              <Layers className="w-5 h-5 mr-2" />
              Product Catalog
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              {/* Category Filter */}
              <Select 
                value={filters.category} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                  <SelectItem value="all-season">All-Season</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>

              {/* Brand Filter */}
              <Select 
                value={filters.brand} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, brand: value }))}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  <SelectItem value="michelin">Michelin</SelectItem>
                  <SelectItem value="continental">Continental</SelectItem>
                  <SelectItem value="bridgestone">Bridgestone</SelectItem>
                  <SelectItem value="pirelli">Pirelli</SelectItem>
                  <SelectItem value="goodyear">Goodyear</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  variant={activeView === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('table')}
                  className="rounded-r-none"
                >
                  Table
                </Button>
                <Button
                  variant={activeView === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('grid')}
                  className="rounded-l-none"
                >
                  Grid
                </Button>
              </div>

              {/* Refresh */}
              <Button variant="outline" size="sm" onClick={loadProducts} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <AnimatePresence mode="wait">
            {activeView === 'table' ? (
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-x-auto"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const stockStatus = getStockStatus(product);
                      return (
                        <TableRow key={product.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                <Image
                                  src={product.thumbnailImage}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500">SKU: {product.inventory.sku}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.brand}</Badge>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            <div>
                              <span className="font-medium">€{product.pricing.basePrice}</span>
                              {product.pricing.salePrice && (
                                <span className="text-sm text-gray-500 line-through ml-2">€{product.pricing.salePrice}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${stockStatus.color}`}>
                              {product.inventory.availableQuantity}
                            </span>
                          </TableCell>
                          <TableCell>{product.salesData.totalSold}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge className={`${getStatusColor(product.status)} border-0`}>
                                {product.status.replace('-', ' ')}
                              </Badge>
                              {product.featured && <Star className="w-4 h-4 text-tire-orange" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-medium">{product.salesData.averageRating.toFixed(1)}</span>
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-500">({product.salesData.reviewCount})</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewProduct(product)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
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
                      );
                    })}
                  </TableBody>
                </Table>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters or add some products to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] overflow-hidden p-0 sm:w-[90vw] sm:max-w-[90vw] sm:h-[90vh] sm:max-h-[90vh]">
          <DialogHeader className="p-4 sm:p-6 pb-0 border-b">
            <DialogTitle className="text-xl sm:text-2xl">Add New Product</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <ProductForm
              onSave={handleSaveProduct}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] overflow-hidden p-0 sm:w-[90vw] sm:max-w-[90vw] sm:h-[90vh] sm:max-h-[90vh]">
          <DialogHeader className="p-4 sm:p-6 pb-0 border-b">
            <DialogTitle className="text-xl sm:text-2xl">Edit Product</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {selectedProduct && (
              <ProductForm
                product={selectedProduct}
                onSave={handleSaveProduct}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh] overflow-hidden p-0 sm:w-[85vw] sm:max-w-[85vw] sm:h-[85vh] sm:max-h-[85vh]">
          <DialogHeader className="p-4 sm:p-6 pb-0 border-b">
            <DialogTitle className="text-xl sm:text-2xl">Product Details</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {selectedProduct && (
              <div className="space-y-6 sm:space-y-8">
                {/* Product Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-4 sm:space-y-6">
                    {/* Main Image Display */}
                    <div className="relative group">
                      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={selectedProduct.images[currentImageIndex] || selectedProduct.thumbnailImage}
                          alt={selectedProduct.name}
                          fill
                          className="object-cover transition-all duration-300"
                        />
                        
                        {/* Navigation Arrows */}
                        {selectedProduct.images.length > 1 && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                              onClick={previousImage}
                              disabled={currentImageIndex === 0}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                              onClick={nextImage}
                              disabled={currentImageIndex === selectedProduct.images.length - 1}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        
                        {/* Fullscreen Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                          onClick={toggleFullscreen}
                        >
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                        
                        {/* Image Counter */}
                        {selectedProduct.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {currentImageIndex + 1} / {selectedProduct.images.length}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Image Thumbnails */}
                    {selectedProduct.images.length > 1 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {selectedProduct.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => selectImage(index)}
                            className={`aspect-square relative overflow-hidden rounded-lg bg-gray-100 border-2 transition-all duration-200 ${
                              currentImageIndex === index 
                                ? 'border-tire-orange shadow-md' 
                                : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <Image
                              src={image}
                              alt={`Product image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            {currentImageIndex === index && (
                              <div className="absolute inset-0 bg-tire-orange/20"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h2>
                      <p className="text-lg text-gray-600 mt-2">{selectedProduct.shortDescription}</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline" className="text-sm px-3 py-1">{selectedProduct.brand}</Badge>
                      <Badge variant="outline" className="text-sm px-3 py-1">{selectedProduct.category}</Badge>
                      <Badge className={`${getStatusColor(selectedProduct.status)} text-sm px-3 py-1`}>
                        {selectedProduct.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Price:</span>
                          <span className="font-bold text-lg">€{selectedProduct.pricing.basePrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Stock:</span>
                          <span className={`font-bold text-lg ${getStockStatus(selectedProduct).color}`}>
                            {selectedProduct.inventory.availableQuantity} units
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Sales:</span>
                          <span className="font-bold text-lg">{selectedProduct.salesData.totalSold} sold</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Rating:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg">{selectedProduct.salesData.averageRating.toFixed(1)}</span>
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-500">({selectedProduct.salesData.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                      <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                    </div>
                  </div>
                </div>
                
                {/* Detailed Information */}
                <Tabs defaultValue="specs" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="specs" className="text-base">Specifications</TabsTrigger>
                    <TabsTrigger value="inventory" className="text-base">Inventory</TabsTrigger>
                    <TabsTrigger value="sales" className="text-base">Sales Data</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="specs" className="space-y-6 mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      <div className="bg-white p-4 rounded-lg border">
                        <Label className="text-sm text-gray-600 font-medium">Size</Label>
                        <p className="font-bold text-lg mt-1">{selectedProduct.specs.width}/{selectedProduct.specs.aspectRatio}R{selectedProduct.specs.rimDiameter}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <Label className="text-sm text-gray-600 font-medium">Load Index</Label>
                        <p className="font-bold text-lg mt-1">{selectedProduct.specs.loadIndex}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <Label className="text-sm text-gray-600 font-medium">Speed Rating</Label>
                        <p className="font-bold text-lg mt-1">{selectedProduct.specs.speedRating}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <Label className="text-sm text-gray-600 font-medium">Tread Depth</Label>
                        <p className="font-bold text-lg mt-1">{selectedProduct.specs.treadDepth}mm</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <Label className="text-sm text-gray-600 font-medium">Weight</Label>
                        <p className="font-bold text-lg mt-1">{selectedProduct.specs.weight}kg</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <Label className="text-sm text-gray-600 font-medium">Pattern</Label>
                        <p className="font-bold text-lg mt-1">{selectedProduct.specs.treadPattern}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <Label className="text-sm text-gray-600 font-medium">Construction</Label>
                        <p className="font-bold text-lg mt-1">{selectedProduct.specs.sidewallConstruction}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <Label className="text-sm text-gray-600 font-medium">Max Pressure</Label>
                        <p className="font-bold text-lg mt-1">{selectedProduct.specs.maxPressure} PSI</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="inventory" className="space-y-6 mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="bg-white p-4 rounded-lg border">
                        <Label className="text-sm text-gray-600 font-medium">SKU</Label>
                        <p className="font-bold text-lg mt-1">{selectedProduct.inventory.sku}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <Label className="text-sm text-gray-600 font-medium">Location</Label>
                        <p className="font-bold text-lg mt-1">{selectedProduct.inventory.location || 'Not specified'}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <Label className="text-sm text-gray-600 font-medium">Supplier</Label>
                        <p className="font-bold text-lg mt-1">{selectedProduct.inventory.supplier || 'Not specified'}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <Label className="text-sm text-gray-600 font-medium">Reorder Level</Label>
                        <p className="font-bold text-lg mt-1">{selectedProduct.inventory.reorderLevel}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <Label className="text-sm text-gray-600 font-medium">Max Stock</Label>
                        <p className="font-bold text-lg mt-1">{selectedProduct.inventory.maxStockLevel}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <Label className="text-sm text-gray-600 font-medium">Last Restocked</Label>
                        <p className="font-bold text-lg mt-1">{new Date(selectedProduct.inventory.lastRestocked).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sales" className="space-y-6 mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                        <Label className="text-sm text-blue-600 font-medium">Total Revenue</Label>
                        <p className="text-2xl font-bold text-blue-900 mt-2">€{selectedProduct.salesData.revenue.toLocaleString()}</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                        <Label className="text-sm text-green-600 font-medium">Units Sold</Label>
                        <p className="text-2xl font-bold text-green-900 mt-2">{selectedProduct.salesData.totalSold}</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                        <Label className="text-sm text-purple-600 font-medium">Page Views</Label>
                        <p className="text-2xl font-bold text-purple-900 mt-2">{selectedProduct.salesData.viewCount}</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                        <Label className="text-sm text-orange-600 font-medium">Wishlisted</Label>
                        <p className="text-2xl font-bold text-orange-900 mt-2">{selectedProduct.salesData.wishlistCount}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Image Modal */}
      <Dialog open={isImageFullscreen} onOpenChange={setIsImageFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            {selectedProduct && (
              <>
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                  onClick={toggleFullscreen}
                >
                  <X className="w-6 h-6" />
                </Button>
                
                {/* Image */}
                <div className="relative max-w-full max-h-full">
                  <Image
                    src={selectedProduct.images[currentImageIndex] || selectedProduct.thumbnailImage}
                    alt={selectedProduct.name}
                    width={1200}
                    height={1200}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                
                {/* Navigation Controls */}
                {selectedProduct.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                      onClick={previousImage}
                      disabled={currentImageIndex === 0}
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                      onClick={nextImage}
                      disabled={currentImageIndex === selectedProduct.images.length - 1}
                    >
                      <ChevronRight className="w-8 h-8" />
                    </Button>
                  </>
                )}
                
                {/* Image Info */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-center">
                    <p className="text-sm font-medium">{selectedProduct.name}</p>
                    {selectedProduct.images.length > 1 && (
                      <p className="text-xs opacity-75">
                        Image {currentImageIndex + 1} of {selectedProduct.images.length}
                      </p>
                    )}
                  </div>
                </div>

                {/* Thumbnail Navigation */}
                {selectedProduct.images.length > 1 && (
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-2 bg-black/50 p-2 rounded-lg">
                      {selectedProduct.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => selectImage(index)}
                          className={`w-12 h-12 relative overflow-hidden rounded border-2 transition-all duration-200 ${
                            currentImageIndex === index 
                              ? 'border-tire-orange' 
                              : 'border-white/30 hover:border-white/60'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          {productToDelete && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-gray-900 mb-2">
                  Are you sure you want to delete this product?
                </p>
                <div className="bg-white p-3 rounded border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      <Image
                        src={productToDelete.thumbnailImage}
                        alt={productToDelete.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{productToDelete.name}</p>
                      <p className="text-sm text-gray-600">{productToDelete.brand} • SKU: {productToDelete.inventory.sku}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-red-700">
                  <p>⚠️ This action cannot be undone. The product will be permanently removed from your inventory.</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <Button
                  variant="outline"
                  onClick={cancelDeleteProduct}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteProduct}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Product
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
