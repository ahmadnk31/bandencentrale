import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Get Your Tire Quote - Free Professional Consultation',
  description: 'Get a personalized tire quote from BandenCentrale experts. Free consultation for tire selection, installation services, and automotive solutions. Quick response within 2 hours.',
  keywords: [
    'tire quote Belgium', 'free tire consultation', 'tire price quote',
    'tire installation quote', 'automotive service quote',
    'tire expert consultation', 'professional tire advice',
    'tire selection help', 'custom tire quote'
  ],
  openGraph: {
    title: 'Get Your Tire Quote - Free Professional Consultation',
    description: 'Get a personalized tire quote with free expert consultation and quick response within 2 hours.',
    images: ['/og-quote.jpg'],
  },
};

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
