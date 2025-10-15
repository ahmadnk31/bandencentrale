"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  ShoppingCart,
  Eye,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Tags,
  Building2,
  Plus
} from "lucide-react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "€45,231",
      change: "+20.1%",
      changeType: "increase",
      icon: DollarSign,
      description: "from last month"
    },
    {
      title: "Orders",
      value: "1,234",
      change: "+12.5%",
      changeType: "increase",
      icon: ShoppingCart,
      description: "from last month"
    },
    {
      title: "Products",
      value: "856",
      change: "+3.2%",
      changeType: "increase",
      icon: Package,
      description: "active products"
    },
    {
      title: "Customers",
      value: "2,847",
      change: "-2.1%",
      changeType: "decrease",
      icon: Users,
      description: "from last month"
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 15000, orders: 145 },
    { month: 'Feb', revenue: 18000, orders: 167 },
    { month: 'Mar', revenue: 22000, orders: 189 },
    { month: 'Apr', revenue: 25000, orders: 234 },
    { month: 'May', revenue: 28000, orders: 267 },
    { month: 'Jun', revenue: 32000, orders: 298 },
  ];

  const topProducts = [
    { name: "Michelin Pilot Sport 4S", sales: 234, revenue: "€67,766", trend: "up" },
    { name: "Continental WinterContact", sales: 189, revenue: "€37,611", trend: "up" },
    { name: "Bridgestone Turanza T005", sales: 156, revenue: "€24,954", trend: "down" },
    { name: "Pirelli P Zero", sales: 134, revenue: "€46,886", trend: "up" },
    { name: "Goodyear Eagle F1", sales: 98, revenue: "€23,520", trend: "down" },
  ];

  const categoryData = [
    { name: 'Summer Tires', value: 45, color: '#FF6B35' },
    { name: 'Winter Tires', value: 30, color: '#4285F4' },
    { name: 'All-Season', value: 20, color: '#34A853' },
    { name: 'Performance', value: 5, color: '#9C27B0' },
  ];

  const recentOrders = [
    { id: "#ORD-001", customer: "John Doe", product: "Michelin Pilot Sport 4S", amount: "€289.99", status: "completed" },
    { id: "#ORD-002", customer: "Jane Smith", product: "Continental WinterContact", amount: "€199.99", status: "processing" },
    { id: "#ORD-003", customer: "Mike Johnson", product: "Bridgestone Turanza", amount: "€159.99", status: "shipped" },
    { id: "#ORD-004", customer: "Sarah Wilson", product: "Pirelli P Zero", amount: "€349.99", status: "pending" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your tire shop.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <Link href="/">
              <Eye className="w-4 h-4 mr-2" />
              View Store
            </Link>
          </Button>
          <Button className="bg-tire-gradient" asChild>
            <Link href="/admin/products">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    stat.changeType === 'increase' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {stat.changeType === 'increase' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-sm text-gray-600">Manage your store inventory and organization</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                <Link href="/admin/hero-banners">
                  <Eye className="w-8 h-8 text-orange-600" />
                  <div className="text-center">
                    <div className="font-medium">Hero Banners</div>
                    <div className="text-xs text-gray-500">Manage homepage banners</div>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                <Link href="/admin/products">
                  <Package className="w-8 h-8 text-blue-600" />
                  <div className="text-center">
                    <div className="font-medium">Manage Products</div>
                    <div className="text-xs text-gray-500">Add, edit, or remove products</div>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                <Link href="/admin/categories">
                  <Tags className="w-8 h-8 text-green-600" />
                  <div className="text-center">
                    <div className="font-medium">Manage Categories</div>
                    <div className="text-xs text-gray-500">Organize product categories</div>
                  </div>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                <Link href="/admin/brands">
                  <Building2 className="w-8 h-8 text-purple-600" />
                  <div className="text-center">
                    <div className="font-medium">Manage Brands</div>
                    <div className="text-xs text-gray-500">Add and manage tire brands</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`€${value}`, 'Revenue']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#FF6B35" 
                    strokeWidth={3}
                    dot={{ fill: '#FF6B35', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((category) => (
                  <div key={category.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span className="font-medium">{category.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Selling Products</CardTitle>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-tire-gradient rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{product.revenue}</p>
                      <div className="flex items-center justify-end">
                        {product.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.customer}</p>
                      <p className="text-xs text-gray-400">{order.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{order.amount}</p>
                      <Badge className={`${getStatusColor(order.status)} border-0 text-xs`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
