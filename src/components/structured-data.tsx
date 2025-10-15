interface StructuredDataProps {
  type: 'Organization' | 'LocalBusiness' | 'Product' | 'Service' | 'BreadcrumbList';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    };

    if (type === 'Organization' || type === 'LocalBusiness') {
      return {
        ...baseData,
        '@type': 'AutoPartsStore',
        name: 'BandenCentrale',
        description: 'Premium tire retailer and automotive service center in Belgium',
        url: 'https://bandencentrale.be',
        logo: 'https://bandencentrale.be/logo.png',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Technologiepark 15',
          addressLocality: 'Ghent',
          postalCode: '9052',
          addressCountry: 'BE'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+32-467-87-1205',
          contactType: 'customer service',
          availableLanguage: ['English', 'Dutch', 'French']
        },
        openingHours: [
          'Mo-Fr 08:00-18:00',
          'Sa 09:00-17:00'
        ],
        priceRange: '€€',
        paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
        currenciesAccepted: 'EUR',
        ...data
      };
    }

    return baseData;
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateStructuredData())
      }}
    />
  );
}
