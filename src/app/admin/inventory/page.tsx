'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  Download,
  Upload,
  BarChart3,
  ArrowUpCircle,
  ArrowDownCircle,
  Minus,
  Calendar,
  User,
  FileText,
  Package2,
  Warehouse,
  Activity
} from 'lucide-react';

interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  movementType: 'in' | 'out' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  referenceType?: 'order' | 'purchase' | 'return' | 'adjustment' | 'damaged';
  referenceId?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  location?: string;
}

interface InventoryStats {
  totalProducts: number;
  totalStockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalMovements: number;
  incomingStock: number;
  outgoingStock: number;
  averageStockLevel: number;
}

interface StockFilters {
  search: string;
  movementType: string;
  referenceType: string;
  dateRange: string;
  productId: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const MOVEMENT_TYPES = [
  { value: 'in', label: 'Stock In', color: 'bg-green-100 text-green-800' },
  { value: 'out', label: 'Stock Out', color: 'bg-red-100 text-red-800' },
  { value: 'adjustment', label: 'Adjustment', color: 'bg-blue-100 text-blue-800' }
];

const REFERENCE_TYPES = [
  { value: 'order', label: 'Customer Order' },
  { value: 'purchase', label: 'Purchase Order' },
  { value: 'return', label: 'Return' },
  { value: 'adjustment', label: 'Stock Adjustment' },
  { value: 'damaged', label: 'Damaged/Lost' }
];

export default function InventoryPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [movementToDelete, setMovementToDelete] = useState<StockMovement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<StockFilters>({
    search: '',
    movementType: 'all',
    referenceType: 'all',
    dateRange: 'all',
    productId: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Form states
  const [formData, setFormData] = useState({
    productId: '',
    movementType: 'in' as 'in' | 'out' | 'adjustment',
    quantity: 0,
    reason: '',
    referenceType: 'adjustment',
    referenceId: '',
    notes: '',
    location: ''
  });

  useEffect(() => {
    loadInventoryData();
  }, [filters]);

  const loadInventoryData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const mockMovements: StockMovement[] = [
        {
          id: '1',
          productId: 'prod-1',
          productName: 'Michelin Pilot Sport 4 225/45R17',
          productSku: 'MICH-PS4-225-45-17',
          movementType: 'in',
          quantity: 50,
          previousStock: 25,
          newStock: 75,
          reason: 'Weekly stock replenishment',
          referenceType: 'purchase',
          referenceId: 'PO-2024-0156',
          notes: 'Delivery from main warehouse',
          createdBy: 'John Doe',
          createdAt: '2024-10-11T09:30:00Z',
          location: 'Warehouse A'
        },
        {
          id: '2',
          productId: 'prod-2',
          productName: 'Continental ContiSportContact 205/55R16',
          productSku: 'CONT-CSC-205-55-16',
          movementType: 'out',
          quantity: 4,
          previousStock: 42,
          newStock: 38,
          reason: 'Customer order fulfillment',
          referenceType: 'order',
          referenceId: 'ORD-2024-1234',
          createdBy: 'Jane Smith',
          createdAt: '2024-10-11T08:15:00Z',
          location: 'Warehouse A'
        },
        {
          id: '3',
          productId: 'prod-3',
          productName: 'Bridgestone Turanza T005 195/65R15',
          productSku: 'BRIDG-T005-195-65-15',
          movementType: 'adjustment',
          quantity: -2,
          previousStock: 32,
          newStock: 30,
          reason: 'Inventory count correction',
          referenceType: 'adjustment',
          referenceId: 'ADJ-2024-089',
          notes: 'Found damaged items during audit',
          createdBy: 'Mike Wilson',
          createdAt: '2024-10-10T16:45:00Z',
          location: 'Warehouse B'
        },
        {
          id: '4',
          productId: 'prod-4',
          productName: 'Pirelli P Zero 245/40R18',
          productSku: 'PIR-PZ-245-40-18',
          movementType: 'out',
          quantity: 2,
          previousStock: 18,
          newStock: 16,
          reason: 'Customer order fulfillment',
          referenceType: 'order',
          referenceId: 'ORD-2024-1235',
          createdBy: 'Sarah Johnson',
          createdAt: '2024-10-10T14:20:00Z',
          location: 'Warehouse A'
        },
        {
          id: '5',
          productId: 'prod-5',
          productName: 'Goodyear Eagle F1 Asymmetric 5 225/50R17',
          productSku: 'GOOD-EF1A5-225-50-17',
          movementType: 'in',
          quantity: 30,
          previousStock: 8,
          newStock: 38,
          reason: 'Emergency stock replenishment',
          referenceType: 'purchase',
          referenceId: 'PO-2024-0157',
          notes: 'Rush order due to high demand',
          createdBy: 'David Brown',
          createdAt: '2024-10-09T11:30:00Z',
          location: 'Warehouse A'
        },
        {
          id: '6',
          productId: 'prod-6',
          productName: 'Hankook Ventus V12 Evo2 215/45R17',
          productSku: 'HANK-V12E2-215-45-17',
          movementType: 'out',
          quantity: 1,
          previousStock: 15,
          newStock: 14,
          reason: 'Damaged tire return processing',
          referenceType: 'damaged',
          referenceId: 'DMG-2024-045',
          notes: 'Tire damaged during installation',
          createdBy: 'Lisa Garcia',
          createdAt: '2024-10-09T09:45:00Z',
          location: 'Warehouse B'
        }
      ];

      const mockStats: InventoryStats = {
        totalProducts: 1247,
        totalStockValue: 875340,
        lowStockItems: 23,
        outOfStockItems: 5,
        totalMovements: 1567,
        incomingStock: 2340,
        outgoingStock: 1890,
        averageStockLevel: 87
      };

      setMovements(mockMovements);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovement = async () => {
    try {
      // Simulate API call
      console.log('Creating movement:', formData);
      setIsAddDialogOpen(false);
      resetForm();
      await loadInventoryData();
    } catch (error) {
      console.error('Failed to create movement:', error);
    }
  };

  const handleDeleteMovement = (movement: StockMovement) => {
    setMovementToDelete(movement);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteMovement = async () => {
    if (!movementToDelete) return;
    
    setIsDeleting(true);
    try {
      // Simulate API call
      console.log('Deleting movement:', movementToDelete.id);
      await loadInventoryData();
      setIsDeleteDialogOpen(false);
      setMovementToDelete(null);
    } catch (error) {
      console.error('Failed to delete movement:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewMovement = (movement: StockMovement) => {
    setSelectedMovement(movement);
    setIsViewDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      movementType: 'in',
      quantity: 0,
      reason: '',
      referenceType: 'adjustment',
      referenceId: '',
      notes: '',
      location: ''
    });
  };

  const getMovementTypeConfig = (type: string) => {
    return MOVEMENT_TYPES.find(t => t.value === type) || MOVEMENT_TYPES[0];
  };

  const getReferenceTypeLabel = (type: string) => {
    return REFERENCE_TYPES.find(t => t.value === type)?.label || type;
  };

  const formatStockChange = (movementType: string, quantity: number) => {
    if (movementType === 'in') {
      return `+${quantity}`;
    } else if (movementType === 'out') {
      return `-${quantity}`;
    } else {
      return quantity > 0 ? `+${quantity}` : `${quantity}`;
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in':
        return ArrowUpCircle;
      case 'out':
        return ArrowDownCircle;
      case 'adjustment':
        return Edit;
      default:
        return Package;
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-2">Track stock movements and inventory levels</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Movement
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            change="+23"
            changeType="increase"
            description="this month"
            icon={Package2}
          />
          <StatCard
            title="Stock Value"
            value={stats.totalStockValue}
            format={(val: number) => `€${val.toLocaleString()}`}
            change="+€15,420"
            changeType="increase"
            description="this month"
            icon={TrendingUp}
          />
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockItems}
            change="+3"
            changeType="increase"
            description="vs last week"
            icon={AlertTriangle}
          />
          <StatCard
            title="Out of Stock"
            value={stats.outOfStockItems}
            change="-2"
            changeType="decrease"
            description="vs last week"
            icon={Package}
          />
          <StatCard
            title="Total Movements"
            value={stats.totalMovements}
            change="+145"
            changeType="increase"
            description="this month"
            icon={Activity}
          />
          <StatCard
            title="Incoming Stock"
            value={stats.incomingStock}
            icon={ArrowUpCircle}
          />
          <StatCard
            title="Outgoing Stock"
            value={stats.outgoingStock}
            icon={ArrowDownCircle}
          />
          <StatCard
            title="Avg Stock Level"
            value={stats.averageStockLevel}
            format={(val: number) => `${val}%`}
            icon={BarChart3}
          />
        </div>
      )}

      {/* Inventory Movements Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <CardTitle className="flex items-center">
              <Warehouse className="w-5 h-5 mr-2" />
              Stock Movements
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

              {/* Movement Type Filter */}
              <Select 
                value={filters.movementType} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, movementType: value }))}
              >
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Movements</SelectItem>
                  {MOVEMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Reference Type Filter */}
              <Select 
                value={filters.referenceType} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, referenceType: value }))}
              >
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All References</SelectItem>
                  {REFERENCE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Range Filter */}
              <Select 
                value={filters.dateRange} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
              >
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>

              {/* Refresh */}
              <Button variant="outline" size="sm" onClick={loadInventoryData} disabled={loading}>
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
                  <TableHead>Product</TableHead>
                  <TableHead>Movement</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((movement) => {
                  const MovementIcon = getMovementIcon(movement.movementType);
                  const typeConfig = getMovementTypeConfig(movement.movementType);
                  
                  return (
                    <TableRow key={movement.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Package className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{movement.productName}</p>
                            <p className="text-sm text-gray-500">{movement.productSku}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MovementIcon className={`w-4 h-4 ${
                            movement.movementType === 'in' ? 'text-green-600' :
                            movement.movementType === 'out' ? 'text-red-600' : 'text-blue-600'
                          }`} />
                          <Badge className={`${typeConfig.color} border-0`}>
                            {typeConfig.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className={`font-medium ${
                            movement.movementType === 'in' ? 'text-green-600' :
                            movement.movementType === 'out' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {formatStockChange(movement.movementType, movement.quantity)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{movement.newStock}</span>
                          <span className="text-sm text-gray-500">
                            (was {movement.previousStock})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{getReferenceTypeLabel(movement.referenceType || '')}</span>
                          {movement.referenceId && (
                            <span className="text-sm text-gray-500">{movement.referenceId}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{movement.createdBy}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(movement.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(movement.createdAt).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewMovement(movement)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteMovement(movement)}
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
          </div>

          {movements.length === 0 && !loading && (
            <div className="text-center py-12">
              <Warehouse className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No movements found</h3>
              <p className="text-gray-600">Try adjusting your filters or add some stock movements to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Movement Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Stock Movement</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Product *</Label>
                <Select value={formData.productId} onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prod-1">Michelin Pilot Sport 4 225/45R17</SelectItem>
                    <SelectItem value="prod-2">Continental ContiSportContact 205/55R16</SelectItem>
                    <SelectItem value="prod-3">Bridgestone Turanza T005 195/65R15</SelectItem>
                    <SelectItem value="prod-4">Pirelli P Zero 245/40R18</SelectItem>
                    <SelectItem value="prod-5">Goodyear Eagle F1 Asymmetric 5 225/50R17</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="movementType">Movement Type *</Label>
                <Select 
                  value={formData.movementType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, movementType: value as 'in' | 'out' | 'adjustment' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MOVEMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                    <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                    <SelectItem value="warehouse-c">Warehouse C</SelectItem>
                    <SelectItem value="showroom">Showroom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Enter reason for stock movement"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referenceType">Reference Type</Label>
                <Select value={formData.referenceType} onValueChange={(value) => setFormData(prev => ({ ...prev, referenceType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REFERENCE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="referenceId">Reference ID</Label>
                <Input
                  id="referenceId"
                  value={formData.referenceId}
                  onChange={(e) => setFormData(prev => ({ ...prev, referenceId: e.target.value }))}
                  placeholder="e.g., PO-2024-0156"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateMovement}>
                Create Movement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Movement Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Movement Details</DialogTitle>
          </DialogHeader>
          {selectedMovement && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-blue-100 rounded-lg">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedMovement.productName}</h3>
                  <p className="text-gray-600">{selectedMovement.productSku}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getMovementTypeConfig(selectedMovement.movementType).color}>
                      {getMovementTypeConfig(selectedMovement.movementType).label}
                    </Badge>
                    {selectedMovement.location && (
                      <Badge variant="outline">{selectedMovement.location}</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Movement Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity Change:</span>
                      <span className={`font-medium ${
                        selectedMovement.movementType === 'in' ? 'text-green-600' :
                        selectedMovement.movementType === 'out' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {formatStockChange(selectedMovement.movementType, selectedMovement.quantity)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Previous Stock:</span>
                      <span className="font-medium">{selectedMovement.previousStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">New Stock:</span>
                      <span className="font-medium">{selectedMovement.newStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reason:</span>
                      <span className="font-medium">{selectedMovement.reason}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Reference & Audit</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference Type:</span>
                      <span className="font-medium">{getReferenceTypeLabel(selectedMovement.referenceType || '')}</span>
                    </div>
                    {selectedMovement.referenceId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reference ID:</span>
                        <span className="font-medium">{selectedMovement.referenceId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created By:</span>
                      <span className="font-medium">{selectedMovement.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{new Date(selectedMovement.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedMovement.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedMovement.notes}</p>
                </div>
              )}
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
              Delete Movement
            </DialogTitle>
          </DialogHeader>
          {movementToDelete && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Are you sure you want to delete this stock movement for <strong>{movementToDelete.productName}</strong>? 
                  This action cannot be undone and may affect inventory calculations.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteMovement} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Movement
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
}
