import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Our Story',
  description: 'The story behind MirhaPret — where Pakistani craftsmanship meets contemporary design.',
};

const gold = '#c8a96e';

export default function OurStoryPage() {
  return (
    <div style={{ background: '#fff', color: '#000' }}>
      <SiteHeader />

      {/* Hero */}
      <section style={{ background: '#0e0e0e', color: '#fff', padding: '80px 60px', minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: gold, fontWeight: 600, marginBottom: '16px' }}>
          Where It All Began
        </p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 800, letterSpacing: '-3px', lineHeight: 1, maxWidth: '700px' }}>
          Our Story
        </h1>
      </section>

      {/* Opening quote */}
      <section style={{ background: '#faf9f6', padding: '80px 60px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '48px', color: gold, lineHeight: 1, display: 'block', marginBottom: '24px', fontFamily: 'Georgia, serif' }}>"</span>
          <p style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', fontWeight: 300, color: '#222', lineHeight: 1.7, letterSpacing: '-0.2px', fontStyle: 'italic' }}>
            There is a reason a woman pauses at a mirror before she leaves the house. It is not vanity. It is intention. MirhaPret was built for that moment.
          </p>
          <p style={{ marginTop: '24px', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb' }}>
            Founder, MirhaPret
          </p>
        </div>
      </section>

      {/* Story sections */}
      <section style={{ padding: '80px 60px' }}>

        {/* Origin */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', marginBottom: '80px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
              <div style={{ width: '40px', height: '1px', background: gold }} />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: gold }}>The Beginning</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '20px', lineHeight: 1.2 }}>
              Born in Lahore, Worn Everywhere
            </h2>
            <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.9, marginBottom: '16px' }}>
              MirhaPret began in a small atelier in Lahore's old city, where a group of designers and master karigars came together with a shared frustration: Pakistani women deserved better than the choice between cheap fast fashion and inaccessible couture.
            </p>
            <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.9 }}>
              The answer was luxury pret. Garments that respected the wearer's time, reflected the richness of Pakistani textile heritage, and could be worn from a morning meeting to an evening celebration without compromise.
            </p>
          </div>
          <div style={{ background: '#0e0e0e', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <p style={{ fontSize: '48px', fontWeight: 800, color: gold, letterSpacing: '-2px', lineHeight: 1 }}>2016</p>
              <p style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', marginTop: '12px' }}>Founded in Lahore</p>
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div style={{ width: '40px', height: '1px', background: gold }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: gold }}>Our Philosophy</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            {[
              {
                title: 'Craft Before Commerce',
                body: 'Every collection begins at the loom, not in a spreadsheet. We source fabrics that cannot be found in a wholesale catalogue and invest in the kind of hand embroidery that takes weeks per piece.',
              },
              {
                title: 'Women Dressing Women',
                body: 'Our design team is entirely female. We design for real bodies, real occasions, and real lives. The fit of a garment is never an afterthought at MirhaPret.',
              },
              {
                title: 'Pakistan, Proudly',
                body: 'Every MirhaPret piece is made in Pakistan by Pakistani artisans. We pay above market wages, offer year-round employment, and reinvest in skills that would otherwise be lost.',
              },
            ].map(({ title, body }) => (
              <div key={title} style={{ borderTop: `2px solid ${gold}`, paddingTop: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', letterSpacing: '0.2px' }}>{title}</h3>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.85 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Numbers */}
        <div style={{ background: '#0e0e0e', padding: '64px 48px', marginBottom: '80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '40px', textAlign: 'center' }}>
            {[
              { number: '3', label: 'Collections' },
              { number: '42', label: 'Master Karigars' },
              { number: '14', label: 'Cities Served' },
              { number: '18k', label: 'Customers' },
            ].map(({ number, label }) => (
              <div key={label}>
                <p style={{ fontSize: '3rem', fontWeight: 800, color: gold, letterSpacing: '-2px', lineHeight: 1, marginBottom: '10px' }}>{number}</p>
                <p style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#555' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', marginBottom: '48px' }}>
          <div style={{ background: '#faf9f6', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#0e0e0e', lineHeight: 1.4, letterSpacing: '-0.5px', textAlign: 'center' }}>
              "The future of Pakistani fashion is Pakistani."
            </p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
              <div style={{ width: '40px', height: '1px', background: gold }} />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: gold }}>Looking Forward</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '20px', lineHeight: 1.3 }}>
              A Brand That Grows With Its Women
            </h2>
            <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.9, marginBottom: '16px' }}>
              Today, MirhaPret serves customers across Pakistan from Lahore, the city that shaped our sense of craft, fit, and occasionwear. Every collection remains rooted in the rhythm of Pakistani women and the artisans who make each piece possible.
            </p>
            <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.9 }}>
              We are building something that lasts. Not a trend. A brand that a mother and daughter both want to wear, for different reasons, on the same occasion.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href="/products" style={{ display: 'inline-block', padding: '16px 40px', background: '#000', color: '#fff', textDecoration: 'none', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Explore the Collection
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
