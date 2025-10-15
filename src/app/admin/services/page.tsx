'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Settings,
  Clock,
  Euro,
  Users,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Wrench,
  Car,
  Truck,
  Calendar,
  CheckCircle,
  XCircle,
  Star,
  Activity,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { servicesApi, type Service, type CreateServiceData, type ServiceFilters, type ServiceStats } from '@/lib/api/services';

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState<ServiceFilters>({
    search: '',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Form states
  const [formData, setFormData] = useState<CreateServiceData>({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    basePrice: 0,
    hourlyRate: 0,
    estimatedDuration: 60,
    requiresAppointment: true,
    availableOnline: false,
    features: [],
    requirements: '',
    included: '',
    warranty: '',
    metaTitle: '',
    metaDescription: '',
    isActive: true,
    isFeatured: false
  });

  // Features input state
  const [featuresInput, setFeaturesInput] = useState('');

  const queryClient = useQueryClient();

  // Fetch services
  const { data: servicesResponse, isLoading, error } = useQuery({
    queryKey: ['services', filters],
    queryFn: () => servicesApi.getServices(filters),
  });

  // Extract services data
  const services = servicesResponse?.data || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: servicesApi.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service created successfully');
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create service');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: servicesApi.updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service updated successfully');
      setIsEditModalOpen(false);
      setSelectedService(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update service');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: servicesApi.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service deleted successfully');
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete service');
    },
  });

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const addFeature = () => {
    if (featuresInput.trim() && !formData.features?.includes(featuresInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), featuresInput.trim()]
      }));
      setFeaturesInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const handleCreateService = () => {
    createMutation.mutate(formData);
  };

  const handleUpdateService = () => {
    if (!selectedService) return;
    updateMutation.mutate({
      id: selectedService.id,
      ...formData,
    });
  };

  const handleDeleteService = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteService = () => {
    if (!serviceToDelete) return;
    deleteMutation.mutate(serviceToDelete.id);
  };

  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setIsViewModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description || '',
      shortDescription: service.shortDescription || '',
      categoryId: service.categoryId || '',
      basePrice: parseFloat(service.basePrice),
      hourlyRate: service.hourlyRate ? parseFloat(service.hourlyRate) : 0,
      estimatedDuration: service.estimatedDuration,
      requiresAppointment: service.requiresAppointment,
      availableOnline: service.availableOnline,
      features: service.features || [],
      requirements: service.requirements || '',
      included: service.included || '',
      warranty: service.warranty || '',
      metaTitle: service.metaTitle || '',
      metaDescription: service.metaDescription || '',
      isActive: service.isActive,
      isFeatured: service.isFeatured
    });
    setFeaturesInput('');
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      categoryId: '',
      basePrice: 0,
      hourlyRate: 0,
      estimatedDuration: 60,
      requiresAppointment: true,
      availableOnline: false,
      features: [],
      requirements: '',
      included: '',
      warranty: '',
      metaTitle: '',
      metaDescription: '',
      isActive: true,
      isFeatured: false
    });
    setFeaturesInput('');
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const StatCard = ({ title, value, change, changeType, description, icon: Icon, format }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {format ? format(value) : value.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-full bg-blue-100">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        {change && (
          <div className="flex items-center mt-4">
            <span className={`text-sm font-medium ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-2">{description}</span>
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
              <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
              <p className="text-gray-600 mt-2">Manage tire and automotive services</p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>

          {/* Stats Cards - Show loading state */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Services"
              value={services.length}
              icon={Settings}
            />
            <StatCard
              title="Active Services"
              value={services.filter(s => s.isActive).length}
              icon={CheckCircle}
            />
            <StatCard
              title="Inactive Services"
              value={services.filter(s => !s.isActive).length}
              icon={XCircle}
            />
            <StatCard
              title="Avg Price"
              value={services.length > 0 ? services.reduce((sum, s) => sum + parseFloat(s.basePrice), 0) / services.length : 0}
              format={(val: number) => `€${val.toFixed(2)}`}
              icon={Euro}
            />
          </div>      {/* Services Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Service Directory
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search services..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
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

              {/* Refresh */}
              <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['services'] })} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Requires Appointment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Wrench className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{service.name}</p>
                          <p className="text-sm text-gray-500">{service.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">€{parseFloat(service.basePrice).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{formatDuration(service.estimatedDuration)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {service.features?.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {service.features && service.features.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{service.features.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.requiresAppointment ? 'default' : 'secondary'}>
                        {service.requiresAppointment ? 'Required' : 'Optional'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(service.isActive)} border-0`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditService(service)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteService(service)}
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

          {services.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try adjusting your filters or add some services to get started.</p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading services...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Service Modal */}
      <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <ModalContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <ModalHeader>
            <ModalTitle>Add New Service</ModalTitle>
          </ModalHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({ 
                      ...prev, 
                      name,
                      slug: generateSlug(name)
                    }));
                  }}
                  placeholder="Tire Installation - Standard"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="tire-installation-standard"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the service..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief summary for listings..."
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="What customers need to bring or prepare..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="included">What's Included</Label>
                <Textarea
                  id="included"
                  value={formData.included}
                  onChange={(e) => setFormData(prev => ({ ...prev, included: e.target.value }))}
                  placeholder="What's included in this service..."
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warranty">Warranty Information</Label>
              <Input
                id="warranty"
                value={formData.warranty}
                onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
                placeholder="e.g., 12 months workmanship guarantee"
              />
            </div>

            <div className="space-y-2">
              <Label>Service Features</Label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features?.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                  placeholder="25.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (€)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                  placeholder="75.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 60 }))}
                  placeholder="60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">SEO Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="SEO title for search engines..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">SEO Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="SEO description for search engines..."
                  rows={2}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="requiresAppointment"
                  checked={formData.requiresAppointment}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresAppointment: checked }))}
                />
                <Label htmlFor="requiresAppointment">Requires Appointment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="availableOnline"
                  checked={formData.availableOnline}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, availableOnline: checked }))}
                />
                <Label htmlFor="availableOnline">Available Online</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                />
                <Label htmlFor="isFeatured">Featured Service</Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Active Service</Label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateService} disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Service'
                )}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Edit Service Modal */}
      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <ModalHeader>
            <ModalTitle>Edit Service</ModalTitle>
          </ModalHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Service Name *</Label>
                <Input
                  id="editName"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({ 
                      ...prev, 
                      name,
                      slug: generateSlug(name)
                    }));
                  }}
                  placeholder="Tire Installation - Standard"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSlug">Slug *</Label>
                <Input
                  id="editSlug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="tire-installation-standard"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the service..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editShortDescription">Short Description</Label>
                <Textarea
                  id="editShortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief summary for listings..."
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editRequirements">Requirements</Label>
                <Textarea
                  id="editRequirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="What customers need to bring or prepare..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editIncluded">What's Included</Label>
                <Textarea
                  id="editIncluded"
                  value={formData.included}
                  onChange={(e) => setFormData(prev => ({ ...prev, included: e.target.value }))}
                  placeholder="What's included in this service..."
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editWarranty">Warranty Information</Label>
              <Input
                id="editWarranty"
                value={formData.warranty}
                onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
                placeholder="e.g., 12 months workmanship guarantee"
              />
            </div>

            <div className="space-y-2">
              <Label>Service Features</Label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features?.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editPrice">Price (€) *</Label>
                <Input
                  id="editPrice"
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                  placeholder="25.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editHourlyRate">Hourly Rate (€)</Label>
                <Input
                  id="editHourlyRate"
                  type="number"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                  placeholder="75.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDuration">Duration (minutes) *</Label>
                <Input
                  id="editDuration"
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 60 }))}
                  placeholder="60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editMetaTitle">SEO Meta Title</Label>
                <Input
                  id="editMetaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="SEO title for search engines..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editMetaDescription">SEO Meta Description</Label>
                <Textarea
                  id="editMetaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="SEO description for search engines..."
                  rows={2}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="editRequiresAppointment"
                  checked={formData.requiresAppointment}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresAppointment: checked }))}
                />
                <Label htmlFor="editRequiresAppointment">Requires Appointment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="editAvailableOnline"
                  checked={formData.availableOnline}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, availableOnline: checked }))}
                />
                <Label htmlFor="editAvailableOnline">Available Online</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="editIsFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                />
                <Label htmlFor="editIsFeatured">Featured Service</Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="editIsActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="editIsActive">Active Service</Label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateService} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Service'
                )}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Delete Service
            </ModalTitle>
          </ModalHeader>
          {serviceToDelete && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Are you sure you want to delete <strong>{serviceToDelete.name}</strong>? 
                  This action cannot be undone.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={deleteMutation.isPending}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteService} disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Service
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
