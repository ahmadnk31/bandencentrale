"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { 
  Users, 
  Award, 
  MapPin, 
  Clock,
  Heart,
  Shield,
  Zap,
  Globe,
  Star,
  CheckCircle,
  Phone,
  Calendar
} from "lucide-react";

const AboutPage = () => {
  const stats = [
    { number: "15+", label: "Years in Business", icon: Clock },
    { number: "50,000+", label: "Tires Sold", icon: Star },
    { number: "25+", label: "Expert Technicians", icon: Users },
    { number: "98%", label: "Customer Satisfaction", icon: Heart }
  ];

  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description: "Your safety is our top priority. We ensure every tire installation meets the highest safety standards."
    },
    {
      icon: Heart,
      title: "Customer Care",
      description: "We treat every customer like family, providing personalized service and honest advice."
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "We partner only with premium brands and maintain the highest quality standards in everything we do."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We embrace the latest technology and methods to provide you with the best tire solutions."
    }
  ];

  const team = [
    {
      name: "Jan Vermeulen",
      role: "Founder & CEO",
      image: "/api/placeholder/300/300",
      experience: "20+ years",
      specialty: "Tire Technology",
      bio: "Founded BandenCentrale with a vision to provide premium tire solutions to the Belgian market."
    },
    {
      name: "Sarah De Bruyne",
      role: "Operations Manager",
      image: "/api/placeholder/300/300",
      experience: "12+ years",
      specialty: "Customer Service",
      bio: "Ensures smooth operations and exceptional customer experiences across all our services."
    },
    {
      name: "Tom Janssen",
      role: "Lead Technician",
      image: "/api/placeholder/300/300",
      experience: "15+ years",
      specialty: "Installation & Alignment",
      bio: "Master technician with expertise in all types of tire installation and wheel alignment."
    }
  ];

  const timeline = [
    {
      year: "2009",
      title: "Company Founded",
      description: "BandenCentrale was established in Ghent with a small workshop and big dreams."
    },
    {
      year: "2012",
      title: "First Expansion",
      description: "Expanded our facility and added advanced tire installation equipment."
    },
    {
      year: "2015",
      title: "Premium Partnerships",
      description: "Became authorized dealers for major tire brands including Michelin and Continental."
    },
    {
      year: "2018",
      title: "Service Expansion",
      description: "Added comprehensive automotive services including alignment and balancing."
    },
    {
      year: "2021",
      title: "Digital Innovation",
      description: "Launched online booking system and mobile tire services."
    },
    {
      year: "2024",
      title: "Excellence Recognition",
      description: "Achieved 98% customer satisfaction rating and industry recognition."
    }
  ];

  const certifications = [
    { name: "ISO 9001:2015", description: "Quality Management" },
    { name: "TÜV Certified", description: "Technical Safety" },
    { name: "Michelin Authorized", description: "Premium Partner" },
    { name: "Continental Expert", description: "Certified Dealer" }
  ];

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
              About{" "}
              <span className="text-tire-orange">BandenCentrale</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              For over 15 years, we've been Belgium's trusted partner for premium tire solutions. 
              Our commitment to safety, quality, and customer satisfaction drives everything we do.
            </p>
            <Button size="lg" className="bg-tire-orange hover:bg-tire-orange/90">
              <Users className="w-5 h-5 mr-2" />
              Meet Our Team
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-tire-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-tire-dark mb-2">
                  {stat.number}
                </div>
                <div className="text-tire-gray">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-tire-dark mb-6">
                Our{" "}
                <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
                  Story
                </span>
              </h2>
              <div className="space-y-6 text-tire-gray leading-relaxed">
                <p>
                  BandenCentrale was born from a simple belief: every driver deserves access to premium tire solutions 
                  without compromising on service quality or value. Founded in 2009 in the heart of Ghent, Belgium, 
                  we started as a small family business with a big vision.
                </p>
                <p>
                  What began as a modest tire workshop has grown into one of Belgium's most trusted tire retailers. 
                  Our success isn't measured just in tires sold, but in the relationships we've built with thousands 
                  of satisfied customers who trust us with their safety on the road.
                </p>
                <p>
                  Today, we're proud to offer a comprehensive range of services, from tire sales and installation 
                  to advanced automotive services, all backed by our unwavering commitment to excellence and 
                  customer satisfaction.
                </p>
              </div>
              <div className="mt-8">
                <Button size="lg" className="mr-4">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Service
                </Button>
                <Button size="lg" variant="outline">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-tire-orange to-primary rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  {certifications.map((cert, index) => (
                    <div key={cert.name} className="text-center">
                      <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="w-8 h-8" />
                      </div>
                      <h4 className="font-semibold mb-1">{cert.name}</h4>
                      <p className="text-xs opacity-90">{cert.description}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-xl font-bold mb-2">Certified Excellence</h3>
                  <p className="text-sm opacity-90">
                    Our commitment to quality is recognized by industry leaders
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Our{" "}
              <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
                Values
              </span>
            </h2>
            <p className="text-xl text-tire-gray max-w-3xl mx-auto">
              These core principles guide everything we do and shape the experience 
              we create for every customer.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full p-8 hover:shadow-xl transition-all border-0 shadow-lg text-center">
                  <CardContent className="p-0">
                    <div className="bg-tire-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-tire-dark mb-4">
                      {value.title}
                    </h3>
                    <p className="text-tire-gray leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-tire-dark mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <p className="text-xl text-tire-gray max-w-3xl mx-auto">
              From humble beginnings to industry recognition, here's how we've grown over the years.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-tire-orange"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-tire-orange rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                    <Card className="p-6 shadow-lg border-0">
                      <CardContent className="p-0">
                        <div className="text-2xl font-bold text-tire-orange mb-2">
                          {item.year}
                        </div>
                        <h3 className="text-xl font-bold text-tire-dark mb-3">
                          {item.title}
                        </h3>
                        <p className="text-tire-gray">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our{" "}
              <span className="bg-gradient-to-r from-tire-orange to-primary bg-clip-text text-transparent">
                Team
              </span>
            </h2>
            <p className="text-xl text-tire-gray max-w-3xl mx-auto">
              Behind every great tire service is a team of passionate professionals 
              dedicated to your safety and satisfaction.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all border-0 shadow-lg">
                  <CardContent className="p-0">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-tire-dark mb-1">
                        {member.name}
                      </h3>
                      <p className="text-tire-orange font-semibold mb-2">
                        {member.role}
                      </p>
                      <div className="flex items-center text-sm text-tire-gray mb-4">
                        <Clock className="w-4 h-4 mr-2" />
                        {member.experience} • {member.specialty}
                      </div>
                      <p className="text-tire-gray text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-tire-dark to-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Experience the BandenCentrale Difference?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Join thousands of satisfied customers who trust us with their tire needs. 
              Experience premium service, quality products, and expert care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-tire-orange hover:bg-tire-orange/90 px-8">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Service
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-tire-dark px-8">
                <MapPin className="w-5 h-5 mr-2" />
                Visit Our Shop
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
