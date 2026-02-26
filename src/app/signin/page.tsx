'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/context/AuthContext';

export default function SignInPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [loginEmail, setLoginEmail] = useState('test@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (login(loginEmail, loginPassword)) {
      router.push('/');
    } else {
      setLoginError('Invalid email or password. Try test@example.com / password123');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    if (register(registerName, registerEmail, registerPassword)) {
      router.push('/');
    } else {
      setRegisterError('Email already exists');
    }
  };

  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Forgot password email:', forgotEmail);
    setForgotStep('otp');
  };

  const handleForgotOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Verify OTP:', forgotOtp);
    setForgotStep('reset');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reset password:', { email: forgotEmail, newPassword });
    setActiveTab('login');
    setForgotStep('email');
    setForgotEmail('');
    setForgotOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div style={{ background: '#ffffff', color: '#000000' }}>
      <PageHeader isScrolled={isScrolled} />

      <section
        style={{
          paddingTop: '120px',
          paddingBottom: '120px',
          paddingLeft: '60px',
          paddingRight: '60px',
          background: '#ffffff',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ maxWidth: '500px', width: '100%' }}>
          {/* Tabs */}
          {activeTab !== 'forgot' && (
            <div style={{ display: 'flex', gap: '0', marginBottom: '40px', borderBottom: '1px solid #e0e0e0' }}>
              <button
                onClick={() => setActiveTab('login')}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: activeTab === 'login' ? '#000000' : '#ffffff',
                  color: activeTab === 'login' ? '#ffffff' : '#000000',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: activeTab === 'register' ? '#000000' : '#ffffff',
                  color: activeTab === 'register' ? '#ffffff' : '#000000',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Register
              </button>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin}>
              {loginError && (
                <div style={{ marginBottom: '16px', padding: '12px', background: '#ffe0e0', border: '1px solid #c0392b', fontSize: '13px', color: '#c0392b' }}>
                  {loginError}
                </div>
              )}

              <div style={{ marginBottom: '16px', padding: '12px', background: '#f0f0f0', border: '1px solid #e0e0e0', fontSize: '12px', color: '#666666' }}>
                Demo credentials: test@example.com / password123
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    fontSize: '14px',
                    fontFamily: 'system-ui',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    fontSize: '14px',
                    fontFamily: 'system-ui',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#000000',
                  color: '#ffffff',
                  border: '1px solid #000000',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'system-ui',
                }}
              >
                Sign In
              </button>

              <p style={{ fontSize: '13px', color: '#666666', textAlign: 'center', marginTop: '16px' }}>
                Forgot your password?{' '}
                <button
                  onClick={() => setActiveTab('forgot')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#000000',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  Reset it here
                </button>
              </p>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister}>
              {registerError && (
                <div style={{ marginBottom: '16px', padding: '12px', background: '#ffe0e0', border: '1px solid #c0392b', fontSize: '13px', color: '#c0392b' }}>
                  {registerError}
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Your name"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    fontSize: '14px',
                    fontFamily: 'system-ui',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    fontSize: '14px',
                    fontFamily: 'system-ui',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    fontSize: '14px',
                    fontFamily: 'system-ui',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    fontSize: '14px',
                    fontFamily: 'system-ui',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#000000',
                  color: '#ffffff',
                  border: '1px solid #000000',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'system-ui',
                }}
              >
                Create Account
              </button>

              <p style={{ fontSize: '13px', color: '#666666', textAlign: 'center', marginTop: '16px' }}>
                By registering, you agree to our{' '}
                <a href="#" style={{ color: '#000000', fontWeight: 600, textDecoration: 'underline' }}>
                  Terms of Service
                </a>
              </p>
            </form>
          )}

          {/* Forgot Password Form */}
          {activeTab === 'forgot' && (
            <div>
              <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e0e0e0' }}>
                <button
                  onClick={() => {
                    setActiveTab('login');
                    setForgotStep('email');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#000000',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>←</span>
                  Back to Sign In
                </button>
              </div>

              {/* Step 1: Email */}
              {forgotStep === 'email' && (
                <form onSubmit={handleForgotEmailSubmit}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Reset Password</h2>
                  <p style={{ fontSize: '14px', color: '#666666', marginBottom: '24px' }}>
                    Enter your email address and we'll send you a code to reset your password.
                  </p>

                  <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="your@email.com"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                        fontFamily: 'system-ui',
                        boxSizing: 'border-box',
                      }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#000000',
                      color: '#ffffff',
                      border: '1px solid #000000',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'system-ui',
                    }}
                  >
                    Send Reset Code
                  </button>
                </form>
              )}

              {/* Step 2: OTP */}
              {forgotStep === 'otp' && (
                <form onSubmit={handleForgotOtpSubmit}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Verify Code</h2>
                  <p style={{ fontSize: '14px', color: '#666666', marginBottom: '24px' }}>
                    We've sent a verification code to {forgotEmail}. Enter it below.
                  </p>

                  <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        textAlign: 'center',
                        letterSpacing: '8px',
                        boxSizing: 'border-box',
                      }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#000000',
                      color: '#ffffff',
                      border: '1px solid #000000',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'system-ui',
                    }}
                  >
                    Verify Code
                  </button>

                  <button
                    type="button"
                    onClick={() => setForgotStep('email')}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#ffffff',
                      color: '#000000',
                      border: '1px solid #e0e0e0',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'system-ui',
                      marginTop: '12px',
                    }}
                  >
                    Didn't receive code? Try again
                  </button>
                </form>
              )}

              {/* Step 3: Reset Password */}
              {forgotStep === 'reset' && (
                <form onSubmit={handleResetPassword}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Create New Password</h2>
                  <p style={{ fontSize: '14px', color: '#666666', marginBottom: '24px' }}>
                    Enter your new password below.
                  </p>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                        fontFamily: 'system-ui',
                        boxSizing: 'border-box',
                      }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                        fontFamily: 'system-ui',
                        boxSizing: 'border-box',
                      }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#000000',
                      color: '#ffffff',
                      border: '1px solid #000000',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'system-ui',
                    }}
                  >
                    Reset Password
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '60px',
          background: '#1a1a1a',
          color: '#ffffff',
          borderTop: '1px solid #333333',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {[
            {
              title: 'Shop',
              links: ['All Collections', 'Premium Pret', 'Octa West', 'Desire', 'Sale'],
            },
            {
              title: 'Customer Care',
              links: ['Contact Us', 'Shipping Info', 'Returns & Exchanges', 'Size Guide', 'FAQ'],
            },
            {
              title: 'About',
              links: ['Our Story', 'Craftsmanship', 'Sustainability', 'Press', 'Careers'],
            },
            {
              title: 'Connect',
              links: ['Instagram', 'Facebook', 'TikTok', 'Pinterest', 'WhatsApp'],
            },
          ].map((section, idx) => (
            <div key={idx}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
                {section.title}
              </h4>
              <ul style={{ listStyle: 'none' }}>
                {section.links.map((link, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    <a
                      href="#"
                      style={{
                        fontSize: '0.9rem',
                        color: '#cccccc',
                        cursor: 'pointer',
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: '1px solid #333333',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.9rem',
            color: '#999999',
          }}
        >
          <p>© 2026 MirhaPret. All rights reserved. Celebrating the modern Pakistani woman.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ cursor: 'pointer' }}>
              Privacy Policy
            </a>
            <a href="#" style={{ cursor: 'pointer' }}>
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
