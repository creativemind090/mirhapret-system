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
const GOLD = '#c8a96e';
const DARK = '#080808';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle, isLoggedIn } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const sessionExpired = searchParams.get('session') === 'expired';

  useEffect(() => {
    if (isLoggedIn) router.push('/');
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
          type: 'standard', shape: 'rectangular', theme: 'outline',
          text: 'continue_with', size: 'large', width: 360, logo_alignment: 'left',
        });
      }
    };
    if (window.google?.accounts) {
      initGoogle();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true; script.defer = true; script.onload = initGoogle;
      document.head.appendChild(script);
    }
    return () => { delete window.handleGoogleCredential; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>

      {/* ─── Left Brand Panel ─── */}
      <div className="auth-brand-panel" style={{
        flex: '0 0 42%', background: DARK,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '56px 52px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Giant watermark */}
        <div style={{
          position: 'absolute', bottom: '-60px', right: '-30px',
          fontFamily: "'Montserrat', sans-serif", fontSize: '22vw', fontWeight: 700,
          color: 'rgba(255,255,255,0.025)', lineHeight: 1,
          userSelect: 'none', letterSpacing: '-4px',
        }}>MP</div>

        {/* Gold grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.035,
          backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <a href="/" style={{
          fontFamily: "'Montserrat', sans-serif", fontSize: '26px', fontWeight: 700,
          letterSpacing: '3px', color: '#fff', textDecoration: 'none',
          textTransform: 'uppercase', zIndex: 1,
        }}>MirhaPret</a>

        <div style={{ zIndex: 1 }}>
          <div style={{ width: '48px', height: '1px', background: GOLD, marginBottom: '32px' }} />
          <h2 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 'clamp(2rem, 2.8vw, 3.2rem)',
            fontWeight: 600,
            color: '#fff', lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.5px',
          }}>
            Dressed to<br />Be Remembered.
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#666', lineHeight: 1.9, maxWidth: '300px', fontWeight: 300 }}>
            Sign in to access your orders, wishlist, and exclusive member offers.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '36px' }}>
            {['Exclusive access to new arrivals', 'Track orders & manage returns', 'Save favourites to your wishlist'].map((benefit, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '4px', height: '4px', background: GOLD, borderRadius: '50%', flexShrink: 0 }} />
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#666', fontWeight: 300 }}>{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#333', zIndex: 1, letterSpacing: '1px' }}>© 2026 MirhaPret</p>
      </div>

      {/* ─── Right Form Panel ─── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <div style={{ width: '36px', height: '1px', background: GOLD, marginBottom: '28px' }} />

          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: '#999', marginBottom: '12px', fontWeight: 600 }}>
            Welcome Back
          </p>
          <h1 style={{
            fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(2rem, 3vw, 2.8rem)',
            fontWeight: 600, letterSpacing: '-0.5px',
            color: '#0a0a0a', marginBottom: '8px', lineHeight: 1.1,
          }}>
            Sign In
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#888', marginBottom: '40px', fontWeight: 300 }}>
            New here?{' '}
            <a href="/register" style={{ color: '#0a0a0a', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Create an account</a>
          </p>

          {sessionExpired && (
            <div style={{ padding: '14px 18px', borderLeft: `3px solid ${GOLD}`, background: '#fffbf2', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#7a5c1a', marginBottom: '24px', fontWeight: 400 }}>
              Your session has expired. Please sign in again.
            </div>
          )}
          {error && (
            <div style={{ padding: '14px 18px', borderLeft: '3px solid #c0392b', background: '#fff5f5', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#c0392b', marginBottom: '24px' }}>
              {error}
            </div>
          )}
          {loading && (
            <div style={{ padding: '14px 18px', background: '#fafafa', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#888', marginBottom: '24px', textAlign: 'center', letterSpacing: '1px' }}>
              Signing you in…
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
            <div ref={buttonRef} style={{ width: '100%' }} />
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#bbb', textAlign: 'center', lineHeight: 1.8, fontWeight: 300 }}>
              By continuing you agree to our{' '}
              <a href="/terms" style={{ color: '#555', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Terms</a>
              {' '}and{' '}
              <a href="/privacy" style={{ color: '#555', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Privacy Policy</a>.
            </p>
          </div>

          <div style={{ marginTop: '44px', paddingTop: '28px', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
            <a href="/" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#aaa', textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase' }}>
              ← Continue as guest
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-brand-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
