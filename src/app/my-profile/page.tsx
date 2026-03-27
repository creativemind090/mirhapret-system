'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const GOLD = '#c8a96e';
const DARK = '#080808';
const CREAM = '#FAFAF8';

const fieldLabel: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700,
  letterSpacing: '2.5px', textTransform: 'uppercase', color: '#aaa',
  display: 'block', marginBottom: '10px',
};

export default function MyProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [prefSaving, setPrefSaving] = useState(false);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '' });

  useEffect(() => {
    if (!isLoggedIn && !isLoading) router.push('/signin');
  }, [isLoggedIn, isLoading, router]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!isLoggedIn) { setIsLoading(false); return; }
      try {
        const res = await api.get('/users/profile');
        const profile = res.data.data ?? res.data;
        setFormData({ first_name: profile.first_name ?? '', last_name: profile.last_name ?? '', email: profile.email ?? '', phone: profile.phone ?? '' });
        setEmailNotif(profile.email_notifications ?? true);
        setNewsletter(profile.newsletter_subscribed ?? false);
      } catch {
        if (user) setFormData({ first_name: user.first_name ?? '', last_name: user.last_name ?? '', email: user.email ?? '', phone: user.phone ?? '' });
      } finally { setIsLoading(false); }
    };
    loadProfile();
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || !isLoggedIn) return null;

  const handleSave = async () => {
    setIsSaving(true); setSaveError(''); setSaveSuccess(false);
    try {
      await api.put('/users/profile', { first_name: formData.first_name, last_name: formData.last_name, phone: formData.phone || undefined });
      setSaveSuccess(true); setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.response?.data?.message ?? 'Failed to save changes');
    } finally { setIsSaving(false); }
  };

  const handlePrefToggle = async (key: 'email_notifications' | 'newsletter_subscribed', value: boolean) => {
    if (key === 'email_notifications') setEmailNotif(value); else setNewsletter(value);
    setPrefSaving(true);
    try { await api.put('/users/preferences', { [key]: value }); }
    catch { if (key === 'email_notifications') setEmailNotif(!value); else setNewsletter(!value); }
    finally { setPrefSaving(false); }
  };

  const editInput = (name: string, value: string, type = 'text', placeholder = '') => (
    <input type={type} name={name} value={value} placeholder={placeholder}
      onChange={e => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
      style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: `1px solid ${DARK}`, fontFamily: "'Montserrat', sans-serif", fontSize: '14px', boxSizing: 'border-box', background: 'transparent', outline: 'none', color: '#0a0a0a' }} />
  );

  return (
    <div style={{ background: CREAM, color: '#0a0a0a', minHeight: '100vh' }}>
      <PageHeader isScrolled={false} />

      <section style={{ paddingTop: '120px', paddingBottom: '100px', paddingLeft: 'clamp(20px,6vw,80px)', paddingRight: 'clamp(20px,6vw,80px)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '56px' }}>
            <div style={{ width: '36px', height: '1px', background: GOLD, marginBottom: '20px' }} />
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, marginBottom: '10px', fontWeight: 600 }}>Account</p>
            <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 600, fontStyle: 'italic', letterSpacing: '-0.5px', margin: '0 0 8px' }}>
              My Profile
            </h1>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#888', fontWeight: 300 }}>Manage your account information</p>
          </div>

          {saveSuccess && (
            <div style={{ marginBottom: '24px', padding: '14px 18px', borderLeft: `3px solid #1a7a4a`, background: '#f0fdf4', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#166534' }}>
              Profile updated successfully.
            </div>
          )}
          {saveError && (
            <div style={{ marginBottom: '24px', padding: '14px 18px', borderLeft: '3px solid #c0392b', background: '#fff5f5', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#c0392b' }}>
              {saveError}
            </div>
          )}

          {/* Personal Information */}
          <div style={{ background: '#fff', border: '1px solid #e8e4e0', padding: '40px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px' }}>
              <div style={{ width: '24px', height: '1px', background: GOLD }} />
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#888', margin: 0 }}>Personal Information</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '28px' }}>
              <div>
                <label style={fieldLabel}>First Name</label>
                {isEditing ? editInput('first_name', formData.first_name) : (
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', fontWeight: 500, margin: 0 }}>{formData.first_name || '—'}</p>
                )}
              </div>
              <div>
                <label style={fieldLabel}>Last Name</label>
                {isEditing ? editInput('last_name', formData.last_name) : (
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', fontWeight: 500, margin: 0 }}>{formData.last_name || '—'}</p>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={fieldLabel}>Email Address</label>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#888', margin: '0 0 4px', fontWeight: 300 }}>{formData.email}</p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#ccc', margin: 0, letterSpacing: '0.5px', fontWeight: 300 }}>Cannot be changed</p>
            </div>

            <div>
              <label style={fieldLabel}>Phone Number</label>
              {isEditing ? editInput('phone', formData.phone, 'tel', '+92 300 0000000') : (
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', fontWeight: 500, margin: 0, color: formData.phone ? '#0a0a0a' : '#bbb' }}>
                  {formData.phone || 'Not provided'}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '48px' }}>
            {isEditing ? (
              <>
                <button onClick={() => { setIsEditing(false); setSaveError(''); }}
                  style={{ padding: '13px 28px', background: '#fff', color: '#555', border: '1px solid #e0dcd8', fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving}
                  style={{ padding: '13px 28px', background: DARK, color: '#fff', border: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.6 : 1 }}>
                  {isSaving ? 'Saving…' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)}
                style={{ padding: '13px 28px', background: DARK, color: '#fff', border: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>
                Edit Profile
              </button>
            )}
          </div>

          {/* Settings */}
          <div style={{ background: '#fff', border: '1px solid #e8e4e0', padding: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ width: '24px', height: '1px', background: GOLD }} />
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#888', margin: 0 }}>Preferences</h2>
            </div>

            {prefSaving && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#bbb', marginBottom: '12px', letterSpacing: '1px' }}>Saving…</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { key: 'email_notifications' as const, label: 'Email Notifications', desc: 'Order updates and promotions', value: emailNotif },
                { key: 'newsletter_subscribed' as const, label: 'Newsletter', desc: 'Latest collections and exclusive offers', value: newsletter },
              ].map(({ key, label, desc, value }, i, arr) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: i < arr.length - 1 ? '1px solid #f0ece8' : 'none' }}>
                  <div>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 500, margin: '0 0 3px' }}>{label}</p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#bbb', margin: 0, fontWeight: 300 }}>{desc}</p>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', width: '48px', height: '26px', flexShrink: 0 }}>
                    <input type="checkbox" checked={value} onChange={e => handlePrefToggle(key, e.target.checked)} disabled={prefSaving}
                      style={{ appearance: 'none', width: '100%', height: '100%', background: value ? DARK : '#e0dcd8', border: 'none', borderRadius: '13px', cursor: prefSaving ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }} />
                    <div style={{ position: 'absolute', width: '22px', height: '22px', background: value ? GOLD : '#fff', borderRadius: '50%', right: value ? '2px' : undefined, left: value ? undefined : '2px', top: '2px', pointerEvents: 'none', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
