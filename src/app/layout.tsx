import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import StructuredData from "@/components/structured-data";
import { CartProvider } from "@/lib/cart-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { AuthProvider } from "@/components/providers/auth-provider";
import Header from "@/components/header";
import QueryProvider from "@/providers/query-provider";
import { Analytics } from "@vercel/analytics/next"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | BandenCentrale',
    default: 'BandenCentrale - Premium Tire Solutions & Expert Installation in Belgium'
  },
  description: "Belgium's leading tire retailer offering premium brands like Michelin, Continental, Bridgestone, Pirelli. Professional installation, wheel alignment, and expert automotive services in Ghent.",
  keywords: [
    'tires Belgium', 'banden', 'autobanden', 'winter tires', 'summer tires', 'all-season tires',
    'Michelin', 'Continental', 'Bridgestone', 'Pirelli', 'Goodyear',
    'tire installation', 'wheel alignment', 'tire service Ghent',
    'premium tires', 'performance tires', 'tire shop Belgium'
  ],
  authors: [{ name: 'BandenCentrale' }],
  creator: 'BandenCentrale',
  publisher: 'BandenCentrale',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bandencentrale.be'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'nl': '/nl',
      'fr': '/fr',
    },
  },
  openGraph: {
    title: 'BandenCentrale - Premium Tire Solutions & Expert Installation',
    description: "Belgium's leading tire retailer offering premium brands and professional installation services in Ghent.",
    url: 'https://bandencentrale.be',
    siteName: 'BandenCentrale',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BandenCentrale - Premium Tire Solutions',
      },
    ],
    locale: 'en_BE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BandenCentrale - Premium Tire Solutions',
    description: "Belgium's leading tire retailer offering premium brands and professional installation services.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ea580c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BandenCentrale" />
        <meta name="mobile-web-app-capable" content="yes" />
        <StructuredData 
          type="LocalBusiness" 
          data={{
            hasMap: 'https://maps.google.com/?q=Technologiepark+15+Ghent',
            areaServed: {
              '@type': 'Country',
              name: 'Belgium'
            },
            serviceArea: {
              '@type': 'GeoCircle',
              geoMidpoint: {
                '@type': 'GeoCoordinates',
                latitude: '51.0543',
                longitude: '3.7174'
              },
              geoRadius: '50000'
            }
          }} 
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <QueryProvider>
            <CartProvider>
              <FavoritesProvider>
              <Analytics />
                
                {children}
                <Footer/>
              </FavoritesProvider>
            </CartProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
