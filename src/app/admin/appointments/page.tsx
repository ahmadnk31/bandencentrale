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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  CalendarDays,
  Wrench,
  Car,
  MessageSquare,
  Timer,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { appointmentApi, type Appointment as ApiAppointment, type CreateAppointmentData, type AppointmentStats as ApiAppointmentStats } from '@/lib/api/appointments';
import { servicesApi, type Service } from '@/lib/api/services';

interface AppointmentFilters {
  search: string;
  status: string;
  type: string;
  serviceId: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function AppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<ApiAppointment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<ApiAppointment | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState<AppointmentFilters>({
    search: '',
    status: 'all',
    type: 'all',
    serviceId: 'all',
    sortBy: 'scheduledDate',
    sortOrder: 'asc'
  });

  // Form states
  const [formData, setFormData] = useState<CreateAppointmentData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    type: 'service',
    scheduledDate: '',
    scheduledTime: '',
    estimatedDuration: 60,
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleLicense: '',
    notes: '',
    internalNotes: ''
  });

  const queryClient = useQueryClient();

  // Fetch appointments
  const { data: appointmentsResponse, isLoading, error } = useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => appointmentApi.getAppointments({
      search: filters.search || undefined,
      status: filters.status !== 'all' ? filters.status : undefined,
      type: filters.type !== 'all' ? filters.type : undefined,
      serviceId: filters.serviceId !== 'all' ? filters.serviceId : undefined,
      sort: filters.sortBy,
      sortOrder: filters.sortOrder,
    }),
  });

  // Extract data from API response
  const appointments = appointmentsResponse?.data || [];

  // Fetch stats
  const { data: statsResponse } = useQuery({
    queryKey: ['appointment-stats'],
    queryFn: () => appointmentApi.getAppointmentStats(),
  });

  // Fetch services for dropdowns
  const { data: servicesResponse } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.getServices(), // Get all services
  });

  // Extract stats data
  const stats = statsResponse?.data;
  const services = servicesResponse?.data || [];

  // Computed filtered appointments (for additional client-side filtering if needed)
  const filteredAppointments = appointments.filter((appointment: ApiAppointment) => {
    // Additional client-side filtering can be added here if needed
    return true;
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: appointmentApi.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
      toast.success('Appointment created successfully');
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create appointment');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: appointmentApi.updateAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
      toast.success('Appointment updated successfully');
      setIsEditModalOpen(false);
      setSelectedAppointment(null);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update appointment');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: appointmentApi.deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
      toast.success('Appointment deleted successfully');
      setIsDeleteModalOpen(false);
      setAppointmentToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete appointment');
    },
  });

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApiAppointment['status'] }) =>
      appointmentApi.updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
      toast.success('Appointment status updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update appointment status');
    },
  });

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      serviceId: '',
      type: 'service',
      scheduledDate: '',
      scheduledTime: '',
      estimatedDuration: 60,
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      vehicleLicense: '',
      notes: ''
    });
  };

  const handleCreateAppointment = () => {
    createMutation.mutate(formData);
  };

  const handleUpdateAppointment = () => {
    if (!selectedAppointment) return;
    
    updateMutation.mutate({
      id: selectedAppointment.id,
      ...formData,
    });
  };

  const handleUpdateStatus = (appointment: ApiAppointment, newStatus: ApiAppointment['status']) => {
    statusMutation.mutate({ id: appointment.id, status: newStatus });
  };

  const handleDeleteAppointment = (appointment: ApiAppointment) => {
    setAppointmentToDelete(appointment);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAppointment = () => {
    if (!appointmentToDelete) return;
    deleteMutation.mutate(appointmentToDelete.id);
  };

  const handleViewAppointment = (appointment: ApiAppointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleEditAppointment = (appointment: ApiAppointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      customerName: appointment.customerName || '',
      customerEmail: appointment.customerEmail || '',
      customerPhone: appointment.customerPhone || '',
      serviceId: appointment.serviceId,
      type: appointment.type,
      scheduledDate: appointment.scheduledDate.split('T')[0],
      scheduledTime: appointment.scheduledTime,
      estimatedDuration: appointment.estimatedDuration,
      vehicleMake: appointment.vehicleMake || '',
      vehicleModel: appointment.vehicleModel || '',
      vehicleYear: appointment.vehicleYear || '',
      vehicleLicense: appointment.vehicleLicense || '',
      notes: appointment.notes || '',
      internalNotes: appointment.internalNotes || '',
    });
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceTypeIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'service': return Wrench;
      case 'installation': return RefreshCw;
      case 'consultation': return MessageSquare;
      default: return Wrench;
    }
  };

  const StatCard = ({ title, value, change, changeType, description, icon: Icon }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-2">Manage tire installation and service appointments</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            change="+12"
            changeType="increase"
            description="this month"
            icon={Calendar}
          />
          <StatCard
            title="Today"
            value={stats.todayAppointments}
            change="+2"
            changeType="increase"
            description="vs yesterday"
            icon={CalendarDays}
          />
          <StatCard
            title="Confirmed"
            value={stats.confirmedAppointments}
            icon={CheckCircle}
          />
          <StatCard
            title="Completed"
            value={stats.completedAppointments}
            change="+5"
            changeType="increase"
            description="this week"
            icon={Wrench}
          />
          <StatCard
            title="Cancelled"
            value={stats.cancelledAppointments}
            change="-1"
            changeType="decrease"
            description="this week"
            icon={XCircle}
          />
          <StatCard
            title="Avg Duration"
            value={`${stats.averageDuration}min`}
            icon={Timer}
          />
        </div>
      )}

      {/* Filters and Appointments Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Appointment Schedule
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search appointments..."
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
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Service Filter */}
              <Select 
                value={filters.serviceId} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, serviceId: value }))}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Refresh */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['appointments'] })} 
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading appointments...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading appointments</h3>
                <p className="text-gray-600">Please try refreshing the page.</p>
              </div>
            ) : (
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => {
                  const ServiceIcon = getServiceTypeIcon(appointment.service?.category || appointment.type || 'service');
                  return (
                    <TableRow key={appointment.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{appointment.user?.name || 'Unknown'}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span>{appointment.user?.email || 'No email'}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{appointment.user?.phone || 'No phone'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{new Date(appointment.scheduledDate).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{appointment.scheduledTime}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <ServiceIcon className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{appointment.service?.name || 'Service'}</p>
                            <p className="text-sm text-gray-500 capitalize">{appointment.type?.replace('-', ' ') || 'Service'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.vehicleMake || ''} {appointment.vehicleModel || ''}</p>
                          <p className="text-sm text-gray-500">{appointment.vehicleYear || ''}</p>
                          {appointment.vehicleLicense && (
                            <p className="text-xs text-gray-400">{appointment.vehicleLicense}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{appointment.estimatedDuration || 60}min</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={appointment.status}
                          onValueChange={(value) => handleUpdateStatus(appointment, value as ApiAppointment['status'])}
                        >
                          <SelectTrigger className="w-32">
                            <Badge className={`${getStatusColor(appointment.status)} border-0`}>
                              {appointment.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="no-show">No Show</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="text-gray-500">€{appointment.service?.price || 0} (est.)</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewAppointment(appointment)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditAppointment(appointment)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteAppointment(appointment)}
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
            )}
          </div>

          {appointments.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">Try adjusting your filters or book some appointments to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Book Appointment Modal */}
      <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <ModalContent className="w-full h-full p-6 overflow-y-auto">
          <ModalHeader>
            <ModalTitle>Book New Appointment</ModalTitle>
          </ModalHeader>
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone *</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="+32 9 123 45 67"
                  />
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Appointment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Date *</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledTime">Time *</Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedDuration">Duration (minutes)</Label>
                  <Select 
                    value={formData.estimatedDuration.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="180">3 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Service Type *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as ApiAppointment['type'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceId">Service</Label>
                  <Select 
                    value={formData.serviceId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - €{service.basePrice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleMake">Make *</Label>
                  <Input
                    id="vehicleMake"
                    value={formData.vehicleMake}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleMake: e.target.value }))}
                    placeholder="BMW"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Model *</Label>
                  <Input
                    id="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                    placeholder="3 Series"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear">Year</Label>
                  <Input
                    id="vehicleYear"
                    type="number"
                    value={formData.vehicleYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleYear: e.target.value }))}
                    placeholder="2020"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleLicense">License Plate</Label>
                <Input
                  id="vehicleLicense"
                  value={formData.vehicleLicense}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleLicense: e.target.value }))}
                  placeholder="1-ABC-123"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requirements or notes..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAppointment}>
                Book Appointment
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <ModalHeader>
            <ModalTitle>Edit Appointment</ModalTitle>
          </ModalHeader>
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-customerName">Customer Name</Label>
                  <Input
                    id="edit-customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-customerEmail">Email</Label>
                  <Input
                    id="edit-customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="customer@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-customerPhone">Phone</Label>
                  <Input
                    id="edit-customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="+32 XXX XX XX XX"
                  />
                </div>
              </div>
            </div>

            {/* Service & Scheduling */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Service & Scheduling</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-type">Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-service">Service</Label>
                  <Select 
                    value={formData.serviceId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - €{service.basePrice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-scheduledDate">Date</Label>
                  <Input
                    id="edit-scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-scheduledTime">Time</Label>
                  <Input
                    id="edit-scheduledTime"
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-estimatedDuration">Duration (minutes)</Label>
                  <Input
                    id="edit-estimatedDuration"
                    type="number"
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 60 }))}
                    placeholder="60"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-vehicleMake">Make</Label>
                  <Input
                    id="edit-vehicleMake"
                    value={formData.vehicleMake}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleMake: e.target.value }))}
                    placeholder="BMW, Mercedes, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="edit-vehicleModel">Model</Label>
                  <Input
                    id="edit-vehicleModel"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                    placeholder="3 Series, C-Class, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="edit-vehicleYear">Year</Label>
                  <Input
                    id="edit-vehicleYear"
                    value={formData.vehicleYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleYear: e.target.value }))}
                    placeholder="2020"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-vehicleLicense">License Plate</Label>
                  <Input
                    id="edit-vehicleLicense"
                    value={formData.vehicleLicense}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleLicense: e.target.value }))}
                    placeholder="ABC-123"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-notes">Customer Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special requests or notes..."
                    rows={3}
                  />
                </div>
                {formData.internalNotes !== undefined && (
                  <div>
                    <Label htmlFor="edit-internalNotes">Internal Notes</Label>
                    <Textarea
                      id="edit-internalNotes"
                      value={formData.internalNotes}
                      onChange={(e) => setFormData(prev => ({ ...prev, internalNotes: e.target.value }))}
                      placeholder="Internal notes for staff..."
                      rows={2}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateAppointment} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Update Appointment'
                )}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* View Appointment Modal */}
      <Modal open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <ModalContent className="max-w-2xl">
          <ModalHeader>
            <ModalTitle>Appointment Details</ModalTitle>
          </ModalHeader>
          {selectedAppointment && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{selectedAppointment.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedAppointment.customerEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedAppointment.customerPhone}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Appointment</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(selectedAppointment.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{selectedAppointment.scheduledTime} ({selectedAppointment.estimatedDuration} min)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(selectedAppointment.status)}>
                        {selectedAppointment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Service Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{selectedAppointment.service?.name || 'Service'}</p>
                  <p className="text-sm text-gray-600 capitalize mt-1">{selectedAppointment.type?.replace('-', ' ') || 'Service'}</p>
                  {selectedAppointment.service?.price && (
                    <p className="text-sm mt-2">
                      <span className="text-gray-600">Cost: </span>
                      <span>€{selectedAppointment.service.price} (estimated)</span>
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Make & Model</p>
                    <p className="font-medium">{selectedAppointment.vehicleMake} {selectedAppointment.vehicleModel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-medium">{selectedAppointment.vehicleYear}</p>
                  </div>
                  {selectedAppointment.vehicleLicense && (
                    <div>
                      <p className="text-sm text-gray-600">License Plate</p>
                      <p className="font-medium">{selectedAppointment.vehicleLicense}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedAppointment.notes && (
                <div>
                  <h3 className="font-semibold mb-3">Customer Notes</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-800">{selectedAppointment.notes}</p>
                  </div>
                </div>
              )}
              
              {selectedAppointment.internalNotes && (
                <div>
                  <h3 className="font-semibold mb-3">Internal Notes</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-800">{selectedAppointment.internalNotes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Cancel Appointment
            </ModalTitle>
          </ModalHeader>
          {appointmentToDelete && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Are you sure you want to cancel the appointment for <strong>{appointmentToDelete.user?.name || appointmentToDelete.customerName}</strong> 
                  on {new Date(appointmentToDelete.scheduledDate).toLocaleDateString()} at {appointmentToDelete.scheduledTime}?
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={deleteMutation.isPending}>
                  Keep Appointment
                </Button>
                <Button variant="destructive" onClick={confirmDeleteAppointment} disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Appointment
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
