import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { FloatingChat } from "@/components/FloatingChat";
import { ReviewPopup } from "@/components/ReviewPopup";

const siteUrl = 'https://mirhapret.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MirhaPret - Luxury Pakistani Pret Fashion',
    template: '%s | MirhaPret',
  },
  description: 'Shop premium Pakistani pret, Octa West, and Desire collections at MirhaPret. Timeless elegance, contemporary luxury, and authentic craftsmanship for the modern Pakistani woman.',
  keywords: ['Pakistani fashion', 'pret', 'luxury boutique', 'Pakistani clothing', 'shalwar kameez', 'kurta', 'lawn suits', 'designer pret', 'MirhaPret'],
  authors: [{ name: 'MirhaPret' }],
  creator: 'MirhaPret',
  publisher: 'MirhaPret',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/logo-favicon.svg',
    shortcut: '/logo-favicon.svg',
    apple: '/logo-favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: siteUrl,
    siteName: 'MirhaPret',
    title: 'MirhaPret - Luxury Pakistani Pret Fashion',
    description: 'Shop premium Pakistani pret, Octa West, and Desire collections. Timeless elegance and authentic craftsmanship.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'MirhaPret - Luxury Pakistani Fashion' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MirhaPret - Luxury Pakistani Pret Fashion',
    description: 'Shop premium Pakistani pret, Octa West, and Desire collections.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: siteUrl,
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: 'MirhaPret',
  url: siteUrl,
  logo: `${siteUrl}/logo-favicon.svg`,
  description: 'Premium Pakistani pret fashion boutique offering Pret, Octa West and Desire collections.',
  foundingDate: '2016',
  address: { '@type': 'PostalAddress', addressCountry: 'PK' },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <AuthProvider>
          <CartProvider>
            {children}
            <FloatingChat />
            <ReviewPopup />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
