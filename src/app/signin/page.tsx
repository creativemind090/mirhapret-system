'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

declare global {
  interface Window {
    google?: any;
    handleGoogleCredential?: (response: any) => void;
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '739060573656-c33cm97hkntebqvili80b260s81sqhep.apps.googleusercontent.com';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle, isLoggedIn } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const sessionExpired = searchParams.get('session') === 'expired';

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  const handleCredentialResponse = async (response: any) => {
    setError('');
    setLoading(true);
    const result = await loginWithGoogle(response.credential);
    setLoading(false);
    if (result.success) {
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    } else {
      setError(result.error || 'Sign-in failed. Please try again.');
    }
  };

  useEffect(() => {
    // Expose callback globally for GIS
    window.handleGoogleCredential = handleCredentialResponse;

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: window.handleGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          shape: 'rectangular',
          theme: 'outline',
          text: 'continue_with',
          size: 'large',
          width: 360,
          logo_alignment: 'left',
        });
      }
    };

    if (window.google?.accounts) {
      initGoogle();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    }

    return () => {
      delete window.handleGoogleCredential;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>

      {/* ─── Left — Brand Panel ─────────────────────────────── */}
      <div style={{
        flex: '0 0 42%',
        background: '#0e0e0e',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }} className="signin-brand-panel">
        {/* Watermark */}
        <div style={{ position: 'absolute', bottom: '-40px', right: '-20px', fontSize: '20vw', fontWeight: 900, color: 'rgba(255,255,255,0.03)', lineHeight: 1, userSelect: 'none', letterSpacing: '-4px', maxWidth: '100%' }}>
          MP
        </div>

        <a href="/" style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '2px', color: '#fff', textDecoration: 'none', zIndex: 1 }}>
          MirhaPret
        </a>

        <div style={{ zIndex: 1 }}>
          <div style={{ width: '40px', height: '2px', background: '#c8a96e', marginBottom: '28px' }} />
          <h2 style={{ fontSize: 'clamp(1.8rem, 2.5vw, 2.8rem)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', lineHeight: 1.15, marginBottom: '20px' }}>
            Dressed to<br />Be Remembered.
          </h2>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.8, maxWidth: '320px' }}>
            Sign in to access your orders, wishlist, and exclusive member offers from MirhaPret.
          </p>
          <div style={{ display: 'flex', gap: '24px', marginTop: '32px' }}>
            {[
              { num: '10K+', label: 'Customers' },
              { num: '500+', label: 'Pieces' },
              { num: '3', label: 'Collections' },
            ].map((s, i) => (
              <div key={i}>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#c8a96e', letterSpacing: '-0.5px' }}>{s.num}</p>
                <p style={{ fontSize: '10px', color: '#555', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: '11px', color: '#333', zIndex: 1 }}>© 2026 MirhaPret</p>
      </div>

      {/* ─── Right — Sign-in ─────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Welcome
          </h1>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '40px', lineHeight: 1.6 }}>
            Sign in or create an account to continue shopping.
          </p>

          {sessionExpired && (
            <div style={{ padding: '12px 16px', background: '#fff8e6', borderLeft: '3px solid #c8a96e', fontSize: '13px', color: '#92660a', marginBottom: '24px' }}>
              Your session has expired. Please sign in again.
            </div>
          )}

          {error && (
            <div style={{ padding: '12px 16px', background: '#fff0f0', borderLeft: '3px solid #c0392b', fontSize: '13px', color: '#c0392b', marginBottom: '24px' }}>
              {error}
            </div>
          )}

          {loading && (
            <div style={{ padding: '12px 16px', background: '#f5f5f5', fontSize: '13px', color: '#555', marginBottom: '24px', textAlign: 'center' }}>
              Signing you in…
            </div>
          )}

          {/* Google Sign-In Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div ref={buttonRef} style={{ width: '100%', maxWidth: '360px' }} />

            <p style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', lineHeight: 1.6 }}>
              By continuing you agree to our{' '}
              <a href="#" style={{ color: '#000', textDecoration: 'underline' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color: '#000', textDecoration: 'underline' }}>Privacy Policy</a>.
            </p>
          </div>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <a href="/" style={{ fontSize: '13px', color: '#999', textDecoration: 'none' }}>
              ← Continue as guest
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .signin-brand-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
