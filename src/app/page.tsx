import { Metadata } from "next";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import CategoriesCarousel from "@/components/categories-carousel";
import FeaturedTires from "@/components/featured-tires";
import NewArrivalsCarousel from "@/components/new-arrivals-carousel";
import BestSellersCarousel from "@/components/best-sellers-carousel";
import SpecialOffersCarousel from "@/components/special-offers-carousel";
import ServicesSection from "@/components/services-section";
import BrandsSection from "@/components/brands-section";
import WhyChooseUsSection from "@/components/why-choose-us-section";
import TestimonialsSection from "@/components/testimonials-section";
import NewsletterSection from "@/components/newsletter-section";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: 'Premium Tire Solutions & Expert Installation',
  description: 'Discover premium tires from leading brands like Michelin, Continental, Bridgestone, and Pirelli. Professional installation, wheel alignment, and automotive services in Ghent, Belgium.',
  keywords: [
    'premium tires Belgium', 'tire installation Ghent', 'Michelin tires', 'Continental tires',
    'summer tires', 'winter tires', 'all-season tires', 'performance tires',
    'wheel alignment', 'tire service', 'automotive service Belgium'
  ],
  openGraph: {
    title: 'BandenCentrale - Premium Tire Solutions & Expert Installation',
    description: 'Discover premium tires from leading brands with professional installation and automotive services in Ghent, Belgium.',
    images: ['/og-home.jpg'],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <CategoriesCarousel />
        <FeaturedTires />
        <NewArrivalsCarousel />
        <BestSellersCarousel />
        <SpecialOffersCarousel />
        <BrandsSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
     
    </div>
  );
}
