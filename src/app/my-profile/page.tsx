'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

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
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      router.push('/signin');
    }
  }, [isLoggedIn, isLoading, router]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!isLoggedIn) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get('/users/profile');
        const profile = res.data.data ?? res.data;
        setFormData({
          first_name: profile.first_name ?? '',
          last_name: profile.last_name ?? '',
          email: profile.email ?? '',
          phone: profile.phone ?? '',
        });
        setEmailNotif(profile.email_notifications ?? true);
        setNewsletter(profile.newsletter_subscribed ?? false);
      } catch {
        // fallback to auth context user
        if (user) {
          setFormData({
            first_name: user.first_name ?? '',
            last_name: user.last_name ?? '',
            email: user.email ?? '',
            phone: user.phone ?? '',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      await api.put('/users/profile', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone || undefined,
      });
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.response?.data?.message ?? 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrefToggle = async (key: 'email_notifications' | 'newsletter_subscribed', value: boolean) => {
    if (key === 'email_notifications') setEmailNotif(value);
    else setNewsletter(value);
    setPrefSaving(true);
    try {
      await api.put('/users/preferences', { [key]: value });
    } catch {
      // revert on failure
      if (key === 'email_notifications') setEmailNotif(!value);
      else setNewsletter(!value);
    } finally {
      setPrefSaving(false);
    }
  };

  return (
    <div style={{ background: '#ffffff', color: '#000000' }}>
      <PageHeader isScrolled={false} />

      <section
        style={{
          paddingTop: '120px',
          paddingBottom: '120px',
          paddingLeft: '60px',
          paddingRight: '60px',
          background: '#ffffff',
          minHeight: '100vh',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '60px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.5px', margin: '0 0 8px' }}>
              My Profile
            </h1>
            <p style={{ fontSize: '14px', color: '#666666', margin: 0 }}>
              Manage your account information
            </p>
          </div>

          {saveSuccess && (
            <div style={{ marginBottom: '24px', padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '14px' }}>
              Profile updated successfully.
            </div>
          )}
          {saveError && (
            <div style={{ marginBottom: '24px', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '14px' }}>
              {saveError}
            </div>
          )}

          {/* Personal Information */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                Personal Information
              </h2>
              <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999999', marginBottom: '8px' }}>
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 0',
                      border: 'none',
                      borderBottom: '1px solid #000000',
                      fontSize: '15px',
                      fontFamily: 'system-ui',
                      boxSizing: 'border-box',
                      background: 'transparent',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <p style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>{formData.first_name || '—'}</p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999999', marginBottom: '8px' }}>
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 0',
                      border: 'none',
                      borderBottom: '1px solid #000000',
                      fontSize: '15px',
                      fontFamily: 'system-ui',
                      boxSizing: 'border-box',
                      background: 'transparent',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <p style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>{formData.last_name || '—'}</p>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999999', marginBottom: '8px' }}>
                Email Address
              </label>
              <p style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: '#666666' }}>{formData.email}</p>
              <p style={{ fontSize: '11px', color: '#999999', margin: '6px 0 0' }}>Cannot be changed</p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999999', marginBottom: '8px' }}>
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+92 300 0000000"
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    border: 'none',
                    borderBottom: '1px solid #000000',
                    fontSize: '15px',
                    fontFamily: 'system-ui',
                    boxSizing: 'border-box',
                    background: 'transparent',
                    outline: 'none',
                  }}
                />
              ) : (
                <p style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: formData.phone ? '#000000' : '#999999' }}>
                  {formData.phone || 'Not provided'}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {isEditing ? (
              <>
                <button
                  onClick={() => { setIsEditing(false); setSaveError(''); }}
                  style={{
                    padding: '14px 32px',
                    background: '#ffffff',
                    color: '#000000',
                    border: '1px solid #e0e0e0',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'system-ui',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    padding: '14px 32px',
                    background: '#000000',
                    color: '#ffffff',
                    border: '1px solid #000000',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    fontFamily: 'system-ui',
                    opacity: isSaving ? 0.6 : 1,
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '14px 32px',
                  background: '#000000',
                  color: '#ffffff',
                  border: '1px solid #000000',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'system-ui',
                }}
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Settings Section */}
          <div style={{ marginTop: '60px', paddingTop: '60px', borderTop: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                Settings
              </h2>
              <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
            </div>

            {prefSaving && (
              <p style={{ fontSize: '11px', color: '#999', marginBottom: '8px' }}>Saving preference…</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { key: 'email_notifications' as const, label: 'Receive Notifications via Email', desc: 'Get updates about your orders and promotions', value: emailNotif },
                { key: 'newsletter_subscribed' as const, label: 'Subscribe to Newsletter', desc: 'Stay updated with latest collections and offers', value: newsletter },
              ].map(({ key, label, desc, value }) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid #e0e0e0' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>{label}</p>
                    <p style={{ fontSize: '12px', color: '#666666', margin: 0 }}>{desc}</p>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', width: '50px', height: '28px' }}>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handlePrefToggle(key, e.target.checked)}
                      disabled={prefSaving}
                      style={{ appearance: 'none', width: '100%', height: '100%', background: value ? '#000000' : '#e0e0e0', border: 'none', borderRadius: '14px', cursor: prefSaving ? 'not-allowed' : 'pointer', position: 'relative' }}
                    />
                    <div style={{ position: 'absolute', width: '24px', height: '24px', background: '#ffffff', borderRadius: '50%', right: value ? '2px' : undefined, left: value ? undefined : '2px', top: '2px', pointerEvents: 'none' }} />
                  </label>
                </div>
              ))}
            </div>
          </div>
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
            { title: 'Shop', links: ['All Collections', 'Premium Pret', 'Octa West', 'Desire', 'Sale'] },
            { title: 'Customer Care', links: ['Contact Us', 'Shipping Info', 'Returns & Exchanges', 'Size Guide', 'FAQ'] },
            { title: 'About', links: ['Our Story', 'Craftsmanship', 'Sustainability', 'Press', 'Careers'] },
            { title: 'Connect', links: ['Instagram', 'Facebook', 'TikTok', 'Pinterest', 'WhatsApp'] },
          ].map((section, idx) => (
            <div key={idx}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>{section.title}</h4>
              <ul style={{ listStyle: 'none' }}>
                {section.links.map((link, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    <a href="#" style={{ fontSize: '0.9rem', color: '#cccccc', cursor: 'pointer' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #333333', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#999999' }}>
          <p>© 2026 MirhaPret. All rights reserved. Celebrating the modern Pakistani woman.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ cursor: 'pointer' }}>Privacy Policy</a>
            <a href="#" style={{ cursor: 'pointer' }}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
