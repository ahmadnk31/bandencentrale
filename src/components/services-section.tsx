"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { services } from "@/lib/services-data";
import { 
  CheckCircle,
  ArrowRight
} from "lucide-react";

const ServicesSection = () => {
  const router = useRouter();

  const processSteps = [
    {
      step: 1,
      title: "Book Appointment",
      description: "Schedule your service online or call us directly"
    },
    {
      step: 2,
      title: "Vehicle Inspection",
      description: "Our experts assess your tire needs and vehicle condition"
    },
    {
      step: 3,
      title: "Professional Service",
      description: "Certified technicians perform the service with precision"
    },
    {
      step: 4,
      title: "Quality Assurance",
      description: "Final inspection and road test to ensure perfect results"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-tire-dark mb-4">
            Professional{" "}
            <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
              Tire Services
            </span>
          </h2>
          <p className="text-xl text-tire-gray max-w-3xl mx-auto">
            Beyond just selling tires, we provide comprehensive automotive services 
            to keep you safe and your vehicle performing at its best.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full hover:shadow-xl transition-all py-0 duration-300 border-0 shadow-lg">
                <CardContent className="p-8 space-y-6">
                  {/* Icon */}
                  <div className={`${service.color} w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-bold text-tire-dark mb-3">
                      {service.title}
                    </h3>
                    <p className="text-tire-gray mb-4">
                      {service.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-tire-gray">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Price and CTA */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-tire-dark">
                        {service.price}
                      </span>
                    </div>
                                          <Button className="w-full group-hover:bg-tire-orange transition-colors"
                              onClick={() => router.push(`/services/${service.slug}`)}>
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Process Section */}
        <motion.div
          className="bg-gradient-to-r from-tire-dark to-primary rounded-3xl p-8 lg:p-12 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              Our Service Process
            </h3>
            <p className="text-gray-300 text-lg">
              Experience our streamlined process designed for your convenience and peace of mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                className="text-center relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Step number */}
                <div className="relative">
                  <div className="w-16 h-16 bg-tire-orange rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  {/* Connector line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-white/20 -translate-y-0.5"></div>
                  )}
                </div>
                
                <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                <p className="text-gray-300 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-tire-orange hover:bg-tire-orange/90 text-white px-8 py-4 rounded-full">
              Schedule Service Now
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
