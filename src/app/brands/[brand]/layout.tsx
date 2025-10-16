import { Metadata } from "next";

type Props = {
  params: { brand: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const brandSlug = brand?.toLowerCase();
  const brandName = brandSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
  
  return {
    title: `${brandName} Tires - Premium Quality & Performance`,
    description: `Discover ${brandName} tires with professional installation services. Wide selection of premium tires for all seasons and vehicle types in Belgium.`,
    keywords: [
      `${brandName} tires`,
      `${brandName} Belgium`,
      'tire installation',
      'premium tires',
      'tire service',
      'all season tires',
      'summer tires',
      'winter tires'
    ],
    openGraph: {
      title: `${brandName} Tires - Premium Quality & Performance`,
      description: `Discover ${brandName} tires with professional installation services in Belgium.`,
      images: [`/og-brand-${brandSlug}.jpg`],
    },
  };
}

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
