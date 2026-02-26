'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageHeader } from '@/components/PageHeader';

gsap.registerPlugin(ScrollTrigger);

// Lofi image placeholder component
function LofiImage({ width = 400, height = 300 }: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ background: '#f5f5f5', display: 'block' }}
    >
      {/* Background */}
      <rect width={width} height={height} fill="#f5f5f5" />
      
      {/* Diagonal lines pattern */}
      {Array.from({ length: 20 }).map((_, i) => (
        <line
          key={i}
          x1={i * (width / 10) - height}
          y1="0"
          x2={i * (width / 10)}
          y2={height}
          stroke="#e0e0e0"
          strokeWidth="2"
        />
      ))}
      
      {/* Center text */}
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14"
        fill="#999999"
        fontFamily="system-ui"
      >
        Collection Image
      </text>
    </svg>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: 'Timeless Elegance',
      subtitle: 'Discover our Premium Pret collection — ready-to-wear luxury crafted for the modern Pakistani woman',
      tagline: 'Effortless sophistication for every occasion',
      cta: 'Explore Pret',
      color: '#000000',
    },
    {
      title: 'Contemporary Luxury',
      subtitle: 'Octa West 2026 — where tradition meets avant-garde design in stunning contemporary pieces',
      tagline: 'Bold, artistic, unapologetically modern',
      cta: 'Shop Octa West',
      color: '#1a1a1a',
    },
    {
      title: 'Haute Couture',
      subtitle: 'The Desire Collection — our most exclusive pieces for those who demand perfection',
      tagline: 'Luxury redefined, one stitch at a time',
      cta: 'View Desire',
      color: '#333333',
    },
  ];

  useEffect(() => {
    // Carousel auto-advance
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Carousel animations
    const ctx = gsap.context(() => {
      gsap.from('.carousel-content', {
        duration: 0.8,
        opacity: 0,
        y: 30,
        ease: 'power3.out',
      });

      gsap.from('.carousel-cta', {
        duration: 0.8,
        opacity: 0,
        y: 20,
        delay: 0.2,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, [currentSlide]);

  useEffect(() => {
    // Scroll animations
    const ctx = gsap.context(() => {
      // Collection cards stagger
      gsap.from('.collection-card', {
        duration: 0.8,
        opacity: 0,
        y: 50,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.collections-section',
          start: 'top 80%',
          end: 'top 20%',
          scrub: false,
        },
        ease: 'power3.out',
      });

      // Featured products animation
      gsap.from('.product-item', {
        duration: 0.8,
        opacity: 0,
        y: 40,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.featured-section',
          start: 'top 80%',
          end: 'top 20%',
          scrub: false,
        },
        ease: 'power3.out',
      });

      // Testimonials animation
      gsap.from('.testimonial-card', {
        duration: 0.8,
        opacity: 0,
        y: 40,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.testimonials-section',
          start: 'top 80%',
          end: 'top 20%',
          scrub: false,
        },
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: '#ffffff', color: '#000000' }}>
      <PageHeader isScrolled={isScrolled} />

      {/* Hero Carousel Section */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '60px',
          background: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Carousel Slides */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '60px',
              paddingRight: '60px',
              opacity: currentSlide === idx ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              pointerEvents: currentSlide === idx ? 'auto' : 'none',
            }}
          >
            {/* Left Content */}
            <div style={{ flex: 1, maxWidth: '600px', zIndex: 10 }}>
              <div className="carousel-content">
                <p
                  style={{
                    fontSize: '0.9rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#666666',
                    marginBottom: '16px',
                    fontWeight: 600,
                  }}
                >
                  {slide.tagline}
                </p>
                <h1
                  style={{
                    fontSize: '4rem',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    marginBottom: '24px',
                    letterSpacing: '-1px',
                  }}
                >
                  {slide.title}
                </h1>
                <p
                  style={{
                    fontSize: '1.1rem',
                    color: '#666666',
                    marginBottom: '40px',
                    lineHeight: 1.7,
                  }}
                >
                  {slide.subtitle}
                </p>
              </div>

              <div className="carousel-cta" style={{ display: 'flex', gap: '16px' }}>
                <button
                  style={{
                    padding: '14px 32px',
                    background: '#000000',
                    color: '#ffffff',
                    border: '1px solid #000000',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {slide.cta}
                </button>
                <button
                  style={{
                    padding: '14px 32px',
                    background: '#ffffff',
                    color: '#000000',
                    border: '1px solid #000000',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  View Lookbook
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', marginLeft: '60px' }}>
              <LofiImage width={500} height={600} />
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '12px',
            zIndex: 20,
          }}
        >
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: currentSlide === idx ? '#000000' : '#e0e0e0',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            fontSize: '14px',
            color: '#666666',
            fontWeight: 600,
            zIndex: 20,
          }}
        >
          {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
        </div>
      </section>

      {/* Collections Section */}
      <section
        id="collections"
        className="collections-section"
        style={{
          padding: '80px 60px',
          background: '#ffffff',
        }}
      >
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '0.9rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#666666',
              marginBottom: '16px',
              fontWeight: 600,
            }}
          >
            Our Collections
          </p>
          <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '16px' }}>
            Curated for You
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666666', maxWidth: '600px', margin: '0 auto' }}>
            Each collection represents our commitment to quality, elegance, and the modern Pakistani woman
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
          }}
        >
          {[
            {
              name: 'Premium Pret',
              desc: 'Ready-to-wear elegance for everyday luxury',
              pieces: '120+ pieces',
              price: 'From PKR 2,999',
              highlight: 'Perfect for work, brunch, and evening gatherings',
              categoryId: 'pret',
            },
            {
              name: 'Octa West 2026',
              desc: 'Contemporary designs with traditional roots',
              pieces: '85+ pieces',
              price: 'From PKR 5,999',
              highlight: 'Modern silhouettes with intricate detailing',
              categoryId: 'octa-west',
            },
            {
              name: 'Desire Collection',
              desc: 'Haute couture for special moments',
              pieces: '45+ pieces',
              price: 'From PKR 8,999',
              highlight: 'Exclusive pieces for weddings and celebrations',
              categoryId: 'desire',
            },
          ].map((collection, idx) => (
            <div
              key={idx}
              className="collection-card"
              style={{
                border: '1px solid #e0e0e0',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <LofiImage width={400} height={400} />
              </div>
              <div style={{ padding: '0 16px 24px 16px' }}>
                <p
                  style={{
                    fontSize: '0.85rem',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#999999',
                    marginBottom: '8px',
                    fontWeight: 600,
                  }}
                >
                  {collection.pieces}
                </p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
                  {collection.name}
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#666666', marginBottom: '12px' }}>
                  {collection.desc}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#999999', marginBottom: '16px', fontStyle: 'italic' }}>
                  {collection.highlight}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: '#000000' }}>
                    {collection.price}
                  </p>
                  <button
                    onClick={() => window.location.href = `/products?category=${collection.categoryId}`}
                    style={{
                      padding: '6px 12px',
                      background: '#000000',
                      color: '#ffffff',
                      border: '1px solid #000000',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    View All
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section
        id="featured"
        className="featured-section"
        style={{
          padding: '80px 60px',
          background: '#f5f5f5',
        }}
      >
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '0.9rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#666666',
              marginBottom: '16px',
              fontWeight: 600,
            }}
          >
            This Season
          </p>
          <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '16px' }}>
            Featured Pieces
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666666', maxWidth: '600px', margin: '0 auto' }}>
            Handpicked selections that define contemporary luxury fashion
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="product-item"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                overflow: 'hidden',
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <LofiImage width={300} height={350} />
              </div>
              <div style={{ padding: '0 16px 16px 16px' }}>
                <p
                  style={{
                    fontSize: '0.8rem',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#999999',
                    marginBottom: '6px',
                    fontWeight: 600,
                  }}
                >
                  Premium Collection
                </p>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>
                  Piece {item}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#666666', marginBottom: '12px' }}>
                  Available in S, M, L, XL
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: '#000000' }}>
                    PKR {(2999 + item * 1000).toLocaleString()}
                  </p>
                  <button
                    onClick={() => window.location.href = `/products/featured-${item}`}
                    style={{
                      padding: '6px 12px',
                      background: '#000000',
                      color: '#ffffff',
                      border: '1px solid #000000',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="testimonials-section"
        style={{
          padding: '80px 60px',
          background: '#f5f5f5',
        }}
      >
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '0.9rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#666666',
              marginBottom: '16px',
              fontWeight: 600,
            }}
          >
            Customer Love
          </p>
          <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '16px' }}>
            What Our Customers Say
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
          }}
        >
          {[
            {
              name: 'Ayesha Khan',
              city: 'Karachi',
              text: 'NEXUS has completely transformed my wardrobe. The quality is unmatched and the designs are so elegant.',
              rating: 5,
            },
            {
              name: 'Zainab Ahmed',
              city: 'Lahore',
              text: 'I love how each piece tells a story. The attention to detail is incredible. Highly recommend!',
              rating: 5,
            },
            {
              name: 'Hira Malik',
              city: 'Islamabad',
              text: 'Finally found a boutique that understands modern Pakistani fashion. Absolutely in love with my purchases.',
              rating: 5,
            },
          ].map((testimonial, idx) => (
            <div
              key={idx}
              className="testimonial-card"
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                padding: '32px',
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} style={{ fontSize: '1.2rem', color: '#f5a623' }}>
                    ★
                  </span>
                ))}
              </div>
              <p style={{ fontSize: '1rem', color: '#333333', marginBottom: '24px', lineHeight: 1.7 }}>
                "{testimonial.text}"
              </p>
              <div>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#000000' }}>
                  {testimonial.name}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#666666' }}>{testimonial.city}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        style={{
          padding: '80px 60px',
          background: '#000000',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px' }}>
          Stay in the Loop
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#cccccc', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
          Subscribe to get exclusive offers, new collection launches, and styling tips delivered to your inbox
        </p>
        <div style={{ display: 'flex', gap: '12px', maxWidth: '500px', margin: '0 auto' }}>
          <input
            type="email"
            placeholder="Enter your email"
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #333333',
              background: '#1a1a1a',
              color: '#ffffff',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
          <button
            style={{
              padding: '12px 32px',
              background: '#ffffff',
              color: '#000000',
              border: '1px solid #ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Subscribe
          </button>
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
