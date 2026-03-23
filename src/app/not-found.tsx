import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div style={{ background: '#fff', color: '#000', minHeight: '100vh' }}>
      <SiteHeader />
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '80px 40px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#c8a96e', fontWeight: 700, marginBottom: '20px' }}>
          404
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, color: '#000', marginBottom: '16px' }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.8, maxWidth: '420px', marginBottom: '40px' }}>
          The page you are looking for may have moved, been removed, or does not exist. Let us help you find what you need.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/" style={{
            padding: '14px 32px',
            background: '#000',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}>
            Go Home
          </a>
          <a href="/products" style={{
            padding: '14px 32px',
            background: 'transparent',
            color: '#000',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            border: '1.5px solid #000',
          }}>
            Shop Collection
          </a>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
