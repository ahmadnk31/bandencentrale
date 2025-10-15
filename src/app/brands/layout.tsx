import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Premium Tire Brands',
  description: 'Explore premium tire brands including Michelin, Continental, Bridgestone, Pirelli, and Goodyear. Discover the heritage, innovation, and quality that makes each brand unique.',
  keywords: [
    'tire brands', 'premium tire brands', 'Michelin', 'Continental', 'Bridgestone',
    'Pirelli', 'Goodyear', 'tire manufacturers', 'quality tires Belgium',
    'brand comparison', 'tire brand selection', 'premium automotive brands'
  ],
  openGraph: {
    title: 'Premium Tire Brands - BandenCentrale',
    description: 'Explore premium tire brands and discover the heritage, innovation, and quality that makes each brand unique.',
    images: ['/og-brands.jpg'],
  },
};

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
