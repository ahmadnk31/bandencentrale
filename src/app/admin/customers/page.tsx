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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { 
  Search, 
  Filter, 
  Eye,
  Edit,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Download,
  MoreVertical
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  joinDate: string;
  lastOrder: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'vip';
  avatar?: string;
  preferences: {
    newsletter: boolean;
    sms: boolean;
    preferredBrands: string[];
  };
  orderHistory: {
    id: string;
    date: string;
    total: number;
    status: string;
  }[];
}

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const customers: Customer[] = [
    {
      id: "CUST-001",
      name: "John Doe",
      email: "john@example.com",
      phone: "+32 467 123 456",
      address: "123 Main St",
      city: "Ghent",
      postalCode: "9000",
      country: "Belgium",
      joinDate: "2023-06-15",
      lastOrder: "2024-10-04",
      totalOrders: 8,
      totalSpent: 2340.50,
      status: 'vip',
      avatar: "/api/placeholder/40/40",
      preferences: {
        newsletter: true,
        sms: false,
        preferredBrands: ["Michelin", "Continental"]
      },
      orderHistory: [
        { id: "ORD-001", date: "2024-10-04", total: 1159.96, status: "processing" },
        { id: "ORD-015", date: "2024-09-12", total: 450.00, status: "delivered" },
        { id: "ORD-032", date: "2024-08-05", total: 730.54, status: "delivered" }
      ]
    },
    {
      id: "CUST-002",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+32 467 987 654",
      address: "456 Oak Ave",
      city: "Brussels",
      postalCode: "1000",
      country: "Belgium",
      joinDate: "2024-01-10",
      lastOrder: "2024-10-03",
      totalOrders: 3,
      totalSpent: 890.45,
      status: 'active',
      preferences: {
        newsletter: true,
        sms: true,
        preferredBrands: ["Bridgestone", "Pirelli"]
      },
      orderHistory: [
        { id: "ORD-002", date: "2024-10-03", total: 488.98, status: "shipped" },
        { id: "ORD-023", date: "2024-07-18", total: 280.00, status: "delivered" },
        { id: "ORD-041", date: "2024-05-22", total: 121.47, status: "delivered" }
      ]
    },
    {
      id: "CUST-003",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+32 467 555 123",
      address: "789 Pine St",
      city: "Antwerp",
      postalCode: "2000",
      country: "Belgium",
      joinDate: "2024-02-28",
      lastOrder: "2024-10-04",
      totalOrders: 2,
      totalSpent: 799.95,
      status: 'active',
      preferences: {
        newsletter: false,
        sms: false,
        preferredBrands: ["Goodyear"]
      },
      orderHistory: [
        { id: "ORD-003", date: "2024-10-04", total: 639.96, status: "pending" },
        { id: "ORD-028", date: "2024-06-10", total: 159.99, status: "delivered" }
      ]
    },
    {
      id: "CUST-004",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+32 467 777 888",
      address: "321 Elm St",
      city: "Bruges",
      postalCode: "8000",
      country: "Belgium",
      joinDate: "2023-11-20",
      lastOrder: "2024-10-01",
      totalOrders: 5,
      totalSpent: 1890.80,
      status: 'vip',
      preferences: {
        newsletter: true,
        sms: true,
        preferredBrands: ["Pirelli", "Michelin"]
      },
      orderHistory: [
        { id: "ORD-004", date: "2024-10-01", total: 1595.96, status: "delivered" },
        { id: "ORD-019", date: "2024-08-30", total: 294.84, status: "delivered" }
      ]
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      vip: "bg-purple-100 text-purple-800 border-purple-200"
    };
    
    const icons = {
      active: Users,
      inactive: Users,
      vip: Star
    };

    const Icon = icons[status as keyof typeof icons];
    
    return (
      <Badge className={`${colors[status as keyof typeof colors]} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.toUpperCase()}
      </Badge>
    );
  };

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    vip: customers.filter(c => c.status === 'vip').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    totalRevenue: customers.reduce((sum, customer) => sum + customer.totalSpent, 0),
    avgOrderValue: customers.reduce((sum, customer) => sum + customer.totalSpent, 0) / customers.reduce((sum, customer) => sum + customer.totalOrders, 0)
  };

  return (
    
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-gray-600 mt-2">Manage customer accounts and relationships</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setIsAddOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">VIP</p>
                  <p className="text-2xl font-bold">{stats.vip}</p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold">{stats.inactive}</p>
                </div>
                <Users className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">€{stats.totalRevenue.toFixed(0)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order</p>
                  <p className="text-2xl font-bold">€{stats.avgOrderValue.toFixed(0)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
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
                    placeholder="Search by name, email, or phone..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={customer.avatar} />
                            <AvatarFallback>
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{customer.email}</div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {customer.city}, {customer.country}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{customer.totalOrders}</TableCell>
                      <TableCell className="font-medium">€{customer.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                      <TableCell>{customer.lastOrder}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Customer Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Customer Details - {selectedCustomer?.name}</DialogTitle>
            </DialogHeader>
            
            {selectedCustomer && (
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">Order History</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={selectedCustomer.avatar} />
                            <AvatarFallback className="text-lg">
                              {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-lg">{selectedCustomer.name}</div>
                            <div className="text-sm text-gray-500">{selectedCustomer.id}</div>
                            {getStatusBadge(selectedCustomer.status)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {selectedCustomer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {selectedCustomer.phone}
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            {selectedCustomer.address}<br />
                            {selectedCustomer.city}, {selectedCustomer.postalCode}<br />
                            {selectedCustomer.country}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          Member since {selectedCustomer.joinDate}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Customer Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Orders:</span>
                          <span className="font-medium">{selectedCustomer.totalOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Spent:</span>
                          <span className="font-medium">€{selectedCustomer.totalSpent.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Order:</span>
                          <span className="font-medium">€{(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Order:</span>
                          <span className="font-medium">{selectedCustomer.lastOrder}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          {getStatusBadge(selectedCustomer.status)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedCustomer.orderHistory.map((order) => (
                          <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">{order.id}</div>
                              <div className="text-sm text-gray-600">{order.date}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">€{order.total.toFixed(2)}</div>
                              <Badge variant="outline" className="text-xs">
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Communication Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Newsletter:</span>
                        <Badge variant={selectedCustomer.preferences.newsletter ? "default" : "secondary"}>
                          {selectedCustomer.preferences.newsletter ? "Subscribed" : "Not Subscribed"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>SMS Notifications:</span>
                        <Badge variant={selectedCustomer.preferences.sms ? "default" : "secondary"}>
                          {selectedCustomer.preferences.sms ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Preferred Brands:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedCustomer.preferences.preferredBrands.map((brand) => (
                            <Badge key={brand} variant="outline">{brand}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    
  );
};

export default CustomersPage;
