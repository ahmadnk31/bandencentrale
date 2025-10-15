"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Package, 
  Image as ImageIcon, 
  DollarSign, 
  BarChart3, 
  Settings,
  Tag,
  FileText,
  Globe,
  Plus,
  X
} from 'lucide-react';
import ImageUpload, { UploadedImage } from '@/components/image-upload';
import { Product, ProductFormData } from '@/lib/product-data';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().min(5, 'Short description is required'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
  model: z.string().min(1, 'Model is required'),
  specs: z.object({
    width: z.string().min(1, 'Width is required'),
    aspectRatio: z.string().min(1, 'Aspect ratio is required'),
    rimDiameter: z.string().min(1, 'Rim diameter is required'),
    loadIndex: z.string().min(1, 'Load index is required'),
    speedRating: z.string().min(1, 'Speed rating is required'),
    treadDepth: z.string().min(1, 'Tread depth is required'),
    weight: z.string().min(1, 'Weight is required'),
    treadPattern: z.string().min(1, 'Tread pattern is required'),
    sidewallConstruction: z.string().min(1, 'Sidewall construction is required'),
    maxPressure: z.string().min(1, 'Max pressure is required'),
  }),
  pricing: z.object({
    basePrice: z.number().min(0, 'Base price must be positive'),
    salePrice: z.number().optional(),
    costPrice: z.number().min(0, 'Cost price must be positive'),
    currency: z.string().default('EUR'),
  }),
  inventory: z.object({
    sku: z.string().min(1, 'SKU is required'),
    stockQuantity: z.number().min(0, 'Stock quantity must be non-negative'),
    reorderLevel: z.number().min(0, 'Reorder level must be non-negative'),
    maxStockLevel: z.number().min(0, 'Max stock level must be non-negative'),
    location: z.string().default(''),
    supplier: z.string().default(''),
  }),
});

type FormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSave: (data: ProductFormData, images: UploadedImage[]) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      brand: product.brand,
      category: product.category,
      model: product.model,
      specs: product.specs,
      pricing: {
        basePrice: product.pricing.basePrice,
        salePrice: product.pricing.salePrice,
        costPrice: product.pricing.costPrice,
        currency: product.pricing.currency,
      },
      inventory: {
        sku: product.inventory.sku,
        stockQuantity: product.inventory.stockQuantity,
        reorderLevel: product.inventory.reorderLevel,
        maxStockLevel: product.inventory.maxStockLevel,
        location: product.inventory.location || '',
        supplier: product.inventory.supplier || '',
      }
    } : undefined
  });

  const watchedBasePrice = watch('pricing.basePrice');
  const watchedCostPrice = watch('pricing.costPrice');
  const margin = watchedBasePrice && watchedCostPrice 
    ? ((watchedBasePrice - watchedCostPrice) / watchedBasePrice * 100).toFixed(1)
    : '0';

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: FormData) => {
    try {
      const productData: ProductFormData = {
        ...data,
        subcategory: '',
        features: {
          fuelEfficiency: 'C',
          wetGrip: 'B',
          roadNoise: '70',
          season: data.category.toLowerCase() as any,
          vehicleType: ['Car'],
          runFlat: false,
          reinforced: false,
          studded: false,
          eco: false
        },
        images: uploadedImages.filter(img => img.uploadResult?.success).map(img => img.uploadResult!.url!),
        thumbnailImage: uploadedImages.find(img => img.uploadResult?.success)?.uploadResult?.url || '',
        videos: [],
        inventory: {
          ...data.inventory,
          barcode: '',
          reservedQuantity: 0,
          availableQuantity: data.inventory.stockQuantity,
          supplierSku: '',
          lastRestocked: new Date().toISOString().split('T')[0],
          location: data.inventory.location || '',
          supplier: data.inventory.supplier || '',
        },
        pricing: {
          ...data.pricing,
          margin: parseFloat(margin),
          priceHistory: [],
          bulkPricing: []
        },
        seo: {
          metaTitle: data.name,
          metaDescription: data.shortDescription,
          keywords: [data.brand.toLowerCase(), data.category.toLowerCase()],
          slug: data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        },
        tags,
        relatedProducts: [],
        status: 'active',
        featured: false,
        bestseller: false,
        newArrival: true,
        onSale: !!data.pricing.salePrice,
        publishedAt: new Date().toISOString(),
        warranty: '2 years manufacturer warranty',
        manufacturer: data.brand,
        countryOfOrigin: 'Unknown',
        certifications: []
      };

      await onSave(productData, uploadedImages);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 h-full">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {product ? 'Edit Product' : 'Add New Product'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4">
                <TabsTrigger value="basic" className="flex items-center text-xs sm:text-sm">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Basic</span>
                  <span className="sm:hidden">Info</span>
                </TabsTrigger>
                <TabsTrigger value="specs" className="flex items-center text-xs sm:text-sm">
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Specs</span>
                  <span className="sm:hidden">Spec</span>
                </TabsTrigger>
                <TabsTrigger value="images" className="flex items-center text-xs sm:text-sm">
                  <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Images</span>
                  <span className="sm:hidden">Img</span>
                </TabsTrigger>
                <TabsTrigger value="pricing" className="flex items-center text-xs sm:text-sm">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Pricing</span>
                  <span className="sm:hidden">Price</span>
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center text-xs sm:text-sm">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Inventory</span>
                  <span className="sm:hidden">Stock</span>
                </TabsTrigger>
                <TabsTrigger value="seo" className="flex items-center text-xs sm:text-sm">
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span>SEO</span>
                </TabsTrigger>
              </TabsList>

              {/* Basic Information */}
              <TabsContent value="basic" className="flex-1 overflow-y-auto space-y-6">
                <div className="space-y-6">
                  {/* Product Identity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Product Name *</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Enter product name"
                        className="h-10"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model" className="text-sm font-medium">Model *</Label>
                      <Input
                        id="model"
                        {...register('model')}
                        placeholder="Enter model name"
                        className="h-10"
                      />
                      {errors.model && (
                        <p className="text-sm text-red-600">{errors.model.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand" className="text-sm font-medium">Brand *</Label>
                      <Select onValueChange={(value) => setValue('brand', value)}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="michelin">Michelin</SelectItem>
                          <SelectItem value="continental">Continental</SelectItem>
                          <SelectItem value="bridgestone">Bridgestone</SelectItem>
                          <SelectItem value="pirelli">Pirelli</SelectItem>
                          <SelectItem value="goodyear">Goodyear</SelectItem>
                          <SelectItem value="dunlop">Dunlop</SelectItem>
                          <SelectItem value="yokohama">Yokohama</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.brand && (
                        <p className="text-sm text-red-600">{errors.brand.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                      <Select onValueChange={(value) => setValue('category', value)}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summer">Summer</SelectItem>
                          <SelectItem value="winter">Winter</SelectItem>
                          <SelectItem value="all-season">All-Season</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                          <SelectItem value="eco">Eco</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-red-600">{errors.category.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Product Descriptions */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="shortDescription" className="text-sm font-medium">Short Description *</Label>
                      <Input
                        id="shortDescription"
                        {...register('shortDescription')}
                        placeholder="Brief product description for listings"
                        className="h-10"
                      />
                      {errors.shortDescription && (
                        <p className="text-sm text-red-600">{errors.shortDescription.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">Full Description *</Label>
                      <Textarea
                        id="description"
                        {...register('description')}
                        placeholder="Detailed product description"
                        rows={4}
                        className="resize-none"
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Tags Management */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Product Tags</Label>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-red-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add new tag"
                          className="flex-1 h-10"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" onClick={addTag} variant="outline" size="sm" className="h-10 px-4">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Specifications */}
              <TabsContent value="specs" className="flex-1 overflow-y-auto space-y-6">
                <div className="space-y-6">
                  {/* Tire Dimensions */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Tire Dimensions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="width" className="text-sm font-medium">Width (mm) *</Label>
                        <Input
                          id="width"
                          {...register('specs.width')}
                          placeholder="e.g., 225"
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="aspectRatio" className="text-sm font-medium">Aspect Ratio *</Label>
                        <Input
                          id="aspectRatio"
                          {...register('specs.aspectRatio')}
                          placeholder="e.g., 45"
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rimDiameter" className="text-sm font-medium">Rim Diameter (inches) *</Label>
                        <Input
                          id="rimDiameter"
                          {...register('specs.rimDiameter')}
                          placeholder="e.g., 17"
                          className="h-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Load & Speed */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Load & Speed Ratings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="loadIndex" className="text-sm font-medium">Load Index *</Label>
                        <Input
                          id="loadIndex"
                          {...register('specs.loadIndex')}
                          placeholder="e.g., 94"
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="speedRating" className="text-sm font-medium">Speed Rating *</Label>
                        <Input
                          id="speedRating"
                          {...register('specs.speedRating')}
                          placeholder="e.g., Y"
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxPressure" className="text-sm font-medium">Max Pressure (PSI) *</Label>
                        <Input
                          id="maxPressure"
                          {...register('specs.maxPressure')}
                          placeholder="e.g., 51"
                          className="h-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Physical Properties */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Physical Properties</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="treadDepth" className="text-sm font-medium">Tread Depth (mm) *</Label>
                        <Input
                          id="treadDepth"
                          {...register('specs.treadDepth')}
                          placeholder="e.g., 8.5"
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weight" className="text-sm font-medium">Weight (kg) *</Label>
                        <Input
                          id="weight"
                          {...register('specs.weight')}
                          placeholder="e.g., 12.5"
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sidewallConstruction" className="text-sm font-medium">Sidewall Construction *</Label>
                        <Select onValueChange={(value) => setValue('specs.sidewallConstruction', value)}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select construction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="radial">Radial</SelectItem>
                            <SelectItem value="bias">Bias</SelectItem>
                            <SelectItem value="bias-belted">Bias Belted</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Tread Pattern */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Tread Design</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="treadPattern" className="text-sm font-medium">Tread Pattern *</Label>
                        <Select onValueChange={(value) => setValue('specs.treadPattern', value)}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select pattern" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="symmetric">Symmetric</SelectItem>
                            <SelectItem value="asymmetric">Asymmetric</SelectItem>
                            <SelectItem value="directional">Directional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Images */}
              <TabsContent value="images" className="flex-1 overflow-y-auto space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Product Images</h3>
                    <p className="text-sm text-gray-600">Upload high-quality images of your tire product. The first image will be used as the thumbnail.</p>
                  </div>
                  <ImageUpload
                    onImagesChange={setUploadedImages}
                    existingImages={product?.images || []}
                    maxFiles={8}
                    uploadType="product"
                  />
                </div>
              </TabsContent>

              {/* Pricing */}
              <TabsContent value="pricing" className="flex-1 overflow-y-auto space-y-6">
                <div className="space-y-6">
                  {/* Price Information */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Price Settings</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="basePrice" className="text-sm font-medium">Base Price (€) *</Label>
                        <Input
                          id="basePrice"
                          type="number"
                          step="0.01"
                          {...register('pricing.basePrice', { valueAsNumber: true })}
                          placeholder="0.00"
                          className="h-10"
                        />
                        {errors.pricing?.basePrice && (
                          <p className="text-sm text-red-600">{errors.pricing.basePrice.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salePrice" className="text-sm font-medium">Sale Price (€)</Label>
                        <Input
                          id="salePrice"
                          type="number"
                          step="0.01"
                          {...register('pricing.salePrice', { valueAsNumber: true })}
                          placeholder="0.00"
                          className="h-10"
                        />
                        <p className="text-xs text-gray-500">Leave empty if not on sale</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="costPrice" className="text-sm font-medium">Cost Price (€) *</Label>
                        <Input
                          id="costPrice"
                          type="number"
                          step="0.01"
                          {...register('pricing.costPrice', { valueAsNumber: true })}
                          placeholder="0.00"
                          className="h-10"
                        />
                        {errors.pricing?.costPrice && (
                          <p className="text-sm text-red-600">{errors.pricing.costPrice.message}</p>
                        )}
                        <p className="text-xs text-gray-500">Your purchase/wholesale cost</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Profit Analysis</Label>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Profit Margin:</span>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-base px-3 py-1 bg-white">
                                  {margin}%
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Profit per Unit:</span>
                              <p className="font-medium mt-1">
                                €{watchedBasePrice && watchedCostPrice 
                                  ? (watchedBasePrice - watchedCostPrice).toFixed(2) 
                                  : '0.00'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Inventory */}
              <TabsContent value="inventory" className="flex-1 overflow-y-auto space-y-6">
                <div className="space-y-6">
                  {/* Stock Management */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Stock Management</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="sku" className="text-sm font-medium">SKU (Stock Keeping Unit) *</Label>
                        <Input
                          id="sku"
                          {...register('inventory.sku')}
                          placeholder="e.g., MIC-PS4S-225-45-17"
                          className="h-10"
                        />
                        {errors.inventory?.sku && (
                          <p className="text-sm text-red-600">{errors.inventory.sku.message}</p>
                        )}
                        <p className="text-xs text-gray-500">Unique identifier for inventory tracking</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stockQuantity" className="text-sm font-medium">Current Stock Quantity *</Label>
                        <Input
                          id="stockQuantity"
                          type="number"
                          {...register('inventory.stockQuantity', { valueAsNumber: true })}
                          placeholder="0"
                          className="h-10"
                        />
                        <p className="text-xs text-gray-500">Number of units currently in stock</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reorderLevel" className="text-sm font-medium">Reorder Level *</Label>
                        <Input
                          id="reorderLevel"
                          type="number"
                          {...register('inventory.reorderLevel', { valueAsNumber: true })}
                          placeholder="0"
                          className="h-10"
                        />
                        <p className="text-xs text-gray-500">Minimum stock level before reordering</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxStockLevel" className="text-sm font-medium">Maximum Stock Level *</Label>
                        <Input
                          id="maxStockLevel"
                          type="number"
                          {...register('inventory.maxStockLevel', { valueAsNumber: true })}
                          placeholder="0"
                          className="h-10"
                        />
                        <p className="text-xs text-gray-500">Maximum recommended stock capacity</p>
                      </div>
                    </div>
                  </div>

                  {/* Location & Supplier */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Location & Supplier</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium">Warehouse Location</Label>
                        <Input
                          id="location"
                          {...register('inventory.location')}
                          placeholder="e.g., A-1-B, Shelf 12"
                          className="h-10"
                        />
                        <p className="text-xs text-gray-500">Physical location in warehouse</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="supplier" className="text-sm font-medium">Supplier</Label>
                        <Input
                          id="supplier"
                          {...register('inventory.supplier')}
                          placeholder="e.g., Michelin Direct, ABC Distributors"
                          className="h-10"
                        />
                        <p className="text-xs text-gray-500">Primary supplier for this product</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* SEO */}
              <TabsContent value="seo" className="flex-1 overflow-y-auto space-y-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Search Engine Optimization</h3>
                    <p className="text-sm text-gray-600">
                      SEO fields are automatically generated based on your product information to optimize search engine visibility.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Meta Title</Label>
                      <Input 
                        placeholder="Auto-generated from product name"
                        disabled
                        value={watch('name') ? `${watch('name')} - Premium Tire | Bandencentrale` : 'Product Meta Title'}
                        className="h-10 bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">Automatically generated from product name and brand</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">URL Slug</Label>
                      <Input 
                        placeholder="Auto-generated from product name"
                        disabled
                        value={watch('name') ? watch('name').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 'product-url-slug'}
                        className="h-10 bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">SEO-friendly URL automatically created from product name</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Meta Description</Label>
                      <Textarea
                        placeholder="Auto-generated from short description"
                        disabled
                        value={watch('shortDescription') || 'Product meta description will be generated automatically'}
                        rows={3}
                        className="resize-none bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">Generated from your product's short description</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">SEO Best Practices</h4>
                      <ul className="text-xs text-blue-800 space-y-1">
                        <li>• Include tire size, brand, and category in product name</li>
                        <li>• Write clear, descriptive product descriptions</li>
                        <li>• Use relevant tags that customers might search for</li>
                        <li>• Upload high-quality product images</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 p-4 bg-gray-50 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-tire-gradient w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {product ? 'Update Product' : 'Create Product'}
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;
