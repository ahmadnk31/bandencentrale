import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch',
  description: 'Contact BandenCentrale for tire installation, automotive services, or inquiries. Located in Ghent, Belgium. Call +32 467 87 1205 or visit our shop at Technologiepark 15.',
  keywords: [
    'contact BandenCentrale', 'tire shop Ghent', 'automotive service contact',
    'tire installation appointment', 'Technologiepark 15 Ghent',
    'tire service phone', 'automotive consultation Belgium',
    'tire expert contact', 'wheel alignment appointment'
  ],
  openGraph: {
    title: 'Contact BandenCentrale - Get in Touch',
    description: 'Contact us for tire installation, automotive services, or inquiries. Located in Ghent, Belgium.',
    images: ['/og-contact.jpg'],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
