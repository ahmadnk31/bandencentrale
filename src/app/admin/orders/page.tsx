"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { 
  Search, 
  Filter, 
  Eye,
  Edit,
  Truck,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreVertical,
  Download,
  Printer,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  date: string;
  shippingDate?: string;
  trackingNumber?: string;
}

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const orders: Order[] = [
    {
      id: "ORD-001",
      customer: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+32 467 123 456",
        address: "123 Main St, Ghent, Belgium"
      },
      items: [
        { name: "Michelin Pilot Sport 4S", quantity: 4, price: 289.99 },
        { name: "Installation Service", quantity: 1, price: 0 }
      ],
      total: 1159.96,
      status: 'processing',
      paymentStatus: 'paid',
      date: "2024-10-04",
      trackingNumber: "TRK123456789"
    },
    {
      id: "ORD-002",
      customer: {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+32 467 987 654",
        address: "456 Oak Ave, Brussels, Belgium"
      },
      items: [
        { name: "Continental WinterContact", quantity: 2, price: 199.99 },
        { name: "Wheel Alignment", quantity: 1, price: 89.00 }
      ],
      total: 488.98,
      status: 'shipped',
      paymentStatus: 'paid',
      date: "2024-10-03",
      shippingDate: "2024-10-04",
      trackingNumber: "TRK987654321"
    },
    {
      id: "ORD-003",
      customer: {
        name: "Mike Johnson",
        email: "mike@example.com",
        phone: "+32 467 555 123",
        address: "789 Pine St, Antwerp, Belgium"
      },
      items: [
        { name: "Bridgestone Turanza T005", quantity: 4, price: 159.99 }
      ],
      total: 639.96,
      status: 'pending',
      paymentStatus: 'pending',
      date: "2024-10-04"
    },
    {
      id: "ORD-004",
      customer: {
        name: "Sarah Wilson",
        email: "sarah@example.com",
        phone: "+32 467 777 888",
        address: "321 Elm St, Bruges, Belgium"
      },
      items: [
        { name: "Pirelli P Zero", quantity: 4, price: 349.99 },
        { name: "Road Hazard Protection", quantity: 4, price: 49.00 }
      ],
      total: 1595.96,
      status: 'delivered',
      paymentStatus: 'paid',
      date: "2024-10-01",
      shippingDate: "2024-10-02"
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200"
    };
    
    const icons = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle
    };

    const Icon = icons[status as keyof typeof icons];
    
    return (
      <Badge className={`${colors[status as keyof typeof colors]} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    // In a real app, this would make an API call
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
  };

  return (
    
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-600 mt-2">Manage customer orders and track fulfillment</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Processing</p>
                  <p className="text-2xl font-bold">{stats.processing}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Shipped</p>
                  <p className="text-2xl font-bold">{stats.shipped}</p>
                </div>
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold">{stats.delivered}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold">€{stats.totalRevenue.toFixed(0)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by order ID, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer.name}</div>
                          <div className="text-sm text-gray-500">{order.customer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell className="font-medium">€{order.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Select 
                            value={order.status} 
                            onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{selectedOrder.customer.name}</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {selectedOrder.customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {selectedOrder.customer.phone}
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        {selectedOrder.customer.address}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                      <div className="flex justify-between">
                        <span>Payment:</span>
                        {getPaymentBadge(selectedOrder.paymentStatus)}
                      </div>
                      <div className="flex justify-between">
                        <span>Order Date:</span>
                        <span>{selectedOrder.date}</span>
                      </div>
                      {selectedOrder.shippingDate && (
                        <div className="flex justify-between">
                          <span>Shipping Date:</span>
                          <span>{selectedOrder.shippingDate}</span>
                        </div>
                      )}
                      {selectedOrder.trackingNumber && (
                        <div className="flex justify-between">
                          <span>Tracking:</span>
                          <span className="font-mono">{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">€{(item.price * item.quantity).toFixed(2)}</div>
                            <div className="text-sm text-gray-600">€{item.price.toFixed(2)} each</div>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-3 flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>€{selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
   
  );
};

export default OrdersPage;
