import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Careers at MirhaPret',
  description: 'Join the team building Pakistan\'s most loved luxury pret brand.',
};

const gold = '#c8a96e';

const openings = [
  {
    title: 'Senior Textile Designer',
    department: 'Creative',
    location: 'Lahore, Pakistan',
    type: 'Full Time',
    desc: 'Lead the design direction for upcoming seasonal collections. You will work directly with our head designer and production team to develop print, embroidery, and fabric stories from concept to final garment.',
  },
  {
    title: 'Brand & Content Manager',
    department: 'Marketing',
    location: 'Lahore, Pakistan',
    type: 'Full Time',
    desc: 'Own the MirhaPret voice across all channels including Instagram, website, email, and packaging. You understand how to write for a premium audience and can move between editorial, campaign, and product copy seamlessly.',
  },
  {
    title: 'E-Commerce Operations Lead',
    department: 'Operations',
    location: 'Lahore, Pakistan',
    type: 'Full Time',
    desc: 'Oversee daily order fulfillment, courier coordination, inventory, and customer experience workflows. You will work closely with the tech team to improve operational systems and reduce friction for our customers.',
  },
  {
    title: 'Stylist and Visual Merchandiser',
    department: 'Retail',
    location: 'Lahore Flagship Store',
    type: 'Full Time',
    desc: 'Curate the in-store and online visual experience of MirhaPret. You will lead shoot styling, window displays, and the overall presentation of our collections at the flagship store and at external events.',
  },
  {
    title: 'Social Media & Community Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full Time',
    desc: 'Build and manage the MirhaPret community across Instagram, TikTok, and Pinterest. You understand fashion, photograph beautifully, and can engage an audience with both warmth and sophistication.',
  },
];

export default function CareersPage() {
  return (
    <div style={{ background: '#fff', color: '#000' }}>
      <SiteHeader />

      {/* Hero */}
      <section style={{ background: '#0e0e0e', color: '#fff', padding: '80px 60px', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: gold, fontWeight: 600, marginBottom: '16px' }}>
          Build Something Meaningful
        </p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 800, letterSpacing: '-3px', lineHeight: 1, maxWidth: '700px' }}>
          Careers at MirhaPret
        </h1>
      </section>

      <section style={{ padding: '80px 60px' }}>

        {/* Intro */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', marginBottom: '80px', alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: '17px', color: '#444', lineHeight: 1.9, fontWeight: 300 }}>
              We are a small team doing ambitious work. Every person at MirhaPret has a meaningful impact on what the brand becomes. We are looking for people who care deeply about craft, beauty, and the women we serve.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { icon: '✦', label: 'Competitive salaries with annual reviews' },
              { icon: '✦', label: 'Generous clothing allowance each season' },
              { icon: '✦', label: 'Flexible working and remote options available' },
              { icon: '✦', label: 'Learning budget for courses and conferences' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: gold, flexShrink: 0, marginTop: '1px' }}>{icon}</span>
                <p style={{ fontSize: '14px', color: '#333', lineHeight: 1.5 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open roles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <div style={{ width: '40px', height: '1px', background: gold }} />
          <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: gold }}>
            Open Positions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e8e8e8', marginBottom: '64px' }}>
          {openings.map(({ title, department, location, type, desc }) => (
            <div key={title} style={{ background: '#fff', padding: '32px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{title}</p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb' }}>{department}</span>
                    <span style={{ fontSize: '11px', color: '#ddd' }}>|</span>
                    <span style={{ fontSize: '11px', color: '#bbb' }}>{location}</span>
                    <span style={{ fontSize: '11px', color: '#ddd' }}>|</span>
                    <span style={{ fontSize: '11px', color: gold, fontWeight: 600 }}>{type}</span>
                  </div>
                </div>
                <a
                  href={`mailto:careers@mirhapret.com?subject=Application: ${title}`}
                  style={{ padding: '10px 22px', background: '#000', color: '#fff', textDecoration: 'none', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
                >
                  Apply Now
                </a>
              </div>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.8 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Speculative */}
        <div style={{ background: '#faf9f6', padding: '48px 40px', textAlign: 'center', borderTop: `2px solid ${gold}` }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: gold, marginBottom: '12px' }}>
            Do not see your role listed?
          </p>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>We welcome speculative applications</h3>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.7, marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px' }}>
            If you believe you have something to contribute to MirhaPret, we want to hear from you. Send us your portfolio, your story, and why this brand matters to you.
          </p>
          <a href="mailto:careers@mirhapret.com?subject=Speculative Application" style={{ display: 'inline-block', padding: '14px 32px', background: '#000', color: '#fff', textDecoration: 'none', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Send Your Story
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
