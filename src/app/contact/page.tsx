"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/header";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Wrench, 
  Star, 
  Navigation,
  Calendar,
  Send,
  Car,
  MessageSquare,
  CheckCircle
} from "lucide-react"
import { useRouter } from "next/navigation";

const ContactPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    serviceType: ""
  });

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Shop",
      details: [
        "Technologiepark 15",
        "9052 Ghent, Belgium",
        "Easy parking available"
      ],
      color: "bg-blue-500"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: [
        "+32 467 87 1205",
        "Emergency: +32 467 87 1206",
        "24/7 Roadside Assistance"
      ],
      color: "bg-green-500"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [
        "info@bandencentrale.be",
        "service@bandencentrale.be",
        "support@bandencentrale.be"
      ],
      color: "bg-purple-500"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        "Mon-Fri: 9:00 AM - 6:00 PM",
        "Saturday: 9:00 AM - 5:00 PM",
        "Sunday: Closed"
      ],
      color: "bg-orange-500"
    }
  ];

  const serviceTypes = [
    "Tire Installation",
    "Wheel Alignment", 
    "Tire Rotation",
    "Pressure Check",
    "Road Hazard Protection",
    "Emergency Service",
    "General Inquiry",
    "Other"
  ];

  const faqs = [
    {
      question: "How long does tire installation take?",
      answer: "Most tire installations are completed within 45-60 minutes. Complex jobs may take longer."
    },
    {
      question: "Do you offer mobile tire services?",
      answer: "Yes, we provide mobile tire installation and emergency roadside assistance throughout the Ghent area."
    },
    {
      question: "What tire brands do you carry?",
      answer: "We carry all major brands including Michelin, Continental, Bridgestone, Goodyear, Pirelli, and Hankook."
    },
    {
      question: "Do you provide warranties on your services?",
      answer: "Yes, all our services come with comprehensive warranties. Tire installation includes a 30-day satisfaction guarantee."
    },
    {
      question: "Can I schedule service online?",
      answer: "Absolutely! You can book appointments through our website or call us directly for immediate scheduling."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      serviceType: ""
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tire-dark to-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Get in{" "}
              <span className="text-tire-orange">Touch</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Ready to get started? We're here to help with all your tire needs. 
              Contact us today for expert advice and premium service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-tire-orange hover:bg-tire-orange/90">
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
              <Button 
              onClick={() => router.push('/quote')}
              size="lg" variant="outline" className="text-black border-white hover:bg-white hover:text-tire-dark">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-tire-dark mb-4">
              Contact{" "}
              <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
                Information
              </span>
            </h2>
            <p className="text-xl text-tire-gray max-w-3xl mx-auto">
              Multiple ways to reach us. Choose what's most convenient for you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full p-6 hover:shadow-xl transition-all border-0 shadow-lg text-center">
                  <CardContent className="p-0">
                    <div className={`${info.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <info.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-tire-dark mb-4">
                      {info.title}
                    </h3>
                    <div className="space-y-2">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-tire-gray text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 shadow-xl border-0">
                <CardContent className="p-0">
                  <h3 className="text-3xl font-bold text-tire-dark mb-6">
                    Send us a Message
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-tire-dark mb-2">
                          Name *
                        </label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-tire-dark mb-2">
                          Phone
                        </label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-tire-dark mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-tire-dark mb-2">
                        Service Type
                      </label>
                      <Select value={formData.serviceType} onValueChange={(value) => handleChange("serviceType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map(service => (
                            <SelectItem key={service} value={service}>{service}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-tire-dark mb-2">
                        Subject
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-tire-dark mb-2">
                        Message *
                      </label>
                      <Textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Tell us more about your tire needs..."
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-tire-gradient">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Map and Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Map */}
              <Card className="overflow-hidden shadow-xl border-0">
                <CardContent className="p-0">
                  <div className="relative h-64">
                    {/* Google Maps Embed */}
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2508.0737578130584!2d3.7536404772539465!3d51.05172587171325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c37700051d85b7%3A0xcde1d6416f99d9f2!2sARIANA%20Bandencentrale!5e0!3m2!1snl!2sbe!4v1760604184722!5m2!1snl!2sbe"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0"
                      title="BandenCentrale Location - Dendermondsesteenweg 428, 9040 Ghent, Belgium"
                    />
                    
                    {/* Overlay with business info */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
                      <div className="flex items-center mb-2">
                        <div className="bg-tire-orange w-8 h-8 rounded-full flex items-center justify-center mr-3">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-tire-dark text-sm">BandenCentrale</h4>
                          <p className="text-xs text-tire-gray">Premium Tire Solutions</p>
                        </div>
                      </div>
                      <p className="text-xs text-tire-gray mb-2">
                        Dendermondsesteenweg 428<br />
                        9040 Ghent, Belgium
                      </p>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="text-xs px-2 py-1 h-6 bg-tire-orange hover:bg-tire-orange/90"
                          onClick={() => window.open('https://www.google.com/maps/dir//Technologiepark+15,+9052+Ghent,+Belgium', '_blank')}
                        >
                          <Navigation className="w-3 h-3 mr-1" />
                          Directions
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs px-2 py-1 h-6"
                          onClick={() => window.open('tel:+32467871205')}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 shadow-xl border-0">
                <CardContent className="p-0">
                  <h4 className="text-2xl font-bold text-tire-dark mb-6">
                    Quick Actions
                  </h4>
                  <div className="space-y-4">
                    <Button 
                      className="w-full justify-start text-left" 
                      variant="outline"
                      onClick={() => router.push('/booking')}
                    >
                      <Calendar className="w-5 h-5 mr-3" />
                      Schedule Appointment
                    </Button>
                    <Button className="w-full justify-start text-left" variant="outline" onClick={() => router.push('/quote')}>
                      <Car className="w-5 h-5 mr-3" />
                      Get Tire Quote
                    </Button>
                    <Button className="w-full justify-start text-left" variant="outline">
                      <MessageSquare className="w-5 h-5 mr-3" />
                      Live Chat Support
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="p-6 bg-red-50 border-red-200 shadow-xl">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-red-700">
                        Emergency Service
                      </h4>
                      <p className="text-red-600 text-sm">
                        24/7 Roadside Assistance
                      </p>
                    </div>
                  </div>
                  <p className="text-red-700 font-bold text-lg mb-2">
                    +32 467 87 1206
                  </p>
                  <p className="text-red-600 text-sm">
                    Available for tire emergencies, flat tire replacement, and roadside assistance.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-tire-dark mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-tire-gray">
              Quick answers to common questions about our services.
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="bg-tire-orange w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-tire-dark mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-tire-gray leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
