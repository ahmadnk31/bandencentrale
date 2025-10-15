"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ImageUpload, { UploadedImage } from "@/components/image-upload";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Palette,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  discount?: string;
  cta: string;
  ctaLink: string;
  image?: string;
  gradient: string;
  bgGradient: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface BannerFormData {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  discount: string;
  cta: string;
  ctaLink: string;
  image: string;
  gradient: string;
  bgGradient: string;
  isActive: boolean;
  sortOrder: number;
}

const HeroBannersManagement = () => {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [formData, setFormData] = useState<BannerFormData>({
    title: "",
    subtitle: "",
    description: "",
    badge: "",
    discount: "",
    cta: "",
    ctaLink: "",
    image: "",
    gradient: "from-orange-500 to-amber-500",
    bgGradient: "from-black/60 to-black/40",
    isActive: true,
    sortOrder: 0,
  });
  const { toast } = useToast();

  const gradientOptions = [
    { name: "Orange to Amber", value: "from-orange-500 to-amber-500" },
    { name: "Blue to Purple", value: "from-blue-500 to-purple-500" },
    { name: "Green to Emerald", value: "from-green-500 to-emerald-500" },
    { name: "Red to Pink", value: "from-red-500 to-pink-500" },
    { name: "Yellow to Orange", value: "from-yellow-500 to-orange-500" },
    { name: "Purple to Pink", value: "from-purple-500 to-pink-500" },
    { name: "Teal to Blue", value: "from-teal-500 to-blue-500" },
    { name: "Indigo to Purple", value: "from-indigo-500 to-purple-500" },
  ];

  const bgGradientOptions = [
    { name: "Dark Overlay", value: "from-black/60 to-black/40" },
    { name: "Blue Overlay", value: "from-blue-900/60 to-blue-700/40" },
    { name: "Purple Overlay", value: "from-purple-900/60 to-purple-700/40" },
    { name: "Green Overlay", value: "from-green-900/60 to-green-700/40" },
    { name: "Orange Overlay", value: "from-orange-900/60 to-orange-700/40" },
  ];

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/hero-banners");
      if (response.ok) {
        const data = await response.json();
        setBanners(data.banners || []);
      } else {
        throw new Error("Failed to fetch banners");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch hero banners",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      badge: "",
      discount: "",
      cta: "",
      ctaLink: "",
      image: "",
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-black/60 to-black/40",
      isActive: true,
      sortOrder: 0,
    });
    setEditingBanner(null);
    setUploadedImages([]);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (banner: HeroBanner) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      badge: banner.badge || "",
      discount: banner.discount || "",
      cta: banner.cta,
      ctaLink: banner.ctaLink,
      image: banner.image || "",
      gradient: banner.gradient,
      bgGradient: banner.bgGradient,
      isActive: banner.isActive,
      sortOrder: banner.sortOrder,
    });
    setEditingBanner(banner);
    setUploadedImages([]); // Reset uploaded images for editing
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Use uploaded image URL if available, otherwise use manual URL
      const imageUrl = uploadedImages.length > 0 && uploadedImages[0].uploadResult?.success
        ? uploadedImages[0].uploadResult.url
        : formData.image;

      const submitData = {
        ...formData,
        image: imageUrl,
      };
      
      const url = editingBanner 
        ? `/api/admin/hero-banners/${editingBanner.id}`
        : "/api/admin/hero-banners";
      
      const method = editingBanner ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Hero banner ${editingBanner ? "updated" : "created"} successfully`,
        });
        setIsDialogOpen(false);
        resetForm();
        fetchBanners();
      } else {
        throw new Error("Failed to save banner");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingBanner ? "update" : "create"} hero banner`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero banner?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/hero-banners/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Hero banner deleted successfully",
        });
        fetchBanners();
      } else {
        throw new Error("Failed to delete banner");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hero banner",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (banner: HeroBanner) => {
    try {
      const response = await fetch(`/api/admin/hero-banners/${banner.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...banner,
          isActive: !banner.isActive,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Hero banner ${!banner.isActive ? "activated" : "deactivated"}`,
        });
        fetchBanners();
      } else {
        throw new Error("Failed to toggle banner status");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Hero Banners</h1>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Banners</h1>
          <p className="text-gray-600 mt-2">Manage your homepage hero banners and promotional content.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Globe className="w-4 h-4 mr-2" />
              Preview Live
            </a>
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate} className="bg-tire-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBanner ? "Edit Hero Banner" : "Create Hero Banner"}
                </DialogTitle>
                <DialogDescription>
                  {editingBanner 
                    ? "Update the hero banner details below."
                    : "Create a new hero banner for your homepage."
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter banner title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input
                        id="subtitle"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="Enter banner subtitle"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter banner description"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="badge">Badge Text</Label>
                      <Input
                        id="badge"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        placeholder="e.g., Limited Time, New Arrivals"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount Text</Label>
                      <Input
                        id="discount"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                        placeholder="e.g., Up to 40% OFF"
                      />
                    </div>
                  </div>

                  {/* CTA and Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Call to Action</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cta">CTA Button Text *</Label>
                      <Input
                        id="cta"
                        value={formData.cta}
                        onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                        placeholder="e.g., Shop Now, Learn More"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ctaLink">CTA Link *</Label>
                      <Input
                        id="ctaLink"
                        value={formData.ctaLink}
                        onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                        placeholder="/products, /services, etc."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Background Image</Label>
                      <div className="space-y-4">
                        {/* Image Upload Component */}
                        <ImageUpload
                          onImagesChange={setUploadedImages}
                          existingImages={formData.image ? [formData.image] : []}
                          maxFiles={1}
                          uploadType="general"
                          title="Upload Banner Background"
                          description="Upload a high-quality background image for your hero banner"
                          acceptedFormats="JPEG, PNG, WebP"
                          maxFileSize="10MB"
                        />
                        
                        {/* Upload Status */}
                        {uploadedImages.length > 0 && (
                          <div className="text-sm text-gray-600">
                            {uploadedImages[0].isUploading ? (
                              <p className="text-blue-600">📤 Uploading image...</p>
                            ) : uploadedImages[0].uploadResult?.success ? (
                              <p className="text-green-600">✅ Image uploaded successfully!</p>
                            ) : uploadedImages[0].error ? (
                              <p className="text-red-600">❌ Upload failed: {uploadedImages[0].error}</p>
                            ) : null}
                          </div>
                        )}
                        
                        {/* Manual URL Input (fallback) */}
                        <div className="space-y-2">
                          <Label htmlFor="imageUrl" className="text-sm text-gray-600">
                            Or enter image URL manually
                          </Label>
                          <Input
                            id="imageUrl"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://example.com/banner-image.jpg"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sortOrder">Sort Order</Label>
                      <Input
                        id="sortOrder"
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                  </div>
                </div>

                {/* Styling Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Styling</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Gradient</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {gradientOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, gradient: option.value })}
                            className={`p-3 rounded-lg border-2 text-sm ${
                              formData.gradient === option.value
                                ? "border-orange-500 ring-2 ring-orange-200"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className={`w-full h-8 bg-gradient-to-r ${option.value} rounded mb-2`}></div>
                            <div className="text-xs">{option.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Background Overlay</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {bgGradientOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, bgGradient: option.value })}
                            className={`p-3 rounded-lg border-2 text-sm text-left ${
                              formData.bgGradient === option.value
                                ? "border-orange-500 ring-2 ring-orange-200"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className={`w-full h-6 bg-gradient-to-r ${option.value} rounded mb-2`}></div>
                            <div className="text-xs">{option.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                {(formData.title || uploadedImages.length > 0 || formData.image) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Live Preview</h3>
                    <div className={`relative h-48 rounded-lg overflow-hidden bg-gradient-to-r ${formData.bgGradient}`}>
                      {/* Background Image */}
                      {((uploadedImages.length > 0 && uploadedImages[0].uploadResult?.success) || formData.image) && (
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ 
                            backgroundImage: `url(${
                              uploadedImages.length > 0 && uploadedImages[0].uploadResult?.success 
                                ? uploadedImages[0].uploadResult.url 
                                : formData.image
                            })` 
                          }}
                        />
                      )}
                      <div className={`absolute inset-0 bg-gradient-to-r ${formData.bgGradient}`} />
                      
                      {/* Content Preview */}
                      <div className="relative h-full p-6 flex items-center">
                        <div className="text-white space-y-3">
                          {formData.badge && (
                            <Badge className={`bg-gradient-to-r ${formData.gradient} text-white border-0 text-sm font-bold`}>
                              {formData.badge}
                            </Badge>
                          )}
                          {formData.title && (
                            <h3 className="text-2xl font-bold">{formData.title}</h3>
                          )}
                          {formData.subtitle && (
                            <p className="text-lg opacity-90">{formData.subtitle}</p>
                          )}
                          {formData.description && (
                            <p className="text-sm opacity-80 max-w-md">{formData.description}</p>
                          )}
                          {formData.discount && (
                            <div className={`bg-gradient-to-r ${formData.gradient} text-white px-4 py-2 rounded-lg text-lg font-bold inline-block`}>
                              {formData.discount}
                            </div>
                          )}
                          {formData.cta && (
                            <Button 
                              className={`bg-gradient-to-r ${formData.gradient} hover:opacity-90 text-white font-semibold px-6 py-2 rounded-lg`}
                              disabled
                            >
                              {formData.cta}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-tire-gradient">
                    {editingBanner ? "Update Banner" : "Create Banner"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Banner List */}
      <div className="space-y-6">
        {banners.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Hero Banners</h3>
              <p className="text-gray-600 mb-6 text-center">
                Create your first hero banner to showcase promotions and guide customers.
              </p>
              <Button onClick={handleCreate} className="bg-tire-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Create First Banner
              </Button>
            </CardContent>
          </Card>
        ) : (
          banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`hover:shadow-lg transition-shadow ${!banner.isActive ? "opacity-60" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Preview */}
                      <div className={`relative h-32 rounded-lg overflow-hidden mb-4 bg-gradient-to-r ${banner.bgGradient}`}>
                        {banner.image && (
                          <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${banner.image})` }}
                          />
                        )}
                        <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient}`} />
                        <div className="relative h-full p-4 flex items-center">
                          <div className="text-white space-y-2">
                            {banner.badge && (
                              <Badge className={`bg-gradient-to-r ${banner.gradient} text-white border-0 text-xs`}>
                                {banner.badge}
                              </Badge>
                            )}
                            <h3 className="text-lg font-bold truncate">{banner.title}</h3>
                            {banner.subtitle && (
                              <p className="text-sm opacity-90 truncate">{banner.subtitle}</p>
                            )}
                            {banner.discount && (
                              <div className={`bg-gradient-to-r ${banner.gradient} text-white px-3 py-1 rounded-lg text-sm font-bold inline-block`}>
                                {banner.discount}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{banner.title}</h3>
                          <Badge variant={banner.isActive ? "default" : "secondary"}>
                            {banner.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">Order: {banner.sortOrder}</Badge>
                        </div>
                        
                        {banner.subtitle && (
                          <p className="text-gray-600">{banner.subtitle}</p>
                        )}
                        
                        {banner.description && (
                          <p className="text-sm text-gray-500 truncate">{banner.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>CTA: {banner.cta}</span>
                          <span>•</span>
                          <span>Link: {banner.ctaLink}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(banner)}
                        title={banner.isActive ? "Deactivate" : "Activate"}
                      >
                        {banner.isActive ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(banner)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(banner.id)}
                        title="Delete"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default HeroBannersManagement;
