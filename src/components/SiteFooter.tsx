export function SiteFooter() {
  const shopLinks: [string, string][] = [
    ['All Products', '/products'],
    ['Premium Pret', '/products'],
    ['Octa West 2026', '/products'],
    ['The Desire Edit', '/products'],
    ['Sale', '/products'],
  ];
  const helpLinks: [string, string][] = [
    ['Contact Us', '/contact'],
    ['Shipping Info', '#'],
    ['Returns & Exchanges', '#'],
    ['Size Guide', '#'],
    ['FAQ', '#'],
  ];
  const companyLinks: [string, string][] = [
    ['About Us', '/about'],
    ['Our Story', '/about'],
    ['Careers', '#'],
    ['Instagram', '#'],
    ['WhatsApp', '#'],
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
            {['IG', 'FB', 'TT'].map(s => (
              <a key={s} href="#" style={{
                width: '34px', height: '34px',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 700, color: '#555', textDecoration: 'none',
              }}>
                {s}
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
              {section.links.map(([label, href], j) => (
                <li key={j} style={{ marginBottom: '10px' }}>
                  <a href={href} style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '28px' }}>
        <p style={{ fontSize: '12px', color: '#333' }}>
          © 2026 MirhaPret. All rights reserved. Celebrating the modern Pakistani woman.
        </p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#" style={{ fontSize: '12px', color: '#333', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ fontSize: '12px', color: '#333', textDecoration: 'none' }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
