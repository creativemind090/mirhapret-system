import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import type { Metadata } from 'next';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  coverGradient: string;
  coverImage: string;
  tags: string[];
  content: string;
}

function apiToPost(b: any): BlogPost {
  return {
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt ?? '',
    category: b.category ?? 'General',
    author: b.author ?? 'MirhaPret Editorial',
    date: b.published_at ? new Date(b.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
    readTime: b.read_time ?? '5 min read',
    coverGradient: b.cover_gradient || 'linear-gradient(135deg, #1a1a1a 0%, #2d2010 100%)',
    coverImage: b.cover_image || '',
    tags: Array.isArray(b.tags) ? b.tags : [],
    content: b.content_html ?? '',
  };
}

async function fetchAllPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API}/blogs`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []).map(apiToPost);
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Style guides, trend reports, fabric education and care tips from MirhaPret — Pakistan\'s premium pret boutique.',
  openGraph: {
    title: 'The MirhaPret Journal — Style, Craft & Culture',
    description: 'Style guides, trend reports, fabric education and care tips from MirhaPret.',
    type: 'website',
    url: 'https://mirhapret.com/blog',
    siteName: 'MirhaPret',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The MirhaPret Journal',
    description: 'Style guides, trend reports, fabric education and care tips.',
  },
  alternates: { canonical: 'https://mirhapret.com/blog' },
};

export default async function BlogPage() {
  const blogs = await fetchAllPosts();

  return (
    <div style={{ background: '#fff', color: '#000', minHeight: '100vh' }}>
      <SiteHeader />

      {/* Hero */}
      <section style={{ borderBottom: '1px solid #e8e8e8', padding: '72px 60px 56px' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', fontWeight: 600, marginBottom: '14px' }}>
          The MirhaPret Journal
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.1, color: '#000', maxWidth: 600 }}>
          Style, Craft &<br />Culture.
        </h1>
      </section>

      {blogs.length === 0 ? (
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', color: '#999' }}>No articles published yet. Check back soon.</p>
        </div>
      ) : (
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 40px' }}>

          {/* Featured post */}
          {blogs[0] && (
            <a href={`/blog/${blogs[0].slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
                borderBottom: '1px solid #e8e8e8', margin: '0',
              }}
                className="blog-featured"
              >
                <div style={{ height: 420, background: blogs[0].coverImage ? `url(${blogs[0].coverImage}) center/cover no-repeat` : blogs[0].coverGradient, position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to right, transparent 60%, #fff)',
                  }} />
                </div>
                <div style={{ padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#c8a96e', marginBottom: 16 }}>
                    {blogs[0].category}
                  </span>
                  <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.2, color: '#000', marginBottom: 16 }}>
                    {blogs[0].title}
                  </h2>
                  <p style={{ fontSize: 15, color: '#555', lineHeight: 1.75, marginBottom: 28 }}>
                    {blogs[0].excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#999' }}>
                    <span>{blogs[0].date}</span>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#ccc', display: 'inline-block' }} />
                    <span>{blogs[0].readTime}</span>
                  </div>
                  <div style={{ marginTop: 28 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#000',
                      borderBottom: '1.5px solid #000', paddingBottom: 2,
                    }}>
                      Read Article →
                    </span>
                  </div>
                </div>
              </div>
            </a>
          )}

          {/* Rest of posts */}
          {blogs.length > 1 && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 0, borderBottom: '1px solid #e8e8e8',
            }}
              className="blog-grid"
            >
              {blogs.slice(1).map((post, i) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="blog-card"
                  style={{
                    textDecoration: 'none', color: 'inherit', display: 'block',
                    borderRight: i < blogs.length - 2 ? '1px solid #e8e8e8' : 'none',
                    padding: '48px 36px',
                  }}
                >
                  <div style={{
                    height: 200, background: post.coverImage ? `url(${post.coverImage}) center/cover no-repeat` : post.coverGradient,
                    borderRadius: 4, marginBottom: 24, overflow: 'hidden',
                  }} />
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#c8a96e', display: 'block', marginBottom: 10 }}>
                    {post.category}
                  </span>
                  <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.35, color: '#000', marginBottom: 12 }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7, marginBottom: 20 }}>
                    {post.excerpt}
                  </p>
                  <div style={{ fontSize: 11, color: '#aaa', display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </a>
              ))}
            </div>
          )}

        </div>
      )}

      <style>{`
        .blog-card { transition: background 0.2s; }
        .blog-card:hover { background: #faf9f6; }
        @media (max-width: 768px) {
          .blog-featured { grid-template-columns: 1fr !important; }
          .blog-featured > div:first-child { height: 240px !important; }
          .blog-featured > div:last-child { padding: 32px 24px !important; }
          .blog-grid { grid-template-columns: 1fr !important; }
          .blog-grid > a { border-right: none !important; border-bottom: 1px solid #e8e8e8; padding: 36px 24px !important; }
        }
      `}</style>

      <SiteFooter />
    </div>
  );
}
