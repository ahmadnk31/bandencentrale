"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import { 
  User, 
  Settings, 
  ShoppingBag, 
  Heart,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit,
  Download,
  Eye,
  Star,
  Package,
  CreditCard,
  Bell,
  Shield,
  Clock,
  CheckCircle,
  Truck
} from "lucide-react";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  
  const userInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+32 467 123 4567",
    address: "Brusselsesteenweg 123, 9090 Ghent, Belgium",
    memberSince: "March 2022",
    totalOrders: 8,
    totalSpent: "€1,245.67",
    loyaltyPoints: 245
  };

  const recentOrders = [
    {
      id: "ORD-2024-001",
      date: "2024-10-01",
      status: "Delivered",
      total: "€289.99",
      items: [
        { name: "Michelin Pilot Sport 4", size: "225/45R17", quantity: 4 }
      ],
      statusColor: "bg-green-500"
    },
    {
      id: "ORD-2024-002",
      date: "2024-09-15",
      status: "In Transit",
      total: "€156.50",
      items: [
        { name: "Wheel Alignment Service", quantity: 1 },
        { name: "Tire Rotation", quantity: 1 }
      ],
      statusColor: "bg-blue-500"
    },
    {
      id: "ORD-2024-003",
      date: "2024-08-28",
      status: "Delivered",
      total: "€445.80",
      items: [
        { name: "Continental WinterContact TS 860", size: "205/55R16", quantity: 4 }
      ],
      statusColor: "bg-green-500"
    }
  ];

  const favoriteProducts = [
    {
      id: 1,
      name: "Michelin Pilot Sport 4",
      brand: "Michelin",
      size: "225/45R17",
      price: "€159.99",
      image: "/api/placeholder/100/100",
      inStock: true
    },
    {
      id: 2,
      name: "Continental PremiumContact 6",
      brand: "Continental", 
      size: "205/55R16",
      price: "€129.99",
      image: "/api/placeholder/100/100",
      inStock: true
    },
    {
      id: 3,
      name: "Bridgestone Turanza T005",
      brand: "Bridgestone",
      size: "215/60R17",
      price: "€139.99",
      image: "/api/placeholder/100/100",
      inStock: false
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      service: "Tire Installation",
      date: "2024-10-15",
      time: "10:30 AM",
      status: "Confirmed"
    },
    {
      id: 2,
      service: "Wheel Alignment",
      date: "2024-11-02",
      time: "2:00 PM", 
      status: "Pending"
    }
  ];

  const loyaltyBenefits = [
    { points: 100, benefit: "5% Discount on Next Purchase" },
    { points: 250, benefit: "Free Tire Rotation Service" },
    { points: 500, benefit: "Free Wheel Alignment" },
    { points: 1000, benefit: "Premium Roadside Assistance" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tire-dark to-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center space-x-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                Welcome back, {userInfo.name.split(' ')[0]}!
              </h1>
              <p className="text-gray-300">
                Member since {userInfo.memberSince} • {userInfo.loyaltyPoints} Loyalty Points
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Account Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-tire-dark">{userInfo.totalOrders}</div>
              <div className="text-tire-gray text-sm">Total Orders</div>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-tire-dark">{userInfo.totalSpent}</div>
              <div className="text-tire-gray text-sm">Total Spent</div>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-tire-dark">{userInfo.loyaltyPoints}</div>
              <div className="text-tire-gray text-sm">Loyalty Points</div>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-tire-dark">{favoriteProducts.length}</div>
              <div className="text-tire-gray text-sm">Favorites</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 overflow-scroll">
            <TabsList className="flex w-full shrink-0 overflow-scroll gap-2 justify-start lg:justify-center">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-tire-dark mb-2">
                          Full Name
                        </label>
                        <Input value={userInfo.name} readOnly />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-tire-dark mb-2">
                          Phone
                        </label>
                        <Input value={userInfo.phone} readOnly />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tire-dark mb-2">
                        Email
                      </label>
                      <Input value={userInfo.email} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tire-dark mb-2">
                        Address
                      </label>
                      <Input value={userInfo.address} readOnly />
                    </div>
                    <Button className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Bell className="w-5 h-5 mr-3 text-tire-orange" />
                        <span>Email Notifications</span>
                      </div>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 mr-3 text-tire-orange" />
                        <span>Two-Factor Authentication</span>
                      </div>
                      <Badge variant="outline">Disabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 mr-3 text-tire-orange" />
                        <span>Marketing Emails</span>
                      </div>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      Manage Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="p-6 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-tire-dark">{order.id}</h3>
                            <p className="text-sm text-tire-gray">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={`${order.statusColor} text-white`}>
                              {order.status}
                            </Badge>
                            <p className="text-lg font-bold text-tire-dark mt-1">
                              {order.total}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>
                                {item.name}
                                {"size" in item && item.size ? ` (${item.size})` : ""}
                              </span>
                              <span>Qty: {item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex space-x-3 mt-4">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download Invoice
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Upcoming Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-tire-dark">
                              {appointment.service}
                            </h3>
                            <Badge variant={appointment.status === "Confirmed" ? "default" : "secondary"}>
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-tire-gray">
                            <Calendar className="w-4 h-4 mr-2" />
                            {appointment.date} at {appointment.time}
                          </div>
                        </div>
                      ))}
                      <Button className="w-full mt-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book New Appointment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Service History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">Tire Installation</span>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-sm text-tire-gray">Oct 1, 2024 • 4 Michelin Pilot Sport 4 tires</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">Wheel Alignment</span>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-sm text-tire-gray">Sep 15, 2024 • Front & rear alignment</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">Tire Rotation</span>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-sm text-tire-gray">Aug 28, 2024 • Regular maintenance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Favorite Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteProducts.map((product) => (
                      <div key={product.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4 mb-4">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-tire-dark text-sm">
                              {product.name}
                            </h3>
                            <p className="text-xs text-tire-gray">{product.brand}</p>
                            <p className="text-xs text-tire-gray">{product.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-tire-dark">{product.price}</span>
                          <Badge variant={product.inStock ? "default" : "secondary"}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                        <Button size="sm" className="w-full mt-3" disabled={!product.inStock}>
                          Add to Cart
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Loyalty Tab */}
            <TabsContent value="loyalty">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      Loyalty Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-tire-orange mb-2">
                        {userInfo.loyaltyPoints}
                      </div>
                      <p className="text-tire-gray">Available Points</p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-tire-dark">Recent Activity</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Tire Purchase - Oct 1</span>
                          <span className="text-green-600">+58 points</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Service Booking - Sep 15</span>
                          <span className="text-green-600">+15 points</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Review Written - Sep 10</span>
                          <span className="text-green-600">+10 points</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      Rewards Available
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loyaltyBenefits.map((benefit, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg border-2 ${
                            userInfo.loyaltyPoints >= benefit.points 
                              ? "border-tire-orange bg-orange-50" 
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-tire-dark">
                                {benefit.benefit}
                              </p>
                              <p className="text-sm text-tire-gray">
                                {benefit.points} points required
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              disabled={userInfo.loyaltyPoints < benefit.points}
                              className={userInfo.loyaltyPoints >= benefit.points ? "" : "opacity-50"}
                            >
                              {userInfo.loyaltyPoints >= benefit.points ? "Redeem" : "Locked"}
                            </Button>
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
      </section>
    </div>
  );
};

export default AccountPage;
