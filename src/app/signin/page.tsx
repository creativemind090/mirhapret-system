'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  border: '1.5px solid #e8e8e8',
  background: '#fff',
  color: '#000',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  marginBottom: '16px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  marginBottom: '8px',
  color: '#000',
};

const primaryBtn: React.CSSProperties = {
  width: '100%',
  padding: '15px',
  background: '#000',
  color: '#fff',
  border: 'none',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  cursor: 'pointer',
  marginTop: '8px',
};

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div style={{ padding: '12px 16px', background: '#fff0f0', borderLeft: '3px solid #c0392b', fontSize: '13px', color: '#c0392b', marginBottom: '20px' }}>
      {msg}
    </div>
  );
}

function SuccessBox({ msg }: { msg: string }) {
  return (
    <div style={{ padding: '12px 16px', background: '#f0fff4', borderLeft: '3px solid #27ae60', fontSize: '13px', color: '#27ae60', marginBottom: '20px' }}>
      {msg}
    </div>
  );
}

export default function SignInPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register
  const [regFirst, setRegFirst] = useState('');
  const [regLast, setRegLast] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Forgot
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoginLoading(false);
    if (result.success) router.push('/');
    else setLoginError(result.error || 'Invalid email or password');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (regPassword !== regConfirm) { setRegError('Passwords do not match'); return; }
    setRegLoading(true);
    const result = await register(regFirst, regLast, regEmail, regPassword);
    setRegLoading(false);
    if (result.success) router.push('/');
    else setRegError(result.error || 'Registration failed');
  };

  const handleForgotEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotStep('otp');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Something went wrong.';
      setForgotError(Array.isArray(msg) ? msg[0] : msg);
    } finally { setForgotLoading(false); }
  };

  const handleForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotOtp.length !== 6) { setForgotError('Please enter the 6-digit code'); return; }
    setForgotError('');
    setForgotStep('reset');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    if (newPassword !== confirmNewPassword) { setForgotError('Passwords do not match'); return; }
    setForgotLoading(true);
    try {
      await api.post('/auth/reset-password', { email: forgotEmail, token: forgotOtp, new_password: newPassword });
      setForgotSuccess('Password reset successfully! Redirecting to sign in…');
      setTimeout(() => {
        setActiveTab('login');
        setForgotStep('email');
        setForgotEmail(''); setForgotOtp(''); setNewPassword(''); setConfirmNewPassword(''); setForgotSuccess('');
      }, 2000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to reset password.';
      setForgotError(Array.isArray(msg) ? msg[0] : msg);
    } finally { setForgotLoading(false); }
  };

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

      {/* ─── Right — Form ───────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          {/* Tab switcher (login / register) */}
          {activeTab !== 'forgot' && (
            <>
              <div style={{ display: 'flex', gap: '0', marginBottom: '40px', borderBottom: '1.5px solid #e8e8e8' }}>
                {(['login', 'register'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: 'transparent',
                      color: activeTab === tab ? '#000' : '#bbb',
                      border: 'none',
                      borderBottom: activeTab === tab ? '2px solid #000' : '2px solid transparent',
                      marginBottom: '-1.5px',
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {tab === 'login' ? 'Sign In' : 'Register'}
                  </button>
                ))}
              </div>

              {/* ── Login ── */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '32px' }}>Welcome back</h1>
                  {loginError && <ErrorBox msg={loginError} />}
                  <label style={labelStyle}>Email</label>
                  <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
                  <label style={labelStyle}>Password</label>
                  <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
                  <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '24px' }}>
                    <button onClick={() => setActiveTab('forgot')} type="button" style={{ background: 'none', border: 'none', fontSize: '12px', color: '#666', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
                      Forgot password?
                    </button>
                  </div>
                  <button type="submit" disabled={loginLoading} style={{ ...primaryBtn, opacity: loginLoading ? 0.6 : 1 }}>
                    {loginLoading ? 'Signing In…' : 'Sign In'}
                  </button>
                </form>
              )}

              {/* ── Register ── */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '32px' }}>Create Account</h1>
                  {regError && <ErrorBox msg={regError} />}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={labelStyle}>First Name</label>
                      <input type="text" required value={regFirst} onChange={e => setRegFirst(e.target.value)} placeholder="Ayesha" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Last Name</label>
                      <input type="text" value={regLast} onChange={e => setRegLast(e.target.value)} placeholder="Khan" style={inputStyle} />
                    </div>
                  </div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
                  <label style={labelStyle}>Password</label>
                  <input type="password" required value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
                  <label style={labelStyle}>Confirm Password</label>
                  <input type="password" required value={regConfirm} onChange={e => setRegConfirm(e.target.value)} placeholder="••••••••" style={inputStyle} />
                  <button type="submit" disabled={regLoading} style={{ ...primaryBtn, opacity: regLoading ? 0.6 : 1 }}>
                    {regLoading ? 'Creating Account…' : 'Create Account'}
                  </button>
                  <p style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', marginTop: '16px' }}>
                    By registering you agree to our <a href="#" style={{ color: '#000', textDecoration: 'underline' }}>Terms of Service</a>
                  </p>
                </form>
              )}
            </>
          )}

          {/* ── Forgot Password ── */}
          {activeTab === 'forgot' && (
            <div>
              <button onClick={() => { setActiveTab('login'); setForgotStep('email'); }} style={{ background: 'none', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontFamily: 'inherit', color: '#000' }}>
                ← Back to Sign In
              </button>

              {forgotStep === 'email' && (
                <form onSubmit={handleForgotEmail}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '12px' }}>Reset Password</h1>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '28px', lineHeight: 1.7 }}>Enter your email and we'll send a 6-digit reset code.</p>
                  {forgotError && <ErrorBox msg={forgotError} />}
                  <label style={labelStyle}>Email</label>
                  <input type="email" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
                  <button type="submit" disabled={forgotLoading} style={{ ...primaryBtn, opacity: forgotLoading ? 0.6 : 1 }}>
                    {forgotLoading ? 'Sending…' : 'Send Reset Code'}
                  </button>
                </form>
              )}

              {forgotStep === 'otp' && (
                <form onSubmit={handleForgotOtp}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '12px' }}>Verify Code</h1>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '28px', lineHeight: 1.7 }}>
                    We sent a code to <strong>{forgotEmail}</strong>. Enter it below.
                  </p>
                  {forgotError && <ErrorBox msg={forgotError} />}
                  <label style={labelStyle}>6-Digit Code</label>
                  <input type="text" required maxLength={6} value={forgotOtp} onChange={e => setForgotOtp(e.target.value)} placeholder="000000" style={{ ...inputStyle, textAlign: 'center', letterSpacing: '8px', fontSize: '20px', fontFamily: 'monospace' }} />
                  <button type="submit" style={primaryBtn}>Verify Code</button>
                  <button type="button" onClick={() => setForgotStep('email')} style={{ ...primaryBtn, background: '#fff', color: '#000', border: '1.5px solid #e8e8e8', marginTop: '12px' }}>
                    Resend Code
                  </button>
                </form>
              )}

              {forgotStep === 'reset' && (
                <form onSubmit={handleResetPassword}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '12px' }}>New Password</h1>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '28px', lineHeight: 1.7 }}>Create a strong new password for your account.</p>
                  {forgotError && <ErrorBox msg={forgotError} />}
                  {forgotSuccess && <SuccessBox msg={forgotSuccess} />}
                  <label style={labelStyle}>New Password</label>
                  <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
                  <label style={labelStyle}>Confirm Password</label>
                  <input type="password" required value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
                  <button type="submit" disabled={forgotLoading} style={{ ...primaryBtn, opacity: forgotLoading ? 0.6 : 1 }}>
                    {forgotLoading ? 'Resetting…' : 'Reset Password'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
