'use client';

import { useState, useEffect } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Send,
  Download,
  Mail,
  Phone,
  User,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Printer,
  Copy,
  ExternalLink
} from 'lucide-react';

interface QuoteItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productId?: string;
  serviceId?: string;
}

interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  items: QuoteItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  validUntil: string;
  notes?: string;
  requirements?: string;
  createdAt: string;
  sentAt?: string;
  viewedAt?: string;
  respondedAt?: string;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    licensePlate?: string;
  };
}

interface QuoteStats {
  totalQuotes: number;
  pendingQuotes: number;
  acceptedQuotes: number;
  rejectedQuotes: number;
  totalValue: number;
  averageValue: number;
}

interface QuoteFilters {
  search: string;
  status: string;
  dateRange: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState<QuoteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<QuoteFilters>({
    search: '',
    status: 'all',
    dateRange: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Form states
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    licensePlate: '',
    notes: '',
    requirements: '',
    validDays: 30,
    items: [
      {
        name: '',
        description: '',
        quantity: 1,
        unitPrice: 0
      }
    ]
  });

  useEffect(() => {
    loadQuotes();
    loadStats();
  }, [filters]);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '20',
        search: filters.search,
        status: filters.status,
        dateRange: filters.dateRange,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const response = await fetch(`/api/admin/quotes?${params}`);
      const result = await response.json();

