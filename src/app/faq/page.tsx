'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const GOLD = '#c8a96e';
const DARK = '#080808';
const CREAM = '#FAFAF8';

const faqs = [
  {
    category: 'Orders',
    items: [
      {
        q: 'How do I know my order has been confirmed?',
        a: 'You will receive a confirmation email and an SMS within minutes of placing your order. If you do not receive these within 30 minutes, please check your spam folder or contact our team directly.',
      },
      {
        q: 'Can I modify or cancel my order after placing it?',
        a: 'Orders can be modified or cancelled within 2 hours of placement. After this window, our fulfillment process begins and changes may not be possible. Reach out to us on WhatsApp for the fastest response.',
      },
    ],
  },
  {
    category: 'Sizing and Fit',
    items: [
      {
        q: 'What if the size I ordered does not fit?',
        a: 'We offer free exchanges within 14 days of delivery. Simply reach out with your order number and the size you would like, and we will arrange a pickup and dispatch the correct size at no charge.',
      },
      {
        q: 'Are your sizes true to label?',
        a: 'MirhaPret pieces are cut generously in line with traditional Pakistani pret sizing. We recommend checking the size guide on each product page and comparing against your actual measurements rather than relying on your usual label size.',
      },
    ],
  },
  {
    category: 'Fabric and Care',
    items: [
      {
        q: 'What fabrics does MirhaPret use?',
        a: 'Our collections feature luxury lawn, fine cotton voile, chiffon, organza, and embroidered karandi depending on the season. Fabric information is listed on every individual product page.',
      },
      {
        q: 'How should I care for embroidered pieces?',
        a: 'Embroidered and heavily worked pieces should be dry cleaned or hand washed in cold water with a mild detergent. Never wring or tumble dry. Store flat or on a padded hanger, away from direct sunlight.',
      },
      {
        q: 'Will the colours fade over time?',
        a: 'Our fabrics are tested for colourfastness before production. Washing in cold water, turning garments inside out, and avoiding prolonged sun exposure will preserve the colour and finish of your piece for years.',
      },
    ],
  },
  {
    category: 'Payment',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major debit and credit cards, Easypaisa, JazzCash, and bank transfer. Cash on delivery is available in Lahore, Karachi, and Islamabad.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. All transactions are processed through PCI DSS compliant payment gateways. We do not store your card details on our servers.',
      },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (key: string) => setOpen(prev => prev === key ? null : key);

  return (
    <div style={{ background: CREAM, color: '#0a0a0a' }}>
      <SiteHeader />

      {/* ─── Hero ─── */}
      <section style={{
        background: DARK, color: '#fff',
        padding: 'clamp(80px,10vw,120px) clamp(24px,6vw,80px) clamp(60px,8vw,96px)',
        minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
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
            We Have Answers
          </p>
          <h1 style={{
            fontFamily: "'Cormorant', serif",
            fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
            fontWeight: 600, fontStyle: 'italic',
            letterSpacing: '-1px', lineHeight: 1.05, color: '#fff', margin: 0,
          }}>
            Frequently Asked<br />Questions
          </h1>
        </div>
      </section>

      <section style={{ padding: 'clamp(60px,8vw,100px) clamp(24px,6vw,80px)', background: '#fff' }}>

        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#888', lineHeight: 1.9, marginBottom: '64px', fontWeight: 300, maxWidth: '600px' }}>
          Everything you need to know about ordering from MirhaPret. If you cannot find your answer here, our team is always just a message away.
        </p>

        {faqs.map(({ category, items }) => (
          <div key={category} style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
              <div style={{ width: '28px', height: '1px', background: GOLD, flexShrink: 0 }} />
              <h2 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '9px', fontWeight: 700,
                letterSpacing: '3px', textTransform: 'uppercase', color: GOLD, margin: 0,
              }}>
                {category}
              </h2>
            </div>

            {items.map(({ q, a }, i) => {
              const key = `${category}-${i}`;
              const isOpen = open === key;
              return (
                <div key={key} style={{ borderBottom: '1px solid #ece8e3' }}>
                  <button
                    onClick={() => toggle(key)}
                    style={{
                      width: '100%', display: 'flex',
                      justifyContent: 'space-between', alignItems: 'center',
                      padding: '22px 0', background: 'none', border: 'none',
                      cursor: 'pointer', textAlign: 'left', gap: '16px',
                    }}
                  >
                    <span style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '13px', fontWeight: isOpen ? 600 : 500,
                      color: isOpen ? DARK : '#444', lineHeight: 1.5,
                      transition: 'color 0.2s',
                    }}>{q}</span>
                    <span style={{
                      width: '20px', height: '20px', border: `1px solid ${isOpen ? GOLD : '#d0ccc8'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, color: GOLD,
                      fontFamily: "'Montserrat', sans-serif", fontSize: '16px', fontWeight: 300,
                      transition: 'transform 0.2s, border-color 0.2s',
                      transform: isOpen ? 'rotate(45deg)' : 'none',
                    }}>+</span>
                  </button>
                  {isOpen && (
                    <p style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '13px', color: '#666', lineHeight: 1.9,
                      paddingBottom: '24px', paddingRight: '40px', fontWeight: 300,
                    }}>
                      {a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Still need help */}
        <div style={{
          background: DARK, padding: '56px 48px', textAlign: 'center', marginTop: '32px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: '28px', height: '1px', background: GOLD, margin: '0 auto 24px' }} />
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: GOLD, fontWeight: 600, marginBottom: '16px' }}>
              Still have a question?
            </p>
            <h3 style={{
              fontFamily: "'Cormorant', serif",
              fontSize: '1.8rem', fontWeight: 600, fontStyle: 'italic',
              color: '#fff', marginBottom: '12px',
            }}>Talk to a Real Person</h3>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#555', marginBottom: '32px', fontWeight: 300 }}>
              Our team responds within 2 hours, Monday through Saturday.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/contact" style={{
                padding: '13px 32px', background: GOLD, color: '#fff',
                textDecoration: 'none', fontFamily: "'Montserrat', sans-serif",
                fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', cursor: 'pointer',
              }}>
                Email Us
              </a>
              <a href="https://wa.me/923244577066" target="_blank" rel="noopener noreferrer" style={{
                padding: '13px 32px', background: 'transparent', color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                textDecoration: 'none', fontFamily: "'Montserrat', sans-serif",
                fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', cursor: 'pointer',
              }}>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
