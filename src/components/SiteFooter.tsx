'use client';

import { FaInstagram, FaFacebookF, FaTiktok, FaWhatsapp, FaYoutube, FaPinterestP } from 'react-icons/fa';

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

  return (
    <footer style={{ background: '#0e0e0e', color: '#fff', padding: '64px 60px 40px' }}>
      <div className="footer-grid" style={{ marginBottom: '48px' }}>
        {/* Brand */}
        <div>
          <h4 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '1px', color: '#fff', marginBottom: '16px' }}>
            MirhaPret
          </h4>
          <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.9, maxWidth: '260px', marginBottom: '24px' }}>
            Premium Pakistani fashion for the modern woman. Celebrating craftsmanship, elegance, and identity.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { icon: <FaInstagram size={14} />, href: 'https://www.instagram.com/mirhapret_official', label: 'Instagram', hoverColor: '#E1306C' },
              { icon: <FaFacebookF size={14} />, href: 'https://www.facebook.com/mirhapret', label: 'Facebook', hoverColor: '#1877F2' },
              { icon: <FaTiktok size={14} />, href: 'https://www.tiktok.com/@mirhapret', label: 'TikTok', hoverColor: '#fff' },
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
                style={{
                  width: '34px', height: '34px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#555', textDecoration: 'none',
                  transition: 'background 0.2s, border-color 0.2s, color 0.2s',
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

        {[
          { title: 'Shop', links: shopLinks },
          { title: 'Help', links: helpLinks },
          { title: 'Company', links: companyLinks },
        ].map((section, i) => (
          <div key={i}>
            <h5 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#fff', marginBottom: '20px' }}>
              {section.title}
            </h5>
            <ul style={{ listStyle: 'none' }}>
              {section.links.map(([label, href], j) => {
                const isExternal = href.startsWith('http');
                return (
                  <li key={j} style={{ marginBottom: '10px' }}>
                    <a
                      href={href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      style={{ fontSize: '13px', color: '#555', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
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

      <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '28px' }}>
        <p style={{ fontSize: '12px', color: '#333' }}>
          © 2026 MirhaPret. All rights reserved. Celebrating the modern Pakistani woman.
        </p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="/privacy" style={{ fontSize: '12px', color: '#333', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#333')}>
            Privacy Policy
          </a>
          <a href="/terms" style={{ fontSize: '12px', color: '#333', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#333')}>
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
