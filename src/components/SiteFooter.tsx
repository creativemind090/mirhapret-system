'use client';

import { FaInstagram, FaFacebookF, FaTiktok, FaWhatsapp, FaYoutube, FaPinterestP } from 'react-icons/fa';

const GOLD = '#c8a96e';
const DARK = '#080808';

export function SiteFooter() {
  const shopLinks: [string, string][] = [
    ['All Products', '/products'],
    ['Premium Pret', '/products?category=premium-pret'],
    ['Octa West 2026', '/products?collection=octa-west-2026'],
    ['The Desire Edit', '/products?collection=desire-edit'],
    ['Sale', '/products?sale=true'],
  ];
  const helpLinks: [string, string][] = [
    ['Contact Us', '/contact'],
    ['Shipping Info', '/shipping'],
    ['Returns & Exchanges', '/returns'],
    ['Size Guide', '/size-guide'],
    ['FAQ', '/faq'],
  ];
  const companyLinks: [string, string][] = [
    ['About Us', '/about'],
    ['Our Story', '/our-story'],
    ['Careers', '/careers'],
    ['Instagram', 'https://instagram.com/mirhapret'],
    ['WhatsApp', 'https://wa.me/923244577066'],
  ];

  const socials = [
    { icon: <FaInstagram size={13} />, href: 'https://www.instagram.com/mirhapret_official', label: 'Instagram', hoverColor: '#E1306C' },
    { icon: <FaFacebookF size={13} />, href: 'https://www.facebook.com/mirhapret', label: 'Facebook', hoverColor: '#1877F2' },
    { icon: <FaTiktok size={13} />, href: 'https://www.tiktok.com/@mirhapret', label: 'TikTok', hoverColor: '#fff' },
    { icon: <FaYoutube size={13} />, href: 'https://www.youtube.com/@mirhapret', label: 'YouTube', hoverColor: '#FF0000' },
    { icon: <FaPinterestP size={13} />, href: 'https://www.pinterest.com/mirhapret', label: 'Pinterest', hoverColor: '#E60023' },
    { icon: <FaWhatsapp size={13} />, href: 'https://wa.me/923244577066', label: 'WhatsApp', hoverColor: '#25D366' },
  ];

  return (
    <footer style={{ background: DARK, color: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* Gold grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.025,
        backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)',
        backgroundSize: '48px 48px', pointerEvents: 'none',
      }} />

      {/* Main grid */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="footer-grid" style={{ padding: 'clamp(56px,7vw,88px) clamp(24px,6vw,80px) clamp(40px,5vw,64px)', marginBottom: 0 }}>

          {/* Brand column */}
          <div>
            <div style={{ width: '28px', height: '1px', background: GOLD, marginBottom: '20px' }} />
            <a href="/" style={{ textDecoration: 'none' }}>
              <h4 style={{
                fontFamily: "'Cormorant', serif",
                fontSize: '1.5rem', fontWeight: 600, fontStyle: 'italic',
                letterSpacing: '1px', color: '#fff', marginBottom: '16px',
              }}>
                MirhaPret
              </h4>
            </a>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '12px', color: '#555', fontWeight: 300,
              lineHeight: 1.9, maxWidth: '240px', marginBottom: '28px',
            }}>
              Premium Pakistani fashion for the modern woman. Celebrating craftsmanship, elegance, and identity.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {socials.map(({ icon, href, label, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  style={{
                    width: '32px', height: '32px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#555', textDecoration: 'none',
                    transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = hoverColor;
                    (e.currentTarget as HTMLElement).style.borderColor = hoverColor;
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                    (e.currentTarget as HTMLElement).style.color = '#555';
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { title: 'Shop', links: shopLinks },
            { title: 'Help', links: helpLinks },
            { title: 'Company', links: companyLinks },
          ].map((section) => (
            <div key={section.title}>
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '9px', fontWeight: 700,
                letterSpacing: '3px', textTransform: 'uppercase',
                color: GOLD, marginBottom: '20px',
              }}>
                {section.title}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {section.links.map(([label, href]) => {
                  const isExternal = href.startsWith('http');
                  return (
                    <li key={label}>
                      <a
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: '12px', color: '#555', textDecoration: 'none',
                          fontWeight: 300, transition: 'color 0.2s', cursor: 'pointer',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                        onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                      >
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: 'clamp(20px,3vw,28px) clamp(24px,6vw,80px)',
        }}>
          <div className="footer-bottom">
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px', color: '#333', fontWeight: 300, letterSpacing: '0.5px',
            }}>
              © 2026 MirhaPret. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
              {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms']].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '10px', color: '#333', textDecoration: 'none',
                    fontWeight: 300, letterSpacing: '0.5px', transition: 'color 0.2s', cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                  onMouseLeave={e => (e.currentTarget.style.color = '#333')}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