      if (result.success) {
        setQuotes(result.data.map((quote: any) => ({
          id: quote.id,
          quoteNumber: quote.quoteNumber,
          customerId: quote.userId || 'guest',
          customerName: quote.customerName,
          customerEmail: quote.customerEmail,
          customerPhone: quote.customerPhone || '',
          status: quote.status,
          items: quote.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            quantity: item.quantity,
            unitPrice: parseFloat(item.unitPrice),
            totalPrice: parseFloat(item.totalPrice),
            productId: item.productId,
            serviceId: item.serviceId,
          })),
          subtotal: parseFloat(quote.subtotal),
          taxAmount: parseFloat(quote.taxAmount),
          discountAmount: parseFloat(quote.discountAmount),
          totalAmount: parseFloat(quote.totalAmount),
          validUntil: quote.validUntil,
          notes: quote.notes || '',
          requirements: quote.requirements || '',
          createdAt: quote.createdAt,
          sentAt: quote.sentAt,
          viewedAt: quote.viewedAt,
          respondedAt: quote.acceptedAt,
          vehicleInfo: quote.vehicleMake && quote.vehicleModel ? {
            make: quote.vehicleMake,
            model: quote.vehicleModel,
            year: parseInt(quote.vehicleYear || '0'),
            licensePlate: ''
          } : undefined,
        })));
      } else {
        console.error('Failed to load quotes:', result.message);
      }
    } catch (error) {
      console.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/quotes/stats');
      const result = await response.json();

      if (result.success) {
        setStats({
          totalQuotes: result.data.overview.totalQuotes,
          pendingQuotes: result.data.overview.pendingQuotes,
          acceptedQuotes: result.data.overview.acceptedQuotes,
          rejectedQuotes: result.data.overview.rejectedQuotes,
          totalValue: result.data.financial.totalValue,
          averageValue: result.data.financial.averageValue,
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleCreateQuote = async (sendImmediately = false) => {
    try {
      const response = await fetch('/api/admin/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          vehicleMake: formData.vehicleMake,
          vehicleModel: formData.vehicleModel,
          vehicleYear: formData.vehicleYear.toString(),
          notes: formData.notes,
          requirements: formData.requirements,
          validDays: formData.validDays,
          items: formData.items.filter(item => item.name.trim() !== ''),
          sendImmediately,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsAddModalOpen(false);
        // Reset form
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          vehicleMake: '',
          vehicleModel: '',
          vehicleYear: new Date().getFullYear(),
          licensePlate: '',
          notes: '',
          requirements: '',
          validDays: 30,
          items: [
            {
              name: '',
              description: '',
              quantity: 1,
              unitPrice: 0
            }
          ]
        });
        await loadQuotes();
      } else {
        console.error('Failed to create quote:', result.message);
        alert('Failed to create quote: ' + result.message);
      }
    } catch (error) {
      console.error('Failed to create quote:', error);
      alert('Failed to create quote. Please try again.');
    }
  };

  const handleSendQuote = async (quoteId: string) => {
    try {
      const response = await fetch(`/api/admin/quotes/${quoteId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        await loadQuotes();
        alert('Quote sent successfully!');
      } else {
        console.error('Failed to send quote:', result.message);
        alert('Failed to send quote: ' + result.message);
      }
    } catch (error) {
      console.error('Failed to send quote:', error);
      alert('Failed to send quote. Please try again.');
    }
  };

  const handleUpdateStatus = async (quoteId: string, newStatus: Quote['status']) => {
    try {
      const response = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await loadQuotes();
      } else {
        console.error('Failed to update quote status:', result.message);
        alert('Failed to update quote status: ' + result.message);
      }
    } catch (error) {
      console.error('Failed to update quote status:', error);
      alert('Failed to update quote status. Please try again.');
    }
  };

  const handleDeleteQuote = (quote: Quote) => {
    setQuoteToDelete(quote);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteQuote = async () => {
    if (!quoteToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/quotes/${quoteToDelete.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await loadQuotes();
        setIsDeleteModalOpen(false);
        setQuoteToDelete(null);
      } else {
        console.error('Failed to delete quote:', result.message);
        alert('Failed to delete quote: ' + result.message);
      }
    } catch (error) {
      console.error('Failed to delete quote:', error);
      alert('Failed to delete quote. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsViewModalOpen(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsEditModalOpen(true);
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: '',
          description: '',
          quantity: 1,
          unitPrice: 0
        }
      ]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, change, changeType, description, icon: Icon }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {typeof value === 'number' && title.includes('Value') 
                ? `€${value.toLocaleString()}` 
                : value.toLocaleString()
              }
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
          <h1 className="text-3xl font-bold text-gray-900">Quote Management</h1>
          <p className="text-gray-600 mt-2">Create and manage tire service quotes</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Quote
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatCard
            title="Total Quotes"
            value={stats.totalQuotes}
            change="+8"
            changeType="increase"
            description="this month"
            icon={FileText}
          />
          <StatCard
            title="Pending"
            value={stats.pendingQuotes}
            change="+3"
            changeType="increase"
            description="awaiting response"
            icon={Clock}
          />
          <StatCard
            title="Accepted"
            value={stats.acceptedQuotes}
            change="+12"
            changeType="increase"
            description="this month"
            icon={CheckCircle}
          />
          <StatCard
            title="Rejected"
            value={stats.rejectedQuotes}
            change="-2"
            changeType="decrease"
            description="this month"
            icon={XCircle}
          />
          <StatCard
            title="Total Value"
            value={stats.totalValue}
            change="+15.2%"
            changeType="increase"
            description="vs last month"
            icon={DollarSign}
          />
          <StatCard
            title="Avg Value"
            value={stats.averageValue}
            change="+€23"
            changeType="increase"
            description="per quote"
            icon={DollarSign}
          />
        </div>
      )}

      {/* Filters and Quotes Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Quote Directory
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search quotes..."
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>

              {/* Refresh */}
              <Button variant="outline" size="sm" onClick={loadQuotes} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-blue-600">{quote.quoteNumber}</p>
                        <p className="text-xs text-gray-500">{quote.items.length} item(s)</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{quote.customerName}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span>{quote.customerEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Phone className="w-3 h-3" />
                          <span>{quote.customerPhone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {quote.vehicleInfo && (
                        <div>
                          <p className="font-medium">{quote.vehicleInfo.make} {quote.vehicleInfo.model}</p>
                          <p className="text-sm text-gray-500">{quote.vehicleInfo.year}</p>
                          {quote.vehicleInfo.licensePlate && (
                            <p className="text-xs text-gray-400">{quote.vehicleInfo.licensePlate}</p>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold text-lg">€{quote.totalAmount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Subtotal: €{quote.subtotal.toFixed(2)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={quote.status}
                        onValueChange={(value) => handleUpdateStatus(quote.id, value as Quote['status'])}
                      >
                        <SelectTrigger className="w-28">
                          <Badge className={`${getStatusColor(quote.status)} border-0`}>
                            {quote.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="viewed">Viewed</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{new Date(quote.validUntil).toLocaleDateString()}</p>
                        {new Date(quote.validUntil) < new Date() && (
                          <p className="text-xs text-red-500">Expired</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {quote.status === 'draft' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleSendQuote(quote.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleViewQuote(quote)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditQuote(quote)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteQuote(quote)}
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

          {quotes.length === 0 && !loading && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes found</h3>
              <p className="text-gray-600">Try adjusting your filters or create a new quote to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Quote Modal */}
      <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <ModalContent className="w-full h-full p-6 overflow-y-auto">
          <ModalHeader>
            <ModalTitle>Create New Quote</ModalTitle>
          </ModalHeader>
          <div className="space-y-6 px-6 pb-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleMake">Make</Label>
                  <Input
                    id="vehicleMake"
                    value={formData.vehicleMake}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleMake: e.target.value }))}
                    placeholder="BMW"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Model</Label>
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
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleYear: parseInt(e.target.value) || new Date().getFullYear() }))}
                    placeholder="2020"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData(prev => ({ ...prev, licensePlate: e.target.value }))}
                    placeholder="1-ABC-123"
                  />
                </div>
              </div>
            </div>

            {/* Quote Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Quote Items</h3>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                    <div className="md:col-span-2 space-y-2">
                      <Label>Item Name *</Label>
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        placeholder="Michelin Pilot Sport 4S"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="225/45R17 94Y"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Price (€)</Label>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <Label>Total</Label>
                        <div className="h-10 flex items-center px-3 border rounded-md bg-gray-50">
                          €{(item.quantity * item.unitPrice).toFixed(2)}
                        </div>
                      </div>
                      {formData.items.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quote Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validDays">Valid for (days)</Label>
                  <Select 
                    value={formData.validDays.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, validDays: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional notes for the customer..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="Special requirements or conditions..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => handleCreateQuote(false)}>
                Save as Draft
              </Button>
              <Button onClick={() => handleCreateQuote(true)}>
                Create & Send Quote
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* View Quote Modal */}
      <Modal open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <ModalContent className="w-full h-full p-6 overflow-y-auto">
          <ModalHeader>
            <ModalTitle className="flex items-center justify-between">
              <span>Quote Details - {selectedQuote?.quoteNumber}</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </ModalTitle>
          </ModalHeader>
          {selectedQuote && (
            <div className="space-y-6 px-6 pb-6">
              {/* Quote Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{selectedQuote.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedQuote.customerEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedQuote.customerPhone}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Quote Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quote Number:</span>
                      <span className="font-medium">{selectedQuote.quoteNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedQuote.status)}>
                        {selectedQuote.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span>{new Date(selectedQuote.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valid Until:</span>
                      <span>{new Date(selectedQuote.validUntil).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              {selectedQuote.vehicleInfo && (
                <div>
                  <h3 className="font-semibold mb-3">Vehicle Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">
                      {selectedQuote.vehicleInfo.make} {selectedQuote.vehicleInfo.model} ({selectedQuote.vehicleInfo.year})
                    </p>
                    {selectedQuote.vehicleInfo.licensePlate && (
                      <p className="text-sm text-gray-600">License Plate: {selectedQuote.vehicleInfo.licensePlate}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Quote Items */}
              <div>
                <h3 className="font-semibold mb-3">Quote Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedQuote.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-gray-600">{item.description}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">€{item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium">€{item.totalPrice.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Quote Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>€{selectedQuote.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (21%):</span>
                      <span>€{selectedQuote.taxAmount.toFixed(2)}</span>
                    </div>
                    {selectedQuote.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-€{selectedQuote.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>€{selectedQuote.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes and Requirements */}
              {(selectedQuote.notes || selectedQuote.requirements) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedQuote.notes && (
                    <div>
                      <h3 className="font-semibold mb-3">Notes</h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-800">{selectedQuote.notes}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedQuote.requirements && (
                    <div>
                      <h3 className="font-semibold mb-3">Requirements</h3>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-gray-800">{selectedQuote.requirements}</p>
                      </div>
                    </div>
                  )}
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
              Delete Quote
            </ModalTitle>
          </ModalHeader>
          {quoteToDelete && (
            <div className="space-y-4 px-6 pb-6">
              <Alert>
                <AlertDescription>
                  Are you sure you want to delete quote <strong>{quoteToDelete.quoteNumber}</strong> 
                  for {quoteToDelete.customerName}? This action cannot be undone.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteQuote} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Quote
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
