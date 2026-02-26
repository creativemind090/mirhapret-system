'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/context/AuthContext';

export default function MyProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    province: '',
    billingAddress: '',
    billingCity: '',
    billingProvince: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        router.push('/signin');
      }
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Saving profile:', formData);
    setIsEditing(false);
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
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '60px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.5px', margin: '0 0 8px' }}>
              My Profile
            </h1>
            <p style={{ fontSize: '14px', color: '#666666', margin: 0 }}>
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
            {/* Left Column */}
            <div>
              {/* Personal Information */}
              <div style={{ marginBottom: '60px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                    Personal Information
                  </h2>
                  <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999999', marginBottom: '8px' }}>
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px 0',
                          border: 'none',
                          borderBottom: '1px solid #e0e0e0',
                          fontSize: '15px',
                          fontFamily: 'system-ui',
                          boxSizing: 'border-box',
                          background: 'transparent',
                        }}
                      />
                    ) : (
                      <p style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>{formData.name}</p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999999', marginBottom: '8px' }}>
                      Email Address
                    </label>
                    <p style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: '#666666' }}>{formData.email}</p>
                    <p style={{ fontSize: '11px', color: '#999999', margin: '6px 0 0' }}>Cannot be changed</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                    Contact Information
                  </h2>
                  <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
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
                      placeholder="Your phone number"
                      style={{
                        width: '100%',
                        padding: '12px 0',
                        border: 'none',
                        borderBottom: '1px solid #e0e0e0',
                        fontSize: '15px',
                        fontFamily: 'system-ui',
                        boxSizing: 'border-box',
                        background: 'transparent',
                      }}
                    />
                  ) : (
                    <p style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: formData.phone ? '#000000' : '#999999' }}>
                      {formData.phone || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                  Shipping Address
                </h2>
                <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '60px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999999', marginBottom: '8px' }}>
                    Street Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Your street address"
                      style={{
                        width: '100%',
                        padding: '12px 0',
                        border: 'none',
                        borderBottom: '1px solid #e0e0e0',
                        fontSize: '15px',
                        fontFamily: 'system-ui',
                        boxSizing: 'border-box',
                        background: 'transparent',
                      }}
                    />
                  ) : (
                    <p style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: formData.address ? '#000000' : '#999999' }}>
                      {formData.address || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999999', marginBottom: '8px' }}>
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Your city"
                      style={{
                        width: '100%',
                        padding: '12px 0',
                        border: 'none',
                        borderBottom: '1px solid #e0e0e0',
                        fontSize: '15px',
                        fontFamily: 'system-ui',
                        boxSizing: 'border-box',
                        background: 'transparent',
                      }}
                    />
                  ) : (
                    <p style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: formData.city ? '#000000' : '#999999' }}>
                      {formData.city || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999999', marginBottom: '8px' }}>
                    Province
                  </label>
                  {isEditing ? (
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 0',
                        border: 'none',
                        borderBottom: '1px solid #e0e0e0',
                        fontSize: '15px',
                        fontFamily: 'system-ui',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                        background: 'transparent',
                      }}
                    >
                      <option value="">Select Province</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                      <option value="Azad Jammu and Kashmir">Azad Jammu and Kashmir</option>
                      <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                    </select>
                  ) : (
                    <p style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: formData.province ? '#000000' : '#999999' }}>
                      {formData.province || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                    Billing Address
                  </h2>
                  <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999999', marginBottom: '8px' }}>
                      Street Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleInputChange}
                        placeholder="Your billing street address"
                        style={{
                          width: '100%',
                          padding: '12px 0',
                          border: 'none',
                          borderBottom: '1px solid #e0e0e0',
                          fontSize: '15px',
                          fontFamily: 'system-ui',
                          boxSizing: 'border-box',
                          background: 'transparent',
                        }}
                      />
                    ) : (
                      <p style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: formData.billingAddress ? '#000000' : '#999999' }}>
                        {formData.billingAddress || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999999', marginBottom: '8px' }}>
                      City
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleInputChange}
                        placeholder="Your billing city"
                        style={{
                          width: '100%',
                          padding: '12px 0',
                          border: 'none',
                          borderBottom: '1px solid #e0e0e0',
                          fontSize: '15px',
                          fontFamily: 'system-ui',
                          boxSizing: 'border-box',
                          background: 'transparent',
                        }}
                      />
                    ) : (
                      <p style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: formData.billingCity ? '#000000' : '#999999' }}>
                        {formData.billingCity || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999999', marginBottom: '8px' }}>
                      Province
                    </label>
                    {isEditing ? (
                      <select
                        name="billingProvince"
                        value={formData.billingProvince}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px 0',
                          border: 'none',
                          borderBottom: '1px solid #e0e0e0',
                          fontSize: '15px',
                          fontFamily: 'system-ui',
                          boxSizing: 'border-box',
                          cursor: 'pointer',
                          background: 'transparent',
                        }}
                      >
                        <option value="">Select Province</option>
                        <option value="Sindh">Sindh</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                        <option value="Azad Jammu and Kashmir">Azad Jammu and Kashmir</option>
                        <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                      </select>
                    ) : (
                      <p style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: formData.billingProvince ? '#000000' : '#999999' }}>
                        {formData.billingProvince || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: '40px', display: 'flex', gap: '12px' }}>
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
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
                  Save Changes
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Receive Notifications */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid #e0e0e0' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>Receive Notifications via Email</p>
                  <p style={{ fontSize: '12px', color: '#666666', margin: 0 }}>Get updates about your orders and promotions</p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', width: '50px', height: '28px' }}>
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    style={{
                      appearance: 'none',
                      width: '100%',
                      height: '100%',
                      background: '#000000',
                      border: 'none',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      width: '24px',
                      height: '24px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      right: '2px',
                      top: '2px',
                      pointerEvents: 'none',
                    }}
                  />
                </label>
              </div>

              {/* Subscribe to Newsletter */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>Subscribe to Newsletter</p>
                  <p style={{ fontSize: '12px', color: '#666666', margin: 0 }}>Stay updated with latest collections and offers</p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', width: '50px', height: '28px' }}>
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    style={{
                      appearance: 'none',
                      width: '100%',
                      height: '100%',
                      background: '#e0e0e0',
                      border: 'none',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      width: '24px',
                      height: '24px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      left: '2px',
                      top: '2px',
                      pointerEvents: 'none',
                    }}
                  />
                </label>
              </div>
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
