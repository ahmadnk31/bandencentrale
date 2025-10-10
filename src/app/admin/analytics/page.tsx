"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  ShoppingCart,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Globe,
  Smartphone
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("30d");

  const revenueData = [
    { month: 'Jan', revenue: 15000, orders: 145, customers: 89 },
    { month: 'Feb', revenue: 18000, orders: 167, customers: 102 },
    { month: 'Mar', revenue: 22000, orders: 189, customers: 118 },
    { month: 'Apr', revenue: 25000, orders: 234, customers: 145 },
    { month: 'May', revenue: 28000, orders: 267, customers: 167 },
    { month: 'Jun', revenue: 32000, orders: 298, customers: 189 },
    { month: 'Jul', revenue: 35000, orders: 324, customers: 201 },
    { month: 'Aug', revenue: 38000, orders: 356, customers: 223 },
    { month: 'Sep', revenue: 42000, orders: 389, customers: 245 },
    { month: 'Oct', revenue: 45000, orders: 412, customers: 267 }
  ];

  const categoryData = [
    { name: 'Summer Tires', value: 45, color: '#FF6B35', amount: 18500 },
    { name: 'Winter Tires', value: 30, color: '#4285F4', amount: 12300 },
    { name: 'All-Season', value: 20, color: '#34A853', amount: 8200 },
    { name: 'Services', value: 5, color: '#9C27B0', amount: 2050 }
  ];

  const topProducts = [
    { name: "Michelin Pilot Sport 4S", sales: 234, revenue: 67766, growth: 15.2 },
    { name: "Continental WinterContact", sales: 189, revenue: 37611, growth: 8.7 },
    { name: "Bridgestone Turanza T005", sales: 156, revenue: 24954, growth: -2.1 },
    { name: "Pirelli P Zero", sales: 134, revenue: 46886, growth: 12.5 },
    { name: "Goodyear Eagle F1", sales: 98, revenue: 23520, growth: 5.3 }
  ];

  const customerData = [
    { segment: 'New Customers', value: 35, color: '#4285F4' },
    { segment: 'Returning', value: 45, color: '#34A853' },
    { segment: 'VIP', value: 20, color: '#9C27B0' }
  ];

  const trafficData = [
    { source: 'Direct', sessions: 2543, percentage: 35.2, color: '#FF6B35' },
    { source: 'Google Search', sessions: 1876, percentage: 26.0, color: '#4285F4' },
    { source: 'Social Media', sessions: 1234, percentage: 17.1, color: '#34A853' },
    { source: 'Email', sessions: 876, percentage: 12.1, color: '#9C27B0' },
    { source: 'Referrals', sessions: 693, percentage: 9.6, color: '#FF9800' }
  ];

  const deviceData = [
    { device: 'Desktop', sessions: 3456, percentage: 47.9 },
    { device: 'Mobile', sessions: 2789, percentage: 38.6 },
    { device: 'Tablet', sessions: 977, percentage: 13.5 }
  ];

  const kpiData = [
    {
      title: "Total Revenue",
      value: "€45,231",
      change: "+20.1%",
      changeType: "increase",
      icon: DollarSign,
      description: "vs last month"
    },
    {
      title: "Orders",
      value: "1,234",
      change: "+12.5%",
      changeType: "increase",
      icon: ShoppingCart,
      description: "vs last month"
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      change: "+0.5%",
      changeType: "increase",
      icon: Target,
      description: "vs last month"
    },
    {
      title: "Avg Order Value",
      value: "€156.80",
      change: "+8.2%",
      changeType: "increase",
      icon: TrendingUp,
      description: "vs last month"
    },
    {
      title: "Customer Retention",
      value: "68.5%",
      change: "-2.1%",
      changeType: "decrease",
      icon: Users,
      description: "vs last month"
    },
    {
      title: "Page Views",
      value: "24,567",
      change: "+15.3%",
      changeType: "increase",
      icon: Globe,
      description: "vs last month"
    }
  ];

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Business insights and performance metrics</p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <kpi.icon className={`w-8 h-8 ${
                      kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`} />
                    <div className={`flex items-center text-sm ${
                      kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.changeType === 'increase' ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {kpi.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {kpi.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {kpi.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {kpi.description}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`€${value}`, 'Revenue']} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#FF6B35" 
                        fill="#FF6B35"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                    </RechartsPieChart>
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
                        <div className="text-right">
                          <div className="font-medium">{category.value}%</div>
                          <div className="text-gray-500">€{category.amount.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                        <p className="font-semibold text-gray-900">€{product.revenue.toLocaleString()}</p>
                        <div className={`flex items-center text-sm ${
                          product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {product.growth >= 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {Math.abs(product.growth)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            {/* Sales Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#FF6B35" />
                    <Bar dataKey="orders" fill="#4285F4" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Customer Growth */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="customers" 
                        stroke="#34A853" 
                        strokeWidth={3}
                        dot={{ fill: '#34A853', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Customer Segments */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Segments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={customerData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                      >
                        {customerData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {customerData.map((segment) => (
                      <div key={segment.segment} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: segment.color }}
                          />
                          <span>{segment.segment}</span>
                        </div>
                        <span className="font-medium">{segment.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficData.map((source) => (
                      <div key={source.source} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: source.color }}
                          />
                          <span className="font-medium">{source.source}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{source.sessions.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{source.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deviceData.map((device) => (
                      <div key={device.device} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            {device.device === 'Desktop' && <Globe className="w-4 h-4" />}
                            {device.device === 'Mobile' && <Smartphone className="w-4 h-4" />}
                            {device.device === 'Tablet' && <Smartphone className="w-4 h-4" />}
                          </div>
                          <span className="font-medium">{device.device}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{device.sessions.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{device.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default AnalyticsPage;
