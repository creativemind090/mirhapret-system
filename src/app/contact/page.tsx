'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { FaInstagram, FaFacebookF, FaTiktok, FaWhatsapp, FaYoutube, FaPinterestP } from 'react-icons/fa';

const GOLD = '#c8a96e';
const DARK = '#080808';
const CREAM = '#FAFAF8';

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '9px', fontWeight: 700,
  letterSpacing: '2.5px', textTransform: 'uppercase',
  color: '#aaa', marginBottom: '10px',
};

const inp: React.CSSProperties = {
  width: '100%', padding: '12px 0',
  border: 'none', borderBottom: `1px solid #d0ccc8`,
  background: 'transparent', color: '#0a0a0a',
  fontSize: '14px', fontFamily: "'Montserrat', sans-serif",
  outline: 'none', boxSizing: 'border-box',
};

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

  const infoItems = [
    {
      title: 'Email Us',
      lines: ['mirhapret@gmail.com'],
      sub: 'We respond within 24 hours',
    },
    {
      title: 'Phone',
      lines: ['+92 324 457 7066'],
      sub: 'Mon – Sat, 10am – 7pm PKT',
    },
    {
      title: 'Location',
      lines: ['Lahore, Pakistan'],
      sub: 'By appointment preferred',
    },
    {
      title: 'WhatsApp',
      lines: ['+92 324 457 7066'],
      sub: 'Fastest response guaranteed',
    },
  ];

  return (
    <div style={{ background: CREAM, color: '#0a0a0a' }}>
      <SiteHeader />

      {/* ─── Hero ─── */}
      <section style={{
        background: DARK, color: '#fff',
        padding: 'clamp(80px,10vw,120px) clamp(24px,6vw,80px) clamp(60px,8vw,96px)',
        minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: '36px', height: '1px', background: GOLD, marginBottom: '24px' }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, fontWeight: 600, marginBottom: '16px' }}>
            We&apos;d Love to Hear From You
          </p>
          <h1 style={{
            fontFamily: "'Cormorant', serif",
            fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
            fontWeight: 600, fontStyle: 'italic',
            letterSpacing: '-1px', lineHeight: 1.05, color: '#fff', margin: 0,
          }}>
            Get in Touch
          </h1>
        </div>
      </section>

      {/* ─── Contact Body ─── */}
      <section className="home-section" style={{ background: '#fff' }}>
        <div className="contact-grid">

          {/* Left — info */}
          <div>
            <div style={{ width: '36px', height: '1px', background: GOLD, marginBottom: '36px' }} />

            {infoItems.filter(info => info.title !== 'Phone' && info.title !== 'Location').map((info, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '36px', alignItems: 'flex-start' }}>
                <div style={{ width: '6px', height: '6px', background: GOLD, transform: 'rotate(45deg)', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '8px' }}>{info.title}</p>
                  {info.lines.map((l, j) => (
                    <p key={j} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: DARK, marginBottom: '2px', fontWeight: 400 }}>{l}</p>
                  ))}
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#bbb', marginTop: '4px', fontWeight: 300 }}>{info.sub}</p>
                </div>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #ece8e3', paddingTop: '32px', marginTop: '8px' }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#aaa', marginBottom: '16px' }}>
                Follow Us
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { icon: <FaInstagram size={14} />, href: 'https://www.instagram.com/mirhapret_official', label: 'Instagram', hoverColor: '#E1306C' },
                  { icon: <FaFacebookF size={14} />, href: 'https://www.facebook.com/mirhapret', label: 'Facebook', hoverColor: '#1877F2' },
                  { icon: <FaTiktok size={14} />, href: 'https://www.tiktok.com/@mirhapret', label: 'TikTok', hoverColor: '#010101' },
                  { icon: <FaYoutube size={14} />, href: 'https://www.youtube.com/@mirhapret', label: 'YouTube', hoverColor: '#FF0000' },
                  { icon: <FaPinterestP size={14} />, href: 'https://www.pinterest.com/mirhapret', label: 'Pinterest', hoverColor: '#E60023' },
                  { icon: <FaWhatsapp size={14} />, href: 'https://wa.me/923244577066', label: 'WhatsApp', hoverColor: '#25D366' },
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
                      (e.currentTarget as HTMLElement).style.borderColor = '#d0ccc8';
                      (e.currentTarget as HTMLElement).style.color = '#888';
                    }}
                    style={{
                      width: '38px', height: '38px',
                      border: '1px solid #d0ccc8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#888', textDecoration: 'none',
                      transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                      cursor: 'pointer',
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
              <div style={{ padding: '60px 40px', background: CREAM, textAlign: 'center', borderTop: `3px solid ${GOLD}` }}>
                <div style={{ width: '36px', height: '1px', background: GOLD, margin: '0 auto 28px' }} />
                <h3 style={{
                  fontFamily: "'Cormorant', serif",
                  fontSize: '2rem', fontWeight: 600, fontStyle: 'italic',
                  letterSpacing: '-0.3px', marginBottom: '12px', color: DARK,
                }}>Message Received</h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#888', lineHeight: 1.8, fontWeight: 300 }}>
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div className="contact-name-row">
                  <div>
                    <label style={fieldLabel}>Your Name *</label>
                    <input type="text" required value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Ayesha Khan" style={inp} />
                  </div>
                  <div>
                    <label style={fieldLabel}>Email Address *</label>
                    <input type="email" required value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com" style={inp} />
                  </div>
                </div>

                <div>
                  <label style={fieldLabel}>Subject *</label>
                  <select required value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    style={{ ...inp, cursor: 'pointer', appearance: 'none' }}>
                    <option value="">Select a topic…</option>
                    <option>Order Enquiry</option>
                    <option>Returns & Exchanges</option>
                    <option>Product Question</option>
                    <option>Wholesale / Collaboration</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label style={fieldLabel}>Message *</label>
                  <textarea required rows={5} value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help…"
                    style={{ ...inp, resize: 'vertical', lineHeight: 1.7 }} />
                </div>

                <div>
                  <button type="submit" style={{
                    width: '100%', padding: '15px',
                    background: DARK, color: '#fff', border: 'none',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '10px', fontWeight: 700,
                    letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer',
                  }}>
                    Send Message
                  </button>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#bbb', marginTop: '12px', textAlign: 'center', fontWeight: 300 }}>
                    We&apos;ll respond within 24 hours.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
