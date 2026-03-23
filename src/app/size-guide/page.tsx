'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const gold = '#c8a96e';

const categories = ['Kurta', 'Shalwar Kameez', 'Trousers', 'Dupatta'] as const;
type Category = typeof categories[number];

const sizeData: Record<Category, { size: string; chest: string; waist: string; hip: string; length: string }[]> = {
  Kurta: [
    { size: 'XS', chest: '32"', waist: '26"', hip: '34"', length: '40"' },
    { size: 'S',  chest: '34"', waist: '28"', hip: '36"', length: '41"' },
    { size: 'M',  chest: '36"', waist: '30"', hip: '38"', length: '42"' },
    { size: 'L',  chest: '38"', waist: '32"', hip: '40"', length: '43"' },
    { size: 'XL', chest: '40"', waist: '34"', hip: '42"', length: '44"' },
    { size: 'XXL',chest: '42"', waist: '36"', hip: '44"', length: '45"' },
  ],
  'Shalwar Kameez': [
    { size: 'XS', chest: '32"', waist: '24"', hip: '34"', length: '52"' },
    { size: 'S',  chest: '34"', waist: '26"', hip: '36"', length: '53"' },
    { size: 'M',  chest: '36"', waist: '28"', hip: '38"', length: '54"' },
    { size: 'L',  chest: '38"', waist: '30"', hip: '40"', length: '55"' },
    { size: 'XL', chest: '40"', waist: '32"', hip: '42"', length: '56"' },
    { size: 'XXL',chest: '42"', waist: '34"', hip: '44"', length: '57"' },
  ],
  Trousers: [
    { size: 'XS', chest: 'N/A', waist: '24"', hip: '34"', length: '38"' },
    { size: 'S',  chest: 'N/A', waist: '26"', hip: '36"', length: '39"' },
    { size: 'M',  chest: 'N/A', waist: '28"', hip: '38"', length: '39"' },
    { size: 'L',  chest: 'N/A', waist: '30"', hip: '40"', length: '40"' },
    { size: 'XL', chest: 'N/A', waist: '32"', hip: '42"', length: '40"' },
    { size: 'XXL',chest: 'N/A', waist: '34"', hip: '44"', length: '41"' },
  ],
  Dupatta: [
    { size: 'S',  chest: 'N/A', waist: 'N/A', hip: 'N/A', length: '2.0 m' },
    { size: 'M',  chest: 'N/A', waist: 'N/A', hip: 'N/A', length: '2.25 m' },
    { size: 'L',  chest: 'N/A', waist: 'N/A', hip: 'N/A', length: '2.5 m' },
    { size: 'XL', chest: 'N/A', waist: 'N/A', hip: 'N/A', length: '2.75 m' },
    { size: 'XXL',chest: 'N/A', waist: 'N/A', hip: 'N/A', length: '3.0 m' },
    { size: 'XXL',chest: 'N/A', waist: 'N/A', hip: 'N/A', length: '3.0 m' },
  ],
};

export default function SizeGuidePage() {
  const [active, setActive] = useState<Category>('Kurta');
  const rows = sizeData[active];

  return (
    <div style={{ background: '#fff', color: '#000' }}>
      <SiteHeader />

      {/* Hero */}
      <section style={{ background: '#0e0e0e', color: '#fff', padding: '80px 60px', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: gold, fontWeight: 600, marginBottom: '16px' }}>
          Find Your Perfect Fit
        </p>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 4rem)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.05 }}>
          Size Guide
        </h1>
      </section>

      <section style={{ padding: '80px 60px' }}>

        <p style={{ fontSize: '17px', color: '#444', lineHeight: 1.9, marginBottom: '48px', fontWeight: 300, maxWidth: '680px' }}>
          MirhaPret garments are cut to a consistent standard across all collections. We recommend measuring yourself before ordering, especially if this is your first time shopping with us.
        </p>

        {/* How to measure */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div style={{ width: '40px', height: '1px', background: gold }} />
            <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: gold }}>
              How to Measure
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {[
              { label: 'Chest', desc: 'Measure around the fullest part of your chest, keeping the tape parallel to the ground.' },
              { label: 'Waist', desc: 'Measure around your natural waistline, which is the narrowest part of your torso.' },
              { label: 'Hips', desc: 'Stand with feet together and measure around the fullest part of your hips and seat.' },
              { label: 'Length', desc: 'Measure from the highest point of your shoulder straight down to the desired garment length.' },
            ].map(({ label, desc }) => (
              <div key={label} style={{ borderTop: `2px solid ${gold}`, paddingTop: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</p>
                <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
            <div style={{ width: '40px', height: '1px', background: gold }} />
            <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: gold }}>
              Size Charts
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #e8e8e8', marginBottom: '32px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{
                  padding: '12px 24px',
                  background: 'none',
                  border: 'none',
                  borderBottom: active === cat ? `2px solid #000` : '2px solid transparent',
                  fontSize: '12px',
                  fontWeight: active === cat ? 700 : 400,
                  color: active === cat ? '#000' : '#999',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: '0.5px',
                  marginBottom: '-1px',
                  transition: 'color 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0e0e0e' }}>
                  {['Size', 'Chest', 'Waist', 'Hip', 'Length'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: h === 'Size' ? gold : '#fff', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#faf9f6', borderBottom: '1px solid #f0ede6' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 700, fontSize: '13px' }}>{row.size}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#444' }}>{row.chest}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#444' }}>{row.waist}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#444' }}>{row.hip}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#444' }}>{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fit tip */}
        <div style={{ background: '#faf9f6', padding: '32px', borderLeft: `3px solid ${gold}`, marginBottom: '48px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Between sizes?</p>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.7 }}>
            We always recommend sizing up for a more traditional fit, or reaching out to our team directly. Our stylists are happy to advise on the right size for your specific measurements.
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href="/contact" style={{ display: 'inline-block', padding: '14px 32px', background: '#000', color: '#fff', textDecoration: 'none', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Ask a Stylist
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
