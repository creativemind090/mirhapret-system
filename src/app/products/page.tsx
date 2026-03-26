'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import api from '@/lib/api';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // ?sale=true and ?collection=slug URL param support
  const saleOnly = searchParams.get('sale') === 'true';
  const collectionSlug = searchParams.get('collection') || '';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wishlist_ids');
      if (saved) setWishlist(JSON.parse(saved));
    } catch {}
  }, []);

  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([{ id: 'all', name: 'All Products' }]);
  const [activePromotions, setActivePromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [catsRes, prodsRes, promoRes] = await Promise.allSettled([
        api.get('/categories'),
        api.get('/products?take=100'),
        api.get('/promotions/active'),
      ]);
      if (catsRes.status === 'fulfilled') {
        const cats = catsRes.value.data.data ?? [];
        setCategories([{ id: 'all', name: 'All Products' }, ...cats.map((c: any) => ({ id: c.id, name: c.name }))]);
      }
      if (prodsRes.status === 'fulfilled') {
        setAllProducts((prodsRes.value.data.data ?? []).map((p: any) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          category_id: p.category_id,
          category: p.category?.name ?? '',
          price: Number(p.price),
          sizes: p.available_sizes ?? [],
          inStock: p.is_active,
          main_image: p.main_image,
          is_featured: p.is_featured,
          created_at: p.created_at,
        })));
      }
      if (promoRes.status === 'fulfilled') {
        setActivePromotions(promoRes.value.data.data ?? []);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredProducts = allProducts.filter(p => {
    if (selectedCategory !== 'all' && p.category_id !== selectedCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (selectedSizes.length > 0 && !selectedSizes.some(s => p.sizes.includes(s))) return false;
    // ?sale=true — only show products that have an active discount
    if (saleOnly && getDiscount(p) === 0) return false;
    // ?collection=slug — filter by collection name keyword in category or product name
    if (collectionSlug) {
      const keyword = collectionSlug.toLowerCase().replace(/-/g, ' ');
      const inCategory = p.category?.toLowerCase().includes(keyword);
      const inName = p.name?.toLowerCase().includes(keyword);
      if (!inCategory && !inName) return false;
    }
    return true;
  });

  // Derived page title for sale/collection views
  const pageTitle = saleOnly
    ? 'Sale'
    : collectionSlug
    ? collectionSlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    : 'All Collections';

  const isNew = (product: any): boolean => {
    if (!product.created_at) return false;
    return Date.now() - new Date(product.created_at).getTime() < 3 * 24 * 60 * 60 * 1000;
  };

  const getDiscount = (product: any): number => {
    const global = activePromotions.find(p => p.promotion_scope === 'global' && p.discount_type === 'percentage');
    const category = activePromotions.find(p => p.promotion_scope === 'category' && p.category_id === product.category_id && p.discount_type === 'percentage');
    const best = [global, category].filter(Boolean).reduce((max: any, p: any) =>
      !max || Number(p.discount_value) > Number(max.discount_value) ? p : max, null);
    return best ? Number(best.discount_value) : 0;
  };

  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
    const params = new URLSearchParams();
    if (id !== 'all') params.set('category', id);
    window.history.pushState(null, '', `/products${params.toString() ? '?' + params : ''}`);
  };

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MirhaPret Collection',
    description: 'Browse premium Pakistani pret, Octa West, and Desire collections.',
    url: 'https://mirhapret.com/products',
    provider: { '@type': 'Organization', name: 'MirhaPret' },
  };

  return (
    <div style={{ background: '#fff', color: '#000' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <SiteHeader />

      {/* ─── Page Hero ─────────────────────────────────────── */}
      <section style={{
        background: '#0e0e0e',
        padding: '60px 60px 48px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '24px',
        flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#c8a96e', fontWeight: 600, marginBottom: '12px' }}>
            MirhaPret
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, letterSpacing: '-1.5px', color: '#fff' }}>
            {pageTitle}
          </h1>
        </div>
        {!loading && (
          <p style={{ fontSize: '13px', color: '#555' }}>
            {filteredProducts.length} piece{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        )}
      </section>

      {/* ─── Category Tabs ─────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid #e8e8e8', padding: '0 60px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '0', minWidth: 'max-content' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              style={{
                padding: '16px 24px',
                background: 'transparent',
                color: selectedCategory === cat.id ? '#000' : '#bbb',
                border: 'none',
                borderBottom: selectedCategory === cat.id ? '2px solid #000' : '2px solid transparent',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Body: Sidebar + Grid ──────────────────────────── */}
      <div className="products-page-body" style={{ display: 'flex', alignItems: 'flex-start', gap: '0' }}>

        {/* Filters sidebar */}
        {showFilters && (
          <aside className="products-page-sidebar" style={{
            width: '260px',
            flexShrink: 0,
            padding: '40px 32px',
            borderRight: '1px solid #e8e8e8',
            position: 'sticky',
            top: '96px',
            maxHeight: 'calc(100vh - 96px)',
            overflowY: 'auto',
            alignSelf: 'flex-start',
          }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '28px', color: '#000' }}>
              Filter
            </p>

            {/* Search */}
            <div style={{ marginBottom: '32px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px', color: '#000' }}>Search</p>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', fontSize: '13px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #e8e8e8' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px', color: '#000' }}>Price (PKR)</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="number" value={priceRange[0]} onChange={e => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])} placeholder="Min" style={{ flex: 1, padding: '10px', border: '1.5px solid #e8e8e8', fontSize: '12px', fontFamily: 'inherit', outline: 'none', minWidth: 0 }} />
                <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])} placeholder="Max" style={{ flex: 1, padding: '10px', border: '1.5px solid #e8e8e8', fontSize: '12px', fontFamily: 'inherit', outline: 'none', minWidth: 0 }} />
              </div>
            </div>

            {/* Size */}
            <div style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #e8e8e8' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px', color: '#000' }}>Size</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
                    style={{
                      padding: '7px 14px',
                      border: `1.5px solid ${selectedSizes.includes(size) ? '#000' : '#e8e8e8'}`,
                      background: selectedSizes.includes(size) ? '#000' : '#fff',
                      color: selectedSizes.includes(size) ? '#fff' : '#666',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            {(searchQuery || priceRange[0] !== 0 || priceRange[1] !== 50000 || selectedSizes.length > 0) && (
              <button
                onClick={() => { setSearchQuery(''); setPriceRange([0, 50000]); setSelectedSizes([]); }}
                style={{ width: '100%', padding: '11px', background: '#fff', color: '#000', border: '1.5px solid #000', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Clear Filters
              </button>
            )}
          </aside>
        )}

        {/* Products grid */}
        <div className="products-page-grid" style={{ flex: 1, padding: '40px 40px 80px' }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <p style={{ fontSize: '13px', color: '#999' }}>
              {loading ? 'Loading…' : `${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''}`}
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{ padding: '9px 18px', background: '#fff', color: '#000', border: '1.5px solid #000', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {!loading && filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <p style={{ fontSize: '1rem', color: '#999', marginBottom: '24px' }}>No products found matching your filters.</p>
              <button onClick={() => { setSearchQuery(''); setPriceRange([0, 50000]); setSelectedSizes([]); setSelectedCategory('all'); }} style={{ padding: '14px 32px', background: '#000', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>
                Clear All Filters
              </button>
            </div>
          )}

          <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: showFilters ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)', gap: '24px' }}>
            {filteredProducts.map((product, idx) => {
              const isHovered = hoveredProduct === product.id;
              return (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => window.location.href = `/products/${product.slug || product.id}`}
                  style={{ cursor: 'pointer', opacity: product.inStock ? 1 : 0.5 }}
                >
                  {/* Image */}
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#f4f4f4', position: 'relative', marginBottom: '14px' }}>
                    {product.main_image ? (
                      <Image
                        src={product.main_image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        priority={idx < 4}
                        style={{ objectFit: 'cover', transform: isHovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.5s ease' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: isHovered ? '#ececec' : '#f4f4f4', transition: 'background 0.3s' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ddd', letterSpacing: '-1px' }}>
                          {product.name.slice(0, 2).toUpperCase()}
                        </span>
                        <span style={{ fontSize: '9px', color: '#ccc', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '6px' }}>MirhaPret</span>
                      </div>
                    )}

                    {/* SALE / NEW tags */}
                    <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 2 }}>
                      {getDiscount(product) > 0 && (
                        <span style={{ background: '#c8a96e', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '4px 9px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                          SALE
                        </span>
                      )}
                      {isNew(product) && (
                        <span style={{ background: '#111', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '4px 9px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Quick view */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'rgba(0,0,0,0.82)', padding: '12px', textAlign: 'center',
                      color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
                      transition: 'all 0.25s ease',
                    }}>
                      View Product
                    </div>

                    {/* Wishlist */}
                    <button
                      onClick={e => { e.stopPropagation(); setWishlist(prev => prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]); }}
                      style={{
                        position: 'absolute', top: '10px', right: '10px',
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: '#fff', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', opacity: isHovered || wishlist.includes(product.id) ? 1 : 0,
                        transition: 'opacity 0.2s',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                      }}
                    >
                      {wishlist.includes(product.id) ? '♥' : '♡'}
                    </button>

                    {!product.inStock && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ background: '#000', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '6px 14px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '4px', fontWeight: 600 }}>
                    {product.category || 'MirhaPret'}
                  </p>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#000', marginBottom: '5px', lineHeight: 1.3 }}>{product.name}</h4>
                  {product.sizes.length > 0 && (
                    <p style={{ fontSize: '11px', color: '#ccc', marginBottom: '7px' }}>
                      {product.sizes.slice(0, 4).join(' · ')}{product.sizes.length > 4 ? ' +more' : ''}
                    </p>
                  )}
                  {(() => {
                    const disc = getDiscount(product);
                    const salePrice = disc > 0 ? Math.round(product.price * (1 - disc / 100)) : 0;
                    return disc > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <p style={{ fontSize: '14px', fontWeight: 800, color: '#c8a96e', margin: 0 }}>
                          PKR {salePrice.toLocaleString()}
                        </p>
                        <p style={{ fontSize: '12px', color: '#aaa', textDecoration: 'line-through', margin: 0 }}>
                          PKR {product.price.toLocaleString()}
                        </p>
                        <span style={{ fontSize: '10px', fontWeight: 700, background: '#c8a96e', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>
                          {disc}% OFF
                        </span>
                      </div>
                    ) : (
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#000', margin: 0 }}>
                        PKR {product.price.toLocaleString()}
                      </p>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
