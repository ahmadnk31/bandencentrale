"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import { useRouter, useParams } from "next/navigation";
import { getServiceBySlug, services } from "@/lib/services-data";
import { 
  ArrowLeft,
  CheckCircle,
  Clock,
  Euro,
  Shield,
  Star,
  Calendar,
  Phone,
  Award,
  Users,
  Zap
} from "lucide-react";

const ServicePage = () => {
  const router = useRouter();
  const params = useParams();
  const serviceSlug = params.service as string;

  const service = getServiceBySlug(serviceSlug);

  useEffect(() => {
    if (!service) {
      // If service not found, redirect to services page
      router.push('/services');
    }
  }, [service, router]);

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-tire-dark mb-4">Service not found</h1>
          <p className="text-tire-gray mb-8">The service you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/services')}>
            Browse All Services
          </Button>
        </div>
      </div>
    );
  }

  const relatedServices = services.filter(s => s.id !== service.id && s.category === service.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className={`bg-gradient-to-r from-tire-dark to-primary text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                className="text-black border-black hover:text-tire-dark"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <Badge className="bg-tire-orange text-white">
                {service.category}
              </Badge>
            </div>
            
            <div className="flex items-center gap-6 mb-6">
              <div className={`p-4 ${service.color} rounded-xl`}>
                <service.icon className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold mb-2">
                  {service.title}
                </h1>
                <p className="text-xl text-gray-200">
                  {service.description}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <Euro className="w-6 h-6 text-tire-orange" />
                <div>
                  <div className="font-semibold">Price</div>
                  <div className="text-gray-200">{service.price}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-tire-orange" />
                <div>
                  <div className="font-semibold">Duration</div>
                  <div className="text-gray-200">{service.duration}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-tire-orange" />
                <div>
                  <div className="font-semibold">Warranty</div>
                  <div className="text-gray-200">{service.warranty}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-tire-orange hover:bg-tire-orange/90"
                onClick={() => router.push(`/quote?service=${service.slug}`)}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book This Service
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-black border-white hover:bg-white hover:text-tire-dark"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call +32 467 87 1205
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="process">Process</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Service Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-tire-gray text-lg leading-relaxed mb-6">
                        {service.longDescription}
                      </p>
                      
                      <h3 className="text-xl font-bold text-tire-dark mb-4">What's Included</h3>
                      <div className="space-y-3">
                        {service.includes.map((item, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="process" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Our Process</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {service.process.map((step, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-8 h-8 bg-tire-gradient rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-tire-dark mb-1">Step {index + 1}</h4>
                              <p className="text-tire-gray">{step}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="benefits" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {service.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-tire-dark">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-6">
                    {service.testimonials.map((testimonial, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="flex items-center">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="ml-2 font-semibold text-tire-dark">
                              {testimonial.name}
                            </span>
                          </div>
                          <p className="text-tire-gray italic">"{testimonial.comment}"</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Service Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-tire-gray">Price:</span>
                    <span className="font-bold text-tire-dark">{service.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-tire-gray">Duration:</span>
                    <span className="font-bold text-tire-dark">{service.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-tire-gray">Category:</span>
                    <Badge variant="outline">{service.category}</Badge>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-semibold text-tire-dark">Key Features</h4>
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-tire-gradient mt-6"
                    onClick={() => router.push(`/quote?service=${serviceSlug}`)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Get Quote
                  </Button>
                </CardContent>
              </Card>

              {/* Why Choose Us */}
              <Card className="py-0">
                <CardHeader>
                  <CardTitle>Why Choose Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-tire-orange mr-3" />
                    <span className="text-sm">Certified Technicians</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-tire-orange mr-3" />
                    <span className="text-sm">15+ Years Experience</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-tire-orange mr-3" />
                    <span className="text-sm">Quick Service</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-tire-orange mr-3" />
                    <span className="text-sm">Quality Guarantee</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-tire-dark mb-8 text-center">
              Related Services
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedServices.map((relatedService, index) => (
                <motion.div
                  key={relatedService.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg py-0 transition-shadow cursor-pointer"
                        onClick={() => router.push(`/services/${relatedService.slug}`)}>
                    <CardContent className="p-6">
                      <div className={`p-3 ${relatedService.color} rounded-lg w-fit mb-4`}>
                        <relatedService.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-tire-dark mb-2">
                        {relatedService.title}
                      </h3>
                      <p className="text-tire-gray mb-4">
                        {relatedService.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-tire-orange">
                          {relatedService.price}
                        </span>
                        <Button size="sm" variant="outline">
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-tire-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Get a Quote for {service.title}?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Get a personalized quote from certified technicians. Request online or call us today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-tire-orange hover:bg-tire-orange/90"
                onClick={() => router.push(`/quote?service=${serviceSlug}`)}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Get Quote
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-black border-white hover:text-tire-dark"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call +32 467 87 1205
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
