import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Premium Tires Collection',
  description: 'Browse our extensive collection of premium tires from top brands including Michelin, Continental, Bridgestone, Pirelli, and Goodyear. Find summer, winter, all-season, and performance tires with expert installation services.',
  keywords: [
    'tire collection', 'premium tires', 'tire brands Belgium', 'Michelin tires',
    'Continental tires', 'Bridgestone tires', 'Pirelli tires', 'Goodyear tires',
    'summer tires', 'winter tires', 'all-season tires', 'performance tires',
    'tire shop Ghent', 'tire installation', 'wheel alignment'
  ],
  openGraph: {
    title: 'Premium Tires Collection - BandenCentrale',
    description: 'Browse our extensive collection of premium tires from top brands with expert installation services in Belgium.',
    images: ['/og-tires.jpg'],
  },
};

export default function TiresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
