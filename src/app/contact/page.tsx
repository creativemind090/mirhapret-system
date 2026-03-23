'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { FaInstagram, FaFacebookF, FaTiktok, FaWhatsapp, FaYoutube, FaPinterestP } from 'react-icons/fa';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[MirhaPret Contact] ${form.subject || 'Enquiry'}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`
    );
    window.location.href = `mailto:mirhapret@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

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
  };

  return (
    <div style={{ background: '#fff', color: '#000' }}>
      <SiteHeader />

      {/* ─── Page Hero ─────────────────────────────────────── */}
      <section style={{
        background: '#0e0e0e',
        color: '#fff',
        padding: '80px 60px',
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#c8a96e', fontWeight: 600, marginBottom: '20px' }}>
          We'd Love to Hear From You
        </p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.05, color: '#fff' }}>
          Get in Touch
        </h1>
      </section>

      {/* ─── Contact Body ──────────────────────────────────── */}
      <section className="home-section">
        <div className="contact-grid">

          {/* Left — info */}
          <div>
            <div style={{ width: '40px', height: '2px', background: '#c8a96e', marginBottom: '32px' }} />

            {[
              {
                icon: '✉',
                title: 'Email Us',
                lines: ['hello@mirhapret.com', 'support@mirhapret.com'],
                sub: 'We respond within 24 hours',
              },
              {
                icon: '☎',
                title: 'Call Us',
                lines: ['+92 321 000 0000'],
                sub: 'Mon – Sat, 10am – 7pm PKT',
              },
              {
                icon: '◎',
                title: 'Visit Us',
                lines: ['123 Fashion Street', 'DHA Phase 6, Lahore'],
                sub: 'By appointment preferred',
              },
              {
                icon: '◈',
                title: 'WhatsApp',
                lines: ['+92 321 000 0000'],
                sub: 'Fastest response guaranteed',
              },
            ].map((info, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '36px' }}>
                <span style={{ fontSize: '20px', color: '#c8a96e', marginTop: '2px', flexShrink: 0 }}>{info.icon}</span>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#000', marginBottom: '6px', letterSpacing: '0.3px' }}>{info.title}</p>
                  {info.lines.map((l, j) => (
                    <p key={j} style={{ fontSize: '14px', color: '#333', marginBottom: '2px' }}>{l}</p>
                  ))}
                  <p style={{ fontSize: '11px', color: '#bbb', marginTop: '4px' }}>{info.sub}</p>
                </div>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '32px', marginTop: '12px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#000', marginBottom: '16px' }}>
                Follow Us
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { icon: <FaInstagram size={18} />, href: 'https://www.instagram.com/mirhapret_official', label: 'Instagram', hoverColor: '#E1306C' },
                  { icon: <FaFacebookF size={18} />, href: 'https://www.facebook.com/mirhapret', label: 'Facebook', hoverColor: '#1877F2' },
                  { icon: <FaTiktok size={18} />, href: 'https://www.tiktok.com/@mirhapret', label: 'TikTok', hoverColor: '#010101' },
                  { icon: <FaYoutube size={18} />, href: 'https://www.youtube.com/@mirhapret', label: 'YouTube', hoverColor: '#FF0000' },
                  { icon: <FaPinterestP size={18} />, href: 'https://www.pinterest.com/mirhapret', label: 'Pinterest', hoverColor: '#E60023' },
                  { icon: <FaWhatsapp size={18} />, href: 'https://wa.me/923244577066', label: 'WhatsApp', hoverColor: '#25D366' },
                ].map(({ icon, href, label, hoverColor }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = hoverColor;
                      (e.currentTarget as HTMLElement).style.borderColor = hoverColor;
                      (e.currentTarget as HTMLElement).style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.borderColor = '#000';
                      (e.currentTarget as HTMLElement).style.color = '#000';
                    }}
                    style={{
                      width: '40px', height: '40px',
                      border: '1.5px solid #000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#000', textDecoration: 'none',
                      transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                    }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {submitted ? (
              <div style={{ padding: '60px 40px', background: '#fafafa', textAlign: 'center', borderTop: '3px solid #c8a96e' }}>
                <span style={{ fontSize: '32px', color: '#c8a96e', display: 'block', marginBottom: '16px' }}>✦</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Message Received</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7 }}>
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="contact-name-row">
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Ayesha Khan"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Subject *
                  </label>
                  <select
                    required
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="">Select a topic…</option>
                    <option>Order Enquiry</option>
                    <option>Returns & Exchanges</option>
                    <option>Product Question</option>
                    <option>Wholesale / Collaboration</option>
                    <option>Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help…"
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
                  />
                </div>

                <button type="submit" style={{
                  width: '100%',
                  padding: '16px',
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}>
                  Send Message
                </button>
                <p style={{ fontSize: '11px', color: '#bbb', marginTop: '12px', textAlign: 'center' }}>
                  We'll respond within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
