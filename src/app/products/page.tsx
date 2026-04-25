'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import api from '@/lib/api';

const GOLD = '#c8a96e';
const DARK = '#080808';
const CREAM = '#FAFAF8';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
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
  const sizes = ['S', 'M', 'L'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [catsRes, prodsRes, promoRes] = await Promise.allSettled([
        api.get('/categories'), api.get('/products?take=100'), api.get('/promotions/active'),
      ]);
      if (catsRes.status === 'fulfilled') {
        const cats = catsRes.value.data.data ?? [];
        setCategories([{ id: 'all', name: 'All Products' }, ...cats.map((c: any) => ({ id: c.id, name: c.name }))]);
      }
      if (prodsRes.status === 'fulfilled') {
        setAllProducts((prodsRes.value.data.data ?? []).map((p: any) => ({
          id: p.id, slug: p.slug, name: p.name, category_id: p.category_id,
          category: p.category?.name ?? '', price: Number(p.price),
          sizes: p.available_sizes ?? [], inStock: p.is_active,
          main_image: p.main_image, is_featured: p.is_featured, created_at: p.created_at,
        })));
      }
      if (promoRes.status === 'fulfilled') setActivePromotions(promoRes.value.data.data ?? []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getDiscount = (product: any): number => {
    const global = activePromotions.find(p => p.promotion_scope === 'global' && p.discount_type === 'percentage');
    const category = activePromotions.find(p => p.promotion_scope === 'category' && p.category_id === product.category_id && p.discount_type === 'percentage');
    const best = [global, category].filter(Boolean).reduce((max: any, p: any) =>
      !max || Number(p.discount_value) > Number(max.discount_value) ? p : max, null);
    return best ? Number(best.discount_value) : 0;
  };

  const filteredProducts = allProducts.filter(p => {
    if (selectedCategory !== 'all' && p.category_id !== selectedCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (selectedSizes.length > 0 && !selectedSizes.some(s => p.sizes.includes(s))) return false;
    if (saleOnly && getDiscount(p) === 0) return false;
    if (collectionSlug) {
      const keyword = collectionSlug.toLowerCase().replace(/-/g, ' ');
      if (!p.category?.toLowerCase().includes(keyword) && !p.name?.toLowerCase().includes(keyword)) return false;
    }
    return true;
  });

  const pageTitle = saleOnly ? 'Sale' : collectionSlug
    ? collectionSlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    : 'All Collections';

  const isNew = (product: any): boolean => {
    if (!product.created_at) return false;
    return Date.now() - new Date(product.created_at).getTime() < 3 * 24 * 60 * 60 * 1000;
  };

  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
    const params = new URLSearchParams();
    if (id !== 'all') params.set('category', id);
    window.history.pushState(null, '', `/products${params.toString() ? '?' + params : ''}`);
  };

  const collectionJsonLd = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: 'MirhaPret Collection',
    description: 'Browse premium Pakistani pret, Octa West, and Desire collections.',
    url: 'https://mirhapret.com/products',
    provider: { '@type': 'Organization', name: 'MirhaPret' },
  };

  return (
    <div style={{ background: CREAM, color: '#0a0a0a', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <SiteHeader />

      {/* ─── Hero ─── */}
      <section style={{
        background: DARK, padding: 'clamp(40px,6vw,72px) clamp(24px,6vw,80px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: '24px', flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,1) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div style={{ zIndex: 1 }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, marginBottom: '10px', fontWeight: 600 }}>MirhaPret</p>
          <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(2.4rem,5vw,4.2rem)', fontWeight: 600, fontStyle: 'italic', letterSpacing: '-1px', color: '#fff', lineHeight: 1 }}>
            {pageTitle}
          </h1>
        </div>
        {!loading && (
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#555', zIndex: 1, letterSpacing: '1px' }}>
            {filteredProducts.length} piece{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        )}
      </section>

      {/* ─── Category Tabs ─── */}
      <div style={{ borderBottom: '1px solid #e8e4e0', background: '#fff', padding: '0 clamp(20px,5vw,80px)', overflowX: 'auto' }}>
        <div style={{ display: 'flex', minWidth: 'max-content' }}>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => handleCategoryChange(cat.id)}
              style={{
                padding: '16px 24px', background: 'transparent', border: 'none',
                borderBottom: selectedCategory === cat.id ? `2px solid ${DARK}` : '2px solid transparent',
                fontFamily: "'Montserrat', sans-serif", fontSize: '11px', fontWeight: 600,
                letterSpacing: '2px', textTransform: 'uppercase',
                color: selectedCategory === cat.id ? DARK : '#bbb',
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.2s',
              }}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Body: Sidebar + Grid ─── */}
      <div className="products-page-body" style={{ display: 'flex', alignItems: 'flex-start' }}>

        {/* Filters sidebar */}
        {showFilters && (
          <aside className="products-page-sidebar" style={{
            width: '260px', flexShrink: 0,
            padding: '40px 32px', borderRight: '1px solid #e8e4e0',
            background: '#fff', position: 'sticky', top: '96px',
            maxHeight: 'calc(100vh - 96px)', overflowY: 'auto', alignSelf: 'flex-start',
          }}>
            <div style={{ width: '28px', height: '1px', background: GOLD, marginBottom: '24px' }} />
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '28px', color: '#888' }}>Refine</p>

            {/* Search */}
            <div style={{ marginBottom: '32px' }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', color: '#aaa' }}>Search</p>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #e0dcd8', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', outline: 'none', boxSizing: 'border-box', background: '#fff' }} />
            </div>

            {/* Price */}
            <div style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #f0ece8' }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', color: '#aaa' }}>Price (PKR)</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="number" value={priceRange[0]} onChange={e => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])} placeholder="Min"
                  style={{ flex: 1, padding: '10px', border: '1px solid #e0dcd8', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', outline: 'none', minWidth: 0 }} />
                <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])} placeholder="Max"
                  style={{ flex: 1, padding: '10px', border: '1px solid #e0dcd8', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', outline: 'none', minWidth: 0 }} />
              </div>
            </div>

            {/* Sizes */}
            <div style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #f0ece8' }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px', color: '#aaa' }}>Size</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {sizes.map(size => (
                  <button key={size}
                    onClick={() => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
                    style={{
                      padding: '6px 12px',
                      border: `1px solid ${selectedSizes.includes(size) ? DARK : '#e0dcd8'}`,
                      background: selectedSizes.includes(size) ? DARK : '#fff',
                      color: selectedSizes.includes(size) ? '#fff' : '#888',
                      fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 600,
                      letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {(searchQuery || priceRange[0] !== 0 || priceRange[1] !== 50000 || selectedSizes.length > 0) && (
              <button onClick={() => { setSearchQuery(''); setPriceRange([0, 50000]); setSelectedSizes([]); }}
                style={{ width: '100%', padding: '11px', background: 'transparent', color: DARK, border: `1px solid ${DARK}`, fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>
                Clear Filters
              </button>
            )}
          </aside>
        )}

        {/* Products Grid */}
        <div className="products-page-grid" style={{ flex: 1, padding: '40px clamp(20px,4vw,48px) 80px' }}>

          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#aaa', letterSpacing: '1px', fontWeight: 300 }}>
              {loading ? 'Loading…' : `${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''}`}
            </p>
            <button onClick={() => setShowFilters(!showFilters)}
              style={{ padding: '9px 18px', background: 'transparent', color: DARK, border: `1px solid #e0dcd8`, fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'border-color 0.2s' }}>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {!loading && filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ width: '1px', height: '48px', background: GOLD, margin: '0 auto 28px' }} />
              <p style={{ fontFamily: "'Cormorant', serif", fontSize: '1.3rem', fontStyle: 'italic', color: '#888', marginBottom: '28px' }}>No pieces found</p>
              <button onClick={() => { setSearchQuery(''); setPriceRange([0, 50000]); setSelectedSizes([]); setSelectedCategory('all'); }}
                style={{ padding: '12px 32px', background: DARK, color: '#fff', border: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', cursor: 'pointer' }}>
                Clear All Filters
              </button>
            </div>
          )}

          <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: showFilters ? 'repeat(3,1fr)' : 'repeat(4,1fr)', gap: '28px' }}>
            {filteredProducts.map((product, idx) => {
              const isHovered = hoveredProduct === product.id;
              const disc = getDiscount(product);
              const salePrice = disc > 0 ? Math.round(product.price * (1 - disc / 100)) : 0;
              return (
                <div key={product.id}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => window.location.href = `/products/${product.slug || product.id}`}
                  style={{ cursor: 'pointer', opacity: product.inStock ? 1 : 0.5 }}>

                  {/* Image */}
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#ede9e4', position: 'relative', marginBottom: '14px' }}>
                    {product.main_image ? (
                      <Image src={product.main_image} alt={product.name} fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        priority={idx < 4}
                        style={{ objectFit: 'cover', transform: isHovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: isHovered ? '#e8e4e0' : '#ede9e4', transition: 'background 0.3s' }}>
                        <span style={{ fontFamily: "'Cormorant', serif", fontSize: '2rem', fontWeight: 600, fontStyle: 'italic', color: '#ccc' }}>{product.name.slice(0, 2).toUpperCase()}</span>
                        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '8px', color: '#bbb', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '6px' }}>MirhaPret</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 2 }}>
                      {disc > 0 && (
                        <span style={{ background: GOLD, color: '#fff', fontFamily: "'Montserrat', sans-serif", fontSize: '8px', fontWeight: 800, padding: '3px 8px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>SALE</span>
                      )}
                      {isNew(product) && (
                        <span style={{ background: DARK, color: '#fff', fontFamily: "'Montserrat', sans-serif", fontSize: '8px', fontWeight: 800, padding: '3px 8px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>NEW</span>
                      )}
                    </div>

                    {/* Quick view overlay */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'rgba(8,8,8,0.85)', padding: '12px', textAlign: 'center',
                      fontFamily: "'Montserrat', sans-serif", color: '#fff', fontSize: '9px',
                      fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase',
                      opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
                      transition: 'all 0.25s ease',
                    }}>View Product</div>

                    {/* Wishlist */}
                    <button
                      onClick={e => { e.stopPropagation(); setWishlist(prev => prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]); }}
                      style={{
                        position: 'absolute', top: '10px', right: '10px',
                        width: '32px', height: '32px', background: '#fff', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', opacity: isHovered || wishlist.includes(product.id) ? 1 : 0,
                        transition: 'opacity 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        color: wishlist.includes(product.id) ? GOLD : '#555',
                      }}>
                      {wishlist.includes(product.id) ? '♥' : '♡'}
                    </button>

                    {!product.inStock && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ background: DARK, color: '#fff', fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, padding: '6px 14px', letterSpacing: '2px', textTransform: 'uppercase' }}>Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '5px', fontWeight: 600 }}>{product.category || 'MirhaPret'}</p>
                  <h4 style={{ fontFamily: "'Cormorant', serif", fontSize: '15px', fontWeight: 600, fontStyle: 'italic', color: '#0a0a0a', marginBottom: '5px', lineHeight: 1.3 }}>{product.name}</h4>
                  {product.sizes.length > 0 && (
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#ccc', marginBottom: '8px', letterSpacing: '0.5px' }}>
                      {product.sizes.slice(0, 4).join(' · ')}{product.sizes.length > 4 ? ' +more' : ''}
                    </p>
                  )}
                  {disc > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 700, color: GOLD, margin: 0 }}>PKR {salePrice.toLocaleString()}</p>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#bbb', textDecoration: 'line-through', margin: 0 }}>PKR {product.price.toLocaleString()}</p>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, background: GOLD, color: '#fff', padding: '2px 6px', letterSpacing: '1px' }}>{disc}% OFF</span>
                    </div>
                  ) : (
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>PKR {product.price.toLocaleString()}</p>
                  )}
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
