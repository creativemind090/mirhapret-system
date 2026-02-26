import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { FloatingChat } from "@/components/FloatingChat";

export const metadata: Metadata = {
  title: "MirhaPret - Luxury Boutique Fashion",
  description: "Discover curated luxury fashion collections. Premium pret, octa west, and desire collections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            <FloatingChat />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
