import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { FloatingChat } from "@/components/FloatingChat";
import { ReviewPopup } from "@/components/ReviewPopup";
import { SessionGuard } from "@/components/SessionGuard";
import Script from "next/script";

const siteUrl = 'https://mirhapret.com';
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '';

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Meta Pixel — only injected when NEXT_PUBLIC_FB_PIXEL_ID is set */}
        {FB_PIXEL_ID && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
        {FB_PIXEL_ID && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
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
            <SessionGuard />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
