import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FeaturedTires from "@/components/featured-tires";
import ServicesSection from "@/components/services-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedTires />
        <ServicesSection />
      </main>
    
    </div>
  );
}
