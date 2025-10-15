import { Metadata } from "next";

type Props = {
  params: { category: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = params.category;
  
  const categoryInfo = getCategoryMetadata(category);
  
  return {
    title: categoryInfo.title,
    description: categoryInfo.description,
    keywords: categoryInfo.keywords,
    openGraph: {
      title: `${categoryInfo.title} - BandenCentrale`,
      description: categoryInfo.description,
      images: [`/og-tires-${category}.jpg`],
    },
  };
}

function getCategoryMetadata(category: string) {
  switch (category?.toLowerCase()) {
    case 'summer':
      return {
        title: 'Summer Tires - High Performance for Warm Weather',
        description: 'Premium summer tires designed for optimal performance in warm weather conditions. Superior grip, handling, and braking performance from top brands like Michelin, Continental, and Pirelli.',
        keywords: [
          'summer tires', 'warm weather tires', 'high performance tires',
          'summer tire installation', 'premium summer tires Belgium',
          'Michelin summer tires', 'Continental summer tires',
          'performance tires Ghent', 'summer tire service'
        ]
      };
    case 'winter':
      return {
        title: 'Winter Tires - Superior Traction for Cold Weather',
        description: 'Premium winter tires engineered for cold weather, snow, and ice conditions. Enhanced traction and safety features from leading brands for optimal winter driving performance.',
        keywords: [
          'winter tires', 'snow tires', 'cold weather tires',
          'winter tire installation', 'snow tire service Belgium',
          'studded tires', 'winter tire brands', 'ice grip tires',
          'winter driving safety', 'cold weather performance'
        ]
      };
    case 'all-season':
      return {
        title: 'All-Season Tires - Year-Round Performance',
        description: 'Versatile all-season tires providing reliable performance in various weather conditions. Perfect balance of comfort, durability, and all-weather capability for everyday driving.',
        keywords: [
          'all-season tires', 'year-round tires', 'versatile tires',
          'all-weather tires', 'everyday driving tires Belgium',
          'all-season tire installation', 'reliable tires',
          'multi-season performance', 'comfort tires'
        ]
      };
    case 'performance':
      return {
        title: 'Performance Tires - Enhanced Driving Dynamics',
        description: 'High-performance tires designed for enhanced driving dynamics, superior handling, and sport driving. Premium brands offering track-ready performance and precision.',
        keywords: [
          'performance tires', 'sport tires', 'high performance',
          'racing tires', 'track tires', 'sport driving',
          'performance tire brands', 'precision handling',
          'enhanced dynamics', 'sport tire installation'
        ]
      };
    default:
      return {
        title: 'Premium Tire Collection',
        description: 'Browse our extensive collection of premium tires from top brands with professional installation services.',
        keywords: ['tires', 'tire collection', 'premium tires', 'tire brands']
      };
  }
}

export default function TireCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
