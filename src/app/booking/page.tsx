"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Car,
  MapPin,
  CheckCircle,
  ArrowRight,
  Settings,
  Shield,
  Wrench,
  Loader2
} from "lucide-react";
import Header from "@/components/header";

function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await fetch('/api/services?limit=20');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      return response.json();
    },
  });
}

const BookingPage = () => {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    notes: ""
  });

  // Fetch services from API
  const { data: servicesResponse, isLoading: servicesLoading, error: servicesError } = useServices();
  const services = servicesResponse?.data || [];

  const mockServices = [
    { id: "tire-installation", name: "Tire Installation", duration: "30-45 min", price: "€25", estimatedDuration: 45 },
    { id: "wheel-alignment", name: "Wheel Alignment", duration: "45-60 min", price: "€75", estimatedDuration: 60 },
    { id: "wheel-balancing", name: "Wheel Balancing", duration: "30 min", price: "€35", estimatedDuration: 30 },
    { id: "tire-rotation", name: "Tire Rotation", duration: "20 min", price: "€20", estimatedDuration: 20 },
    { id: "brake-service", name: "Brake Service", duration: "60-90 min", price: "€120", estimatedDuration: 75 },
    { id: "oil-change", name: "Oil Change", duration: "30 min", price: "€45", estimatedDuration: 30 }
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  const currentDate = new Date();
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Find the selected service details
      const selectedServiceData = displayServices.find((s: any) => s.id === selectedService);
      
      if (!selectedServiceData) {
        throw new Error("Please select a service");
      }

      // Check if we're using real API services (UUID) or mock services (string)
      const isRealService = selectedServiceData.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      
      if (!isRealService) {
        throw new Error("Service booking is temporarily unavailable. Please try again later or contact us directly.");
      }

      // Prepare appointment data according to API schema
      const appointmentData = {
        serviceId: selectedServiceData.id, // UUID from real services
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerEmail: formData.email,
        customerPhone: formData.phone,
        vehicleYear: formData.vehicleYear,
        vehicleMake: formData.vehicleMake,
        vehicleModel: formData.vehicleModel,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        estimatedDuration: selectedServiceData.estimatedDuration || 60, // in minutes
        notes: formData.notes
      };

      console.log("Submitting appointment data:", appointmentData);

      // Submit to API
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book appointment');
      }

      const result = await response.json();
      console.log("Appointment booked successfully:", result);
      setIsSubmitted(true);

    } catch (error) {
      console.error("Error booking appointment:", error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use API services or fall back to mock services
  const displayServices = services.length > 0 ? services : mockServices;
  const selectedServiceDetails = displayServices.find((s: any) => s.id === selectedService);

  // Show success page if appointment is booked
  if (isSubmitted) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-12 shadow-2xl">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Appointment Booked Successfully!
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Your appointment has been confirmed. We'll send you a confirmation email shortly with all the details.
                </p>
                <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
                  {selectedServiceDetails && (
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-tire-orange" />
                      <span className="text-gray-700">Service: <strong>{selectedServiceDetails.name}</strong></span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-tire-orange" />
                    <span className="text-gray-700">Date: <strong>{new Date(selectedDate).toLocaleDateString()}</strong></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-tire-orange" />
                    <span className="text-gray-700">Time: <strong>{selectedTime}</strong></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-tire-orange" />
                    <span className="text-gray-700">Email: <strong>{formData.email}</strong></span>
                  </div>
                </div>
                <div className="space-x-4">
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Book Another Appointment
                  </Button>
                  <Button onClick={() => window.location.href = '/services'} className="bg-tire-gradient">
                    View Our Services
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-tire-dark mb-4">
            Schedule Your{" "}
            <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
              Service
            </span>
          </h1>
          <p className="text-xl text-tire-gray max-w-2xl mx-auto">
            Book your appointment with our certified technicians. Quick, professional, and convenient service.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Service Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Select Service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {displayServices.map((service: any) => (
                      <div
                        key={service.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedService === service.id
                            ? "border-tire-orange bg-orange-50"
                            : "border-gray-200 hover:border-tire-orange/50"
                        }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-tire-dark">{service.name}</h3>
                          <Badge variant="outline">
                            {service.basePrice ? `€${service.basePrice}` : service.price || 'Contact us'}
                          </Badge>
                        </div>
                        <p className="text-sm text-tire-gray">
                          {service.estimatedDuration ? `${service.estimatedDuration} min` : service.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Date & Time Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Choose Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Preferred Date</Label>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {availableDates.slice(0, 14).map((date) => {
                        const dateObj = new Date(date);
                        const isSelected = selectedDate === date;
                        return (
                          <button
                            key={date}
                            type="button"
                            className={`p-3 text-sm rounded-lg border transition-all ${
                              isSelected
                                ? "border-tire-orange bg-tire-orange text-white"
                                : "border-gray-200 hover:border-tire-orange hover:bg-orange-50"
                            }`}
                            onClick={() => setSelectedDate(date)}
                          >
                            <div className="font-medium">
                              {dateObj.toLocaleDateString('en', { weekday: 'short' })}
                            </div>
                            <div className="text-xs opacity-80">
                              {dateObj.getDate()}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <Label className="text-base font-medium mb-3 block">Available Times</Label>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {timeSlots.map((time) => {
                          const isSelected = selectedTime === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              className={`p-2 text-sm rounded-lg border transition-all ${
                                isSelected
                                  ? "border-tire-orange bg-tire-orange text-white"
                                  : "border-gray-200 hover:border-tire-orange hover:bg-orange-50"
                              }`}
                              onClick={() => setSelectedTime(time)}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Vehicle Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="vehicleYear">Year</Label>
                      <Input
                        id="vehicleYear"
                        value={formData.vehicleYear}
                        onChange={(e) => setFormData({...formData, vehicleYear: e.target.value})}
                        placeholder="2020"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicleMake">Make</Label>
                      <Input
                        id="vehicleMake"
                        value={formData.vehicleMake}
                        onChange={(e) => setFormData({...formData, vehicleMake: e.target.value})}
                        placeholder="Toyota"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicleModel">Model</Label>
                      <Input
                        id="vehicleModel"
                        value={formData.vehicleModel}
                        onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                        placeholder="Camry"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Any specific concerns or requests..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Error Display */}
              {submitError && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <p className="text-red-600 text-sm">{submitError}</p>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-tire-gradient hover:opacity-90 py-4"
                disabled={!selectedService || !selectedDate || !selectedTime || !formData.firstName || !formData.email || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Booking Appointment...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Schedule Appointment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <motion.div
              className="sticky top-8 space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedServiceDetails && (
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h3 className="font-semibold text-tire-dark">{selectedServiceDetails.name}</h3>
                      <p className="text-sm text-tire-gray">
                        {selectedServiceDetails.estimatedDuration ? `${selectedServiceDetails.estimatedDuration} min` : selectedServiceDetails.duration}
                      </p>
                      <p className="text-lg font-bold text-tire-orange">
                        {selectedServiceDetails.basePrice ? `€${selectedServiceDetails.basePrice}` : selectedServiceDetails.price || 'Contact us'}
                      </p>
                    </div>
                  )}

                  {selectedDate && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-tire-orange" />
                      <div>
                        <p className="font-medium">{new Date(selectedDate).toLocaleDateString('en', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                        {selectedTime && (
                          <p className="text-sm text-tire-gray">{selectedTime}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-tire-gray mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>123 Main Street, Ghent, Belgium</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-tire-gray">
                      <Phone className="w-4 h-4" />
                      <span>+32 467 87 1205</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-green-500" />
                    <div>
                      <h4 className="font-semibold">Certified Technicians</h4>
                      <p className="text-sm text-tire-gray">ASE certified professionals</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wrench className="w-8 h-8 text-blue-500" />
                    <div>
                      <h4 className="font-semibold">Quality Guarantee</h4>
                      <p className="text-sm text-tire-gray">30-day satisfaction guarantee</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-purple-500" />
                    <div>
                      <h4 className="font-semibold">On-Time Service</h4>
                      <p className="text-sm text-tire-gray">We value your time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default BookingPage;
