import { 
  Wrench, 
  RotateCcw, 
  Shield, 
  Gauge, 
  Car, 
  Clock,
  LucideIcon
} from "lucide-react";

export interface ServiceData {
  id: number;
  slug: string;
  icon: LucideIcon;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  price: string;
  duration: string;
  color: string;
  category: string;
  benefits: string[];
  process: string[];
  includes: string[];
  warranty: string;
  testimonials: Array<{
    name: string;
    rating: number;
    comment: string;
  }>;
}

export const services: ServiceData[] = [
  {
    id: 1,
    slug: "tire-installation",
    icon: Wrench,
    title: "Tire Installation",
    description: "Professional mounting, balancing, and alignment services by certified technicians.",
    longDescription: "Our expert tire installation service ensures your new tires are mounted, balanced, and aligned to perfection. Using state-of-the-art equipment and techniques, our certified technicians guarantee optimal performance and safety for your vehicle.",
    features: ["Expert Installation", "Wheel Balancing", "TPMS Reset", "Quality Inspection"],
    price: "Free with tire purchase",
    duration: "45-60 minutes",
    color: "bg-blue-500",
    category: "Installation",
    benefits: [
      "Proper tire mounting for optimal performance",
      "Professional wheel balancing to prevent vibration",
      "TPMS sensor programming and reset",
      "Safety inspection and final quality check"
    ],
    process: [
      "Remove old tires and inspect wheels",
      "Mount new tires using professional equipment",
      "Balance wheels to eliminate vibration",
      "Reset TPMS and perform final inspection"
    ],
    includes: [
      "Professional tire mounting",
      "Wheel balancing service",
      "TPMS reset and programming",
      "Valve stem replacement",
      "Final safety inspection"
    ],
    warranty: "Workmanship guaranteed for 12 months",
    testimonials: [
      {
        name: "John Smith",
        rating: 5,
        comment: "Excellent installation service. Professional team and great attention to detail."
      },
      {
        name: "Maria Garcia",
        rating: 5,
        comment: "Quick and efficient service. My car feels much smoother now."
      }
    ]
  },
  {
    id: 2,
    slug: "tire-rotation",
    icon: RotateCcw,
    title: "Tire Rotation",
    description: "Extend tire life with our regular rotation service to ensure even wear patterns.",
    longDescription: "Regular tire rotation is essential for maximizing tire life and maintaining optimal vehicle performance. Our systematic rotation patterns ensure even wear distribution across all four tires, helping you get the most value from your investment.",
    features: ["Even Wear Distribution", "Extended Tire Life", "Performance Optimization", "Inspection Included"],
    price: "€35",
    duration: "30 minutes",
    color: "bg-green-500",
    category: "Maintenance",
    benefits: [
      "Extend tire life by up to 30%",
      "Maintain optimal traction and handling",
      "Prevent irregular wear patterns",
      "Save money on premature tire replacement"
    ],
    process: [
      "Inspect current tire condition and wear patterns",
      "Remove tires following proper rotation pattern",
      "Check tire pressure and adjust as needed",
      "Reinstall tires and perform final inspection"
    ],
    includes: [
      "Complete tire rotation service",
      "Tire pressure check and adjustment",
      "Visual inspection of tire condition",
      "Wear pattern analysis",
      "Recommendation for future maintenance"
    ],
    warranty: "Service guarantee for 30 days",
    testimonials: [
      {
        name: "David Johnson",
        rating: 5,
        comment: "Regular rotation service has really extended my tire life. Great value!"
      },
      {
        name: "Sarah Wilson",
        rating: 5,
        comment: "Professional service and fair pricing. Highly recommend for tire maintenance."
      }
    ]
  },
  {
    id: 3,
    slug: "road-hazard-protection",
    icon: Shield,
    title: "Road Hazard Protection",
    description: "Comprehensive protection against road hazards with quick replacement service.",
    longDescription: "Our Road Hazard Protection plan provides comprehensive coverage against unexpected tire damage from road hazards like nails, glass, potholes, and debris. Get peace of mind knowing you're protected against costly tire replacements.",
    features: ["Damage Coverage", "Quick Replacement", "Peace of Mind", "24/7 Support"],
    price: "From €49/tire",
    duration: "Instant coverage",
    color: "bg-purple-500",
    category: "Protection",
    benefits: [
      "Coverage against nails, glass, and road debris",
      "Quick replacement service when needed",
      "Protection against pothole damage",
      "Transferable coverage to new owner"
    ],
    process: [
      "Purchase protection plan with tire installation",
      "Receive coverage documentation and terms",
      "Contact us immediately if damage occurs",
      "Quick assessment and replacement if covered"
    ],
    includes: [
      "Road hazard damage coverage",
      "Quick replacement service",
      "Coverage documentation",
      "24/7 emergency support",
      "Transferable protection plan"
    ],
    warranty: "Coverage for the life of the tire",
    testimonials: [
      {
        name: "Mike Chen",
        rating: 5,
        comment: "The protection plan saved me hundreds when I hit a pothole. Worth every penny!"
      },
      {
        name: "Lisa Rodriguez",
        rating: 5,
        comment: "Great peace of mind knowing I'm covered against road hazards."
      }
    ]
  },
  {
    id: 4,
    slug: "pressure-check",
    icon: Gauge,
    title: "Pressure Check & Fill",
    description: "Regular pressure monitoring and nitrogen fill service for optimal performance.",
    longDescription: "Proper tire pressure is crucial for safety, fuel efficiency, and tire longevity. Our pressure check and fill service includes nitrogen inflation for superior pressure retention and performance benefits.",
    features: ["Pressure Monitoring", "Nitrogen Fill", "Performance Check", "Fuel Efficiency"],
    price: "Free",
    duration: "15 minutes",
    color: "bg-tire-orange",
    category: "Maintenance",
    benefits: [
      "Improved fuel efficiency",
      "Extended tire life",
      "Better pressure retention with nitrogen",
      "Enhanced safety and performance"
    ],
    process: [
      "Check current tire pressure on all tires",
      "Inspect tires for visible damage or wear",
      "Fill tires with nitrogen to optimal pressure",
      "Provide pressure monitoring recommendations"
    ],
    includes: [
      "Complete pressure check",
      "Nitrogen fill service",
      "Tire condition inspection",
      "Pressure monitoring advice",
      "Free service with any purchase"
    ],
    warranty: "Complimentary service guarantee",
    testimonials: [
      {
        name: "Tom Anderson",
        rating: 5,
        comment: "Free service that really makes a difference. Nitrogen fill is excellent."
      },
      {
        name: "Jennifer Lee",
        rating: 5,
        comment: "Quick and professional. My tires hold pressure much better now."
      }
    ]
  },
  {
    id: 5,
    slug: "wheel-alignment",
    icon: Car,
    title: "Wheel Alignment",
    description: "Precision alignment service to improve handling and prevent uneven tire wear.",
    longDescription: "Proper wheel alignment is essential for vehicle safety, tire longevity, and optimal handling. Our computerized alignment service ensures your wheels are perfectly positioned for maximum performance and even tire wear.",
    features: ["Computer Alignment", "Suspension Check", "Steering Adjustment", "Precision Measurement"],
    price: "€89",
    duration: "60-90 minutes",
    color: "bg-red-500",
    category: "Maintenance",
    benefits: [
      "Prevent premature tire wear",
      "Improved fuel efficiency",
      "Better vehicle handling and safety",
      "Reduced steering wheel vibration"
    ],
    process: [
      "Computer analysis of current alignment",
      "Suspension and steering component inspection",
      "Precision adjustment of camber, caster, and toe",
      "Final measurement and road test"
    ],
    includes: [
      "Computerized alignment service",
      "Suspension component inspection",
      "Steering system check",
      "Before and after measurements",
      "Road test and final adjustment"
    ],
    warranty: "Alignment service guaranteed for 12 months",
    testimonials: [
      {
        name: "Robert Kim",
        rating: 5,
        comment: "My car drives straight and smooth after the alignment. Excellent work!"
      },
      {
        name: "Amanda Brown",
        rating: 5,
        comment: "Professional service and detailed explanation of the work performed."
      }
    ]
  },
  {
    id: 6,
    slug: "roadside-assistance",
    icon: Clock,
    title: "24/7 Roadside Assistance",
    description: "Emergency tire replacement and roadside assistance available around the clock.",
    longDescription: "Our comprehensive roadside assistance program provides 24/7 emergency tire service, ensuring you're never stranded due to tire problems. From flat tire changes to emergency tire replacement, we're here when you need us most.",
    features: ["Emergency Service", "Mobile Installation", "24/7 Availability", "Professional Response"],
    price: "€149/year",
    duration: "Emergency response",
    color: "bg-indigo-500",
    category: "Emergency",
    benefits: [
      "24/7 emergency tire service",
      "Mobile tire installation at your location",
      "Quick response time",
      "Professional emergency technicians"
    ],
    process: [
      "Call our 24/7 emergency hotline",
      "Provide location and tire problem details",
      "Emergency technician dispatched to your location",
      "On-site tire repair or replacement service"
    ],
    includes: [
      "24/7 emergency response",
      "Mobile tire installation",
      "Emergency tire replacement",
      "Roadside tire repair",
      "Professional emergency service"
    ],
    warranty: "Emergency service guarantee",
    testimonials: [
      {
        name: "Chris Taylor",
        rating: 5,
        comment: "Saved me when I had a blowout on the highway. Fast and professional!"
      },
      {
        name: "Nicole Martinez",
        rating: 5,
        comment: "24/7 service is a lifesaver. Great peace of mind for long trips."
      }
    ]
  }
];

export const getServiceBySlug = (slug: string): ServiceData | undefined => {
  return services.find(service => service.slug === slug);
};

export const getServicesByCategory = (category: string): ServiceData[] => {
  return services.filter(service => service.category.toLowerCase() === category.toLowerCase());
};

export const getAllServiceCategories = (): string[] => {
  return [...new Set(services.map(service => service.category))];
};
