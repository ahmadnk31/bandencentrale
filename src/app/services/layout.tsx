import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Professional Automotive Services',
  description: 'Comprehensive automotive services including tire installation, wheel alignment, tire rotation, pressure checks, and emergency roadside assistance. Expert technicians and state-of-the-art equipment.',
  keywords: [
    'automotive services Belgium', 'tire installation', 'wheel alignment',
    'tire rotation', 'pressure check', 'roadside assistance',
    'professional tire service', 'automotive maintenance Ghent',
    'tire service center', 'wheel balancing', 'tire repair'
  ],
  openGraph: {
    title: 'Professional Automotive Services - BandenCentrale',
    description: 'Comprehensive automotive services with expert technicians and state-of-the-art equipment in Belgium.',
    images: ['/og-services.jpg'],
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
