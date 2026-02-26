'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageHeader } from '@/components/PageHeader';

gsap.registerPlugin(ScrollTrigger);

// Lofi image placeholder component
function LofiImage({ width = 300, height = 350 }: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ background: '#f5f5f5', display: 'block' }}
    >
      <rect width={width} height={height} fill="#f5f5f5" />
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
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14"
        fill="#999999"
        fontFamily="system-ui"
      >
        Product Image
      </text>
    </svg>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'pret', name: 'Premium Pret' },
    { id: 'octa-west', name: 'Octa West 2026' },
    { id: 'desire', name: 'Desire Collection' },
  ];

  const sizes = ['S', 'M', 'L', 'XL'];

  // Mock products data
  const allProducts = [
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `pret-${i + 1}`,
      name: `Premium Pret Piece ${i + 1}`,
      category: 'pret',
      price: 2999 + i * 500,
      sizes: ['S', 'M', 'L', 'XL'],
      inStock: i !== 2, // Make 3rd item out of stock
      discount: i === 0 ? 10 : 0, // First item has 10% off
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `octa-${i + 1}`,
      name: `Octa West Design ${i + 1}`,
      category: 'octa-west',
      price: 5999 + i * 800,
      sizes: ['S', 'M', 'L', 'XL'],
      inStock: true,
      discount: 0,
    })),
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `desire-${i + 1}`,
      name: `Desire Couture ${i + 1}`,
      category: 'desire',
      price: 8999 + i * 1000,
      sizes: ['S', 'M', 'L'],
      inStock: i !== 1, // Make 2nd item out of stock
      discount: 0,
    })),
  ];

  // Apply all filters
  const filteredProducts = allProducts.filter((product) => {
    // Category filter
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    // Size filter
    if (selectedSizes.length > 0) {
      const hasSelectedSize = selectedSizes.some((size) => product.sizes.includes(size));
      if (!hasSelectedSize) {
        return false;
      }
    }

    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animate products on load
    const ctx = gsap.context(() => {
      gsap.from('.product-item', {
        duration: 0.6,
        opacity: 0,
        y: 30,
        stagger: 0.08,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Update URL params
    const params = new URLSearchParams();
    if (categoryId !== 'all') {
      params.set('category', categoryId);
    }
    window.history.pushState(null, '', `/products?${params.toString()}`);
  };

  return (
    <div style={{ background: '#ffffff', color: '#000000' }}>
      <PageHeader isScrolled={isScrolled} />

      {/* Page Header */}
      <section
        style={{
          paddingTop: '120px',
          paddingBottom: '60px',
          paddingLeft: '60px',
          paddingRight: '60px',
          background: '#ffffff',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '16px', letterSpacing: '-1px' }}>
          Our Collections
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#666666', maxWidth: '600px', margin: '0 auto' }}>
          Explore our curated selection of premium fashion pieces
        </p>
      </section>

      {/* Category Tabs */}
      <section
        style={{
          paddingLeft: '60px',
          paddingRight: '60px',
          paddingBottom: '40px',
          background: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              style={{
                padding: '10px 20px',
                background: selectedCategory === cat.id ? '#000000' : '#ffffff',
                color: selectedCategory === cat.id ? '#ffffff' : '#000000',
                border: '1px solid #000000',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'system-ui',
                transition: 'none',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section
        style={{
          padding: '60px',
          background: '#ffffff',
          display: 'grid',
          gridTemplateColumns: showFilters ? '280px 1fr' : '1fr',
          gap: '40px',
          alignItems: 'start',
        }}
      >
        {/* Filters Sidebar */}
        {showFilters && (
          <div style={{ height: 'fit-content', position: 'sticky', top: '120px' }}>
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
                Search
              </h3>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  fontSize: '13px',
                  fontFamily: 'system-ui',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Price Filter */}
            <div style={{ marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid #e0e0e0' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
                Price Range
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  placeholder="Min"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    fontSize: '12px',
                    fontFamily: 'system-ui',
                    boxSizing: 'border-box',
                  }}
                />
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 15000])}
                  placeholder="Max"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    fontSize: '12px',
                    fontFamily: 'system-ui',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <p style={{ fontSize: '12px', color: '#666666', margin: 0 }}>
                PKR {priceRange[0].toLocaleString()} - PKR {priceRange[1].toLocaleString()}
              </p>
            </div>

            {/* Size Filter */}
            <div style={{ marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid #e0e0e0' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
                Size
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sizes.map((size) => (
                  <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSizes([...selectedSizes, size]);
                        } else {
                          setSelectedSizes(selectedSizes.filter((s) => s !== size));
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(searchQuery || priceRange[0] !== 0 || priceRange[1] !== 15000 || selectedSizes.length > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPriceRange([0, 15000]);
                  setSelectedSizes([]);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#ffffff',
                  color: '#000000',
                  border: '1px solid #e0e0e0',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'system-ui',
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '13px', color: '#666666', margin: 0 }}>
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '8px 16px',
                background: '#ffffff',
                color: '#000000',
                border: '1px solid #e0e0e0',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'system-ui',
              }}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-item"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e0e0e0',
                  overflow: 'hidden',
                  position: 'relative',
                  opacity: !product.inStock ? 0.6 : 1,
                }}
              >
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: '#000000',
                      color: '#ffffff',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      zIndex: 10,
                    }}
                  >
                    {product.discount}% OFF
                  </div>
                )}

                {/* Out of Stock Overlay - Only on image */}
                {!product.inStock && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '350px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 5,
                      pointerEvents: 'none',
                    }}
                  >
                    <div
                      style={{
                        background: '#ffffff',
                        padding: '12px 24px',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#000000',
                      }}
                    >
                      OUT OF STOCK
                    </div>
                  </div>
                )}

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
                    {categories.find((c) => c.id === product.category)?.name}
                  </p>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>
                    {product.name}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#666666', marginBottom: '12px' }}>
                    Available in {product.sizes.join(', ')}
                  </p>

                  {/* Price with Discount */}
                  <div style={{ marginBottom: '12px' }}>
                    {product.discount > 0 ? (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#000000', margin: 0 }}>
                          PKR {Math.round(product.price * (1 - product.discount / 100)).toLocaleString()}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: '#999999', textDecoration: 'line-through', margin: 0 }}>
                          PKR {product.price.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <p style={{ fontSize: '1rem', fontWeight: 700, color: '#000000', margin: 0 }}>
                        PKR {product.price.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {product.inStock ? (
                      <>
                        <button
                          onClick={() => window.location.href = `/products/${product.id}`}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            background: '#000000',
                            color: '#ffffff',
                            border: '1px solid #000000',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'system-ui',
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            if (wishlist.includes(product.id)) {
                              setWishlist(wishlist.filter((id) => id !== product.id));
                            } else {
                              setWishlist([...wishlist, product.id]);
                            }
                          }}
                          style={{
                            padding: '8px 12px',
                            background: wishlist.includes(product.id) ? '#000000' : '#ffffff',
                            color: wishlist.includes(product.id) ? '#ffffff' : '#000000',
                            border: '1px solid #000000',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'system-ui',
                          }}
                        >
                          {wishlist.includes(product.id) ? '♥' : '♡'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          if (wishlist.includes(product.id)) {
                            setWishlist(wishlist.filter((id) => id !== product.id));
                          } else {
                            setWishlist([...wishlist, product.id]);
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: wishlist.includes(product.id) ? '#000000' : '#ffffff',
                          color: wishlist.includes(product.id) ? '#ffffff' : '#000000',
                          border: '1px solid #000000',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'system-ui',
                        }}
                      >
                        {wishlist.includes(product.id) ? 'Added to Wishlist' : 'Add to Wishlist'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '1rem', color: '#666666' }}>No products found matching your filters.</p>
            </div>
          )}
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
