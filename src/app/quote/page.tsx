"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/header";
import { useSearchParams } from "next/navigation";
import { useProduct } from "@/hooks/use-store-data";
import { 
  Calculator,
  Car,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  Wrench,
  Shield,
  Truck
} from "lucide-react";

const QuotePageContent = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const selectedSize = searchParams.get('size');
  const quantity = searchParams.get('quantity');
  const service = searchParams.get('service');
  console.log('Quote page loaded');
  console.log('Product ID from URL:', productId);
  console.log('Selected Size from URL:', selectedSize);
  console.log('Quantity from URL:', quantity);
  console.log('Service from URL:', service);

  // Fetch product data from API if productId is provided
  const { data: productResponse, isLoading: productLoading, error: productError } = useProduct(productId || '');
  const product = productResponse?.data;
  console.log('Product found:', product);

  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    
    // Vehicle Information
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    
    // Tire Information
    currentTireSize: selectedSize || "",
    tireType: product ? (product.season === "All-Season" ? "All-Season Tires" : 
                        product.season === "Summer" ? "Summer Tires" : 
                        product.season === "Winter" ? "Winter Tires" : "") : "",
    quantity: quantity || "4",
    
    // Service Preferences - conditionally set based on URL service parameter
    services: {
      installation: service ? service === "tire-installation" : true,
      wheelAlignment: service ? service === "wheel-alignment" : false,
      balancing: service ? service === "wheel-balancing" : false,
      disposal: service ? service === "tire-disposal" : true,
      roadHazard: service ? service === "road-hazard-protection" : false
    },
    
    // Additional Information
    notes: product ? `Interested in ${product.brand?.name || 'Unknown Brand'} ${product.name}` : 
           service ? `Interested in ${service.replace(/-/g, ' ')} service` : "",
    preferredContactTime: "",
    urgency: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const vehicleMakes = [
    "Audi", "BMW", "Mercedes-Benz", "Volkswagen", "Toyota", "Honda", "Ford", 
    "Peugeot", "Renault", "Citroën", "Opel", "Nissan", "Hyundai", "Kia", "Other"
  ];

  const tireTypes = [
    "Summer Tires",
    "Winter Tires", 
    "All-Season Tires",
    "Performance Tires",
    "Run-Flat Tires",
    "Eco-Friendly Tires",
    "Not Sure - Need Recommendation"
  ];

  const tireSizes = [
    "185/60R14", "185/65R14", "195/60R14", "195/65R14",
    "185/60R15", "195/60R15", "195/65R15", "205/60R15", "205/65R15",
    "195/55R16", "205/55R16", "215/60R16", "225/60R16",
    "205/50R17", "215/50R17", "225/45R17", "225/50R17", "235/45R17",
    "225/40R18", "235/40R18", "245/40R18", "255/35R18",
    "235/35R19", "245/35R19", "255/35R19", "275/35R19",
    "Not Sure - Need Help"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 25}, (_, i) => currentYear - i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare quote data according to API structure
      const quoteData: {
        customerName: string;
        customerEmail: string;
        customerPhone?: string;
        vehicleYear?: string;
        vehicleMake?: string;
        vehicleModel?: string;
        items: Array<{
          productId?: string;
          serviceId?: string;
          name: string;
          description?: string;
          quantity: number;
          unitPrice: number;
          notes?: string;
          metadata?: any;
        }>;
        notes?: string;
        requirements?: string[];
      } = {
        // Customer info
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        
        // Vehicle info
        vehicleYear: formData.vehicleYear,
        vehicleMake: formData.vehicleMake,
        vehicleModel: formData.vehicleModel,
        
        // Quote items
        items: [],
        
        // Additional info
        notes: formData.notes,
        requirements: []
      };

      // Add tire item if product is selected
      if (product) {
        quoteData.items.push({
          productId: product.id,
          name: `${product.brand?.name || 'Unknown Brand'} ${product.name}`,
          description: `${product.season} tire - Size: ${formData.currentTireSize || 'TBD'}`,
          quantity: parseInt(formData.quantity),
          unitPrice: parseFloat(product.price),
          notes: `Season: ${product.season}, Size: ${formData.currentTireSize || 'TBD'}`,
          metadata: {
            size: formData.currentTireSize,
            season: product.season,
            speedRating: product.speedRating,
            loadIndex: product.loadIndex
          }
        });
      } else {
        // Add general tire request if no specific product
        quoteData.items.push({
          name: formData.tireType || 'Tire Quote Request',
          description: `${formData.tireType} - Size: ${formData.currentTireSize || 'TBD'}`,
          quantity: parseInt(formData.quantity),
          unitPrice: 0, // Will be determined by sales team
          notes: `Size: ${formData.currentTireSize || 'TBD'}, Type: ${formData.tireType}`,
          metadata: {
            size: formData.currentTireSize,
            tireType: formData.tireType
          }
        });
      }

      // Add service requirements
      Object.entries(formData.services).forEach(([service, selected]) => {
        if (selected) {
          quoteData.requirements!.push(service);
        }
      });

      // Add additional requirements
      if (formData.preferredContactTime) {
        quoteData.requirements!.push(`Contact time: ${formData.preferredContactTime}`);
      }
      if (formData.urgency) {
        quoteData.requirements!.push(`Urgency: ${formData.urgency}`);
      }

      console.log("Submitting quote data:", quoteData);

      // Submit to API
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit quote request');
      }

      const result = await response.json();
      console.log("Quote submitted successfully:", result);
      setIsSubmitted(true);

    } catch (error) {
      console.error("Error submitting quote:", error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit quote request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: { ...prev.services, [service]: checked }
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl p-12 shadow-2xl">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Quote Request Received!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for your quote request. Our tire experts will review your information and contact you within 2 business hours with a personalized quote.
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-tire-orange" />
                  <span className="text-gray-700">We'll call you at: <strong>{formData.phone}</strong></span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-tire-orange" />
                  <span className="text-gray-700">Email confirmation sent to: <strong>{formData.email}</strong></span>
                </div>
              </div>
              <div className="mt-8 space-x-4">
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  Request Another Quote
                </Button>
                <Button onClick={() => window.location.href = '/tires'} className="bg-tire-gradient">
                  Browse Our Tires
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tire-dark to-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Calculator className="w-16 h-16 text-tire-orange mr-4" />
              <h1 className="text-4xl lg:text-5xl font-bold">
                Get Your{" "}
                <span className="text-tire-orange">Tire Quote</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Get a personalized quote for your tire needs. Our experts will provide competitive pricing and professional installation services.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>Free Quote</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>Expert Advice</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>Professional Installation</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>Quick Response</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Product Info Banner (if coming from product page) */}
          {product && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-tire-orange/10 to-orange-100 border-tire-orange/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg p-2 shadow-sm">
                      <img 
                        src={product.images && product.images.length > 0 ? product.images[0]?.src : "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop"} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-tire-dark">
                        {product.brand?.name || 'Unknown Brand'} {product.name}
                      </h3>
                      <p className="text-tire-gray">
                        {selectedSize && `Size: ${selectedSize} • `}
                        {product.season} Season • €{product.price}/tire
                      </p>
                      <div className="flex items-center mt-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm text-green-700 font-medium">
                          Form pre-filled with product details
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Service Info Banner (if coming from service page) */}
          {service && !product && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg p-3 shadow-sm">
                      <Wrench className="w-full h-full text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-tire-dark">
                        {service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Service
                      </h3>
                      <p className="text-tire-gray">
                        Professional automotive service quote request
                      </p>
                      <div className="flex items-center mt-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm text-green-700 font-medium">
                          Service pre-selected in form
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="shadow-xl py-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 pt-2">
                  <CardTitle className="flex items-center text-xl text-tire-dark">
                    <Mail className="w-6 h-6 mr-3 text-tire-orange" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-tire-dark mb-2">
                        Full Name *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tire-dark mb-2">
                        Phone Number *
                      </label>
                      <Input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+32 467 87 1205"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tire-dark mb-2">
                      Email Address *
                    </label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vehicle Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="shadow-xl py-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pt-2">
                  <CardTitle className="flex items-center text-xl text-tire-dark">
                    <Car className="w-6 h-6 mr-3 text-tire-orange" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-tire-dark mb-2">
                        Make *
                      </label>
                      <Select value={formData.vehicleMake} onValueChange={(value) => handleChange("vehicleMake", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleMakes.map(make => (
                            <SelectItem key={make} value={make}>{make}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tire-dark mb-2">
                        Model *
                      </label>
                      <Input
                        required
                        value={formData.vehicleModel}
                        onChange={(e) => handleChange("vehicleModel", e.target.value)}
                        placeholder="e.g., Golf, Corolla"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tire-dark mb-2">
                        Year *
                      </label>
                      <Select value={formData.vehicleYear} onValueChange={(value) => handleChange("vehicleYear", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tire Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="shadow-xl py-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 pt-2">
                  <CardTitle className="flex items-center text-xl text-tire-dark">
                    <Truck className="w-6 h-6 mr-3 text-tire-orange" />
                    Tire Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-tire-dark mb-2">
                        Current Tire Size
                      </label>
                      <Select value={formData.currentTireSize} onValueChange={(value) => handleChange("currentTireSize", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tire size" />
                        </SelectTrigger>
                        <SelectContent>
                          {tireSizes.map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tire-dark mb-2">
                        Tire Type *
                      </label>
                      <Select value={formData.tireType} onValueChange={(value) => handleChange("tireType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tire type" />
                        </SelectTrigger>
                        <SelectContent>
                          {tireTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tire-dark mb-2">
                      Number of Tires *
                    </label>
                    <Select value={formData.quantity}  onValueChange={(value) => handleChange("quantity", value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select quantity" />
                      </SelectTrigger>
                      <SelectContent>
                        
                          
                            <SelectItem value="1">1 Tire</SelectItem>
                            <SelectItem value="2">2 Tires</SelectItem>
                            <SelectItem value="4">4 Tires</SelectItem>
                          
                        
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Service Options */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="shadow-xl py-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 pt-2">
                  <CardTitle className="flex items-center text-xl text-tire-dark">
                    <Wrench className="w-6 h-6 mr-3 text-tire-orange" />
                    Additional Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">

                        <Checkbox
                          id="installation"
                          checked={formData.services.installation}
                          onCheckedChange={(checked) => handleServiceChange("installation", checked as boolean)}
                        />
                        <label htmlFor="installation" className="text-sm font-medium">
                          Professional Installation (Recommended)
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="balancing"
                          checked={formData.services.balancing}
                          onCheckedChange={(checked) => handleServiceChange("balancing", checked as boolean)}
                        />
                        <label htmlFor="balancing" className="text-sm font-medium">
                          Wheel Balancing
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="disposal"
                          checked={formData.services.disposal}
                          onCheckedChange={(checked) => handleServiceChange("disposal", checked as boolean)}
                        />
                        <label htmlFor="disposal" className="text-sm font-medium">
                          Old Tire Disposal
                        </label>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="alignment"
                          checked={formData.services.wheelAlignment}
                          onCheckedChange={(checked) => handleServiceChange("wheelAlignment", checked as boolean)}
                        />
                        <label htmlFor="alignment" className="text-sm font-medium">
                          Wheel Alignment Check
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="roadHazard"
                          checked={formData.services.roadHazard}
                          onCheckedChange={(checked) => handleServiceChange("roadHazard", checked as boolean)}
                        />
                        <label htmlFor="roadHazard" className="text-sm font-medium">
                          Road Hazard Protection
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="shadow-xl py-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 pt-2">
                  <CardTitle className="flex items-center text-xl text-tire-dark">
                    <Clock className="w-6 h-6 mr-3 text-tire-orange" />
                    Additional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-tire-dark mb-2">
                        Preferred Contact Time
                      </label>
                      <Select value={formData.preferredContactTime} onValueChange={(value) => handleChange("preferredContactTime", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="When can we call you?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                          <SelectItem value="evening">Evening (5PM - 7PM)</SelectItem>
                          <SelectItem value="anytime">Anytime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tire-dark mb-2">
                        How Soon Do You Need This?
                      </label>
                      <Select value={formData.urgency} onValueChange={(value) => handleChange("urgency", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asap">ASAP - Emergency</SelectItem>
                          <SelectItem value="week">Within a week</SelectItem>
                          <SelectItem value="month">Within a month</SelectItem>
                          <SelectItem value="flexible">I'm flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tire-dark mb-2">
                      Additional Notes or Questions
                    </label>
                    <Textarea
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      placeholder="Tell us about your driving habits, any specific concerns, or questions you have..."
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              {submitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{submitError}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                size="lg" 
                className="bg-tire-gradient px-12 py-4 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Submitting Quote...
                  </>
                ) : (
                  <>
                    <Calculator className="w-6 h-6 mr-3" />
                    Get My Free Quote
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                By submitting this form, you agree to be contacted by our tire experts. 
                We respect your privacy and will never share your information.
              </p>
            </motion.div>
          </form>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose BandenCentrale?
            </h2>
            <p className="text-xl text-gray-600">
              Professional service, competitive prices, and expert advice
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Best Price Guarantee",
                description: "We'll match or beat any competitor's price on the same tire and service package."
              },
              {
                icon: Wrench,
                title: "Expert Installation",
                description: "Our certified technicians ensure proper installation and optimal performance."
              },
              {
                icon: Clock,
                title: "Quick Turnaround",
                description: "Most installations completed in under an hour. Same-day service available."
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="w-16 h-16 bg-tire-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-tire-orange" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const QuotePage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tire-orange mx-auto mb-4"></div>
        <p className="text-tire-gray">Loading quote form...</p>
      </div>
    </div>}>
      <QuotePageContent />
    </Suspense>
  );
};

export default QuotePage;
