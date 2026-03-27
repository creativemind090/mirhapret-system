'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

declare global {
  interface Window {
    google?: any;
    handleGoogleCredential?: (response: any) => void;
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '739060573656-c33cm97hkntebqvili80b260s81sqhep.apps.googleusercontent.com';
const GOLD = '#c8a96e';
const DARK = '#080808';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle, isLoggedIn } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn) router.push('/');
  }, [isLoggedIn, router]);

  const handleCredentialResponse = async (response: any) => {
    setError('');
    setLoading(true);
    const result = await loginWithGoogle(response.credential);
    const trimmedPhone = phone.replace(/\s+/g, '').replace(/^0/, '');
    if (result.success && trimmedPhone) {
      try { await api.put('/users/profile', { phone: `+92${trimmedPhone}` }); } catch { /* non-critical */ }
    }
    setLoading(false);
    if (result.success) {
      router.push(searchParams.get('redirect') || '/');
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
        auto_select: false, cancel_on_tap_outside: true,
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
        <div style={{
          position: 'absolute', bottom: '-60px', right: '-30px',
          fontFamily: "'Cormorant', serif", fontSize: '22vw', fontWeight: 700,
          color: 'rgba(255,255,255,0.025)', lineHeight: 1,
          userSelect: 'none', letterSpacing: '-4px',
        }}>MP</div>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.035,
          backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <a href="/" style={{
          fontFamily: "'Cormorant', serif", fontSize: '26px', fontWeight: 700,
          letterSpacing: '3px', color: '#fff', textDecoration: 'none',
          textTransform: 'uppercase', zIndex: 1,
        }}>MirhaPret</a>

        <div style={{ zIndex: 1 }}>
          <div style={{ width: '48px', height: '1px', background: GOLD, marginBottom: '32px' }} />
          <h2 style={{
            fontFamily: "'Cormorant', serif",
            fontSize: 'clamp(2rem, 2.8vw, 3.2rem)',
            fontWeight: 600, fontStyle: 'italic',
            color: '#fff', lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.5px',
          }}>
            Your Style,<br />Your Story.
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#666', lineHeight: 1.9, maxWidth: '300px', fontWeight: 300 }}>
            Create an account to track orders, save your wishlist, and unlock exclusive member offers.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '36px' }}>
            {['Early access to new drops', 'Order tracking & history', 'Exclusive member offers'].map((benefit, i) => (
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
            New Member
          </p>
          <h1 style={{
            fontFamily: "'Cormorant', serif",
            fontSize: 'clamp(2rem, 3vw, 2.8rem)',
            fontWeight: 600, fontStyle: 'italic', letterSpacing: '-0.5px',
            color: '#0a0a0a', marginBottom: '8px', lineHeight: 1.1,
          }}>
            Join MirhaPret
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#888', marginBottom: '40px', fontWeight: 300 }}>
            Already have an account?{' '}
            <a href="/signin" style={{ color: '#0a0a0a', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Sign in</a>
          </p>

          {error && (
            <div style={{ padding: '14px 18px', borderLeft: '3px solid #c0392b', background: '#fff5f5', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#c0392b', marginBottom: '24px' }}>
              {error}
            </div>
          )}
          {loading && (
            <div style={{ padding: '14px 18px', background: '#fafafa', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#888', marginBottom: '24px', textAlign: 'center', letterSpacing: '1px' }}>
              Setting up your account…
            </div>
          )}

          {/* Phone field */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '10px' }}>
              Phone Number <span style={{ color: '#bbb', fontWeight: 400 }}>(optional)</span>
            </label>
            <div style={{ display: 'flex', border: phoneError ? '1.5px solid #c0392b' : '1.5px solid #e0e0e0', background: '#fff', transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 14px', borderRight: '1px solid #f0f0f0', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <img src="https://flagcdn.com/w20/pk.png" srcSet="https://flagcdn.com/w40/pk.png 2x" width="20" height="14" alt="Pakistan" style={{ display: 'block', objectFit: 'cover' }} />
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#444', fontWeight: 500 }}>+92</span>
              </div>
              <input
                type="tel" value={phone}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setPhoneError(''); }}
                placeholder="3001234567" maxLength={10}
                style={{ flex: 1, padding: '14px', border: 'none', outline: 'none', fontSize: '14px', fontFamily: "'Montserrat', sans-serif", background: 'transparent', color: '#000' }}
              />
            </div>
            {phoneError && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#c0392b', marginTop: '6px' }}>{phoneError}</p>}
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#bbb', marginTop: '8px', fontWeight: 300, lineHeight: 1.6 }}>
              Used for order updates and delivery coordination.
            </p>
          </div>

          {/* Google button */}
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
