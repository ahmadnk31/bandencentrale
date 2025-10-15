import { Metadata } from "next";
import { getProductBySlug } from "@/lib/db/queries";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The tire product you are looking for could not be found.',
    };
  }

  // Compute inStock status
  const inStock = product.trackQuantity ? product.stockQuantity > 0 : true;
  
  return {
    title: `${product.brand?.name || 'Unknown'} ${product.name} - ${product.season || ''} Tire`,
    description: `${product.brand?.name || 'Unknown'} ${product.name} ${product.season || ''} tire in size ${product.size || ''}. ${product.description || ''} Professional installation available. Price: €${product.price}`,
    keywords: [
      `${product.brand?.name || ''} ${product.name}`,
      `${product.brand?.name || ''} tire`,
      `${product.season || ''} tire`,
      `${product.size || ''} tire`,
      `${product.brand?.name || ''} ${product.season || ''}`,
      'tire installation',
      'premium tire',
      `${product.category?.name || ''} tire`,
      ...((Array.isArray(product.features) ? product.features : []) as string[]).slice(0, 5)
    ],
    openGraph: {
      title: `${product.brand?.name || 'Unknown'} ${product.name} - ${product.season || ''} Tire`,
      description: `${product.brand?.name || 'Unknown'} ${product.name} in size ${product.size || ''}. Professional installation available.`,
      images: (Array.isArray(product.images) ? product.images : []).map((img: string) => img),
      type: 'website'
    },
    other: {
      'product:brand': product.brand?.name || '',
      'product:availability': inStock ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:price:amount': product.price?.toString() || '0',
      'product:price:currency': 'EUR',
    }
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
