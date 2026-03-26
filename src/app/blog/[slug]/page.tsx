import { notFound } from 'next/navigation';
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

interface Props { params: Promise<{ slug: string }> }

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API}/blogs`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []).map((b: any) => ({ slug: b.slug }));
  } catch {
    return [];
  }
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
    tags: Array.isArray(b.tags) ? b.tags : [],
    content: b.content_html ?? '',
    coverImage: b.cover_image || '',
  };
}

async function fetchPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API}/blogs/slug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return apiToPost(json.data ?? json);
  } catch {
    return null;
  }
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

const siteUrl = 'https://mirhapret.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      url: `${siteUrl}/blog/${post.slug}`,
      siteName: 'MirhaPret',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
    alternates: { canonical: `${siteUrl}/blog/${post.slug}` },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([fetchPost(slug), fetchAllPosts()]);
  if (!post) notFound();

  const others = allPosts.filter(b => b.slug !== post.slug).slice(0, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'MirhaPret', url: siteUrl },
    datePublished: post.date,
    keywords: post.tags.join(', '),
    url: `${siteUrl}/blog/${post.slug}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
    ],
  };

  return (
    <div style={{ background: '#fff', color: '#000', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <SiteHeader />

      {/* Hero cover */}
      <div style={{
        minHeight: 'clamp(280px, 40vw, 480px)',
        background: post.coverImage ? `url(${post.coverImage}) center/cover no-repeat` : post.coverGradient,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.65) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: 'clamp(24px, 5vw, 60px)',
          maxWidth: 860,
        }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#c8a96e', display: 'block', marginBottom: 12 }}>
            {post.category}
          </span>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, color: '#fff', marginBottom: 16 }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'rgba(255,255,255,0.7)', flexWrap: 'wrap' }}>
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px, 5vw, 72px) clamp(24px, 5vw, 40px)' }}>
        <p style={{
          fontSize: 'clamp(16px, 2vw, 19px)', color: '#333', lineHeight: 1.8,
          fontStyle: 'italic', paddingBottom: 32, marginBottom: 32,
          borderBottom: '1px solid #e8e8e8',
        }}>
          {post.excerpt}
        </p>

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e8e8e8', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#999', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginRight: 4 }}>Tags</span>
          {post.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, padding: '5px 12px', border: '1px solid #e8e8e8',
              color: '#555', letterSpacing: '0.5px',
            }}>
              {tag}
            </span>
          ))}
        </div>

        <div style={{
          marginTop: 48, padding: '36px 40px',
          background: '#0f0f0f', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#c8a96e', marginBottom: 8 }}>Explore the Collection</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Discover pieces crafted for the modern Pakistani woman.</p>
          </div>
          <a href="/products" style={{
            padding: '13px 28px', border: '1px solid #c8a96e', color: '#c8a96e',
            fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
            textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            Shop Now
          </a>
        </div>
      </div>

      {others.length > 0 && (
        <section style={{ borderTop: '1px solid #e8e8e8', padding: 'clamp(40px, 5vw, 72px) clamp(24px, 5vw, 60px)' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', fontWeight: 600, marginBottom: 40, textAlign: 'center' }}>
            More from the Journal
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, maxWidth: 1100, margin: '0 auto' }} className="blog-more-grid">
            {others.map(other => (
              <a key={other.slug} href={`/blog/${other.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ height: 160, background: other.coverImage ? `url(${other.coverImage}) center/cover no-repeat` : other.coverGradient, borderRadius: 4, marginBottom: 18 }} />
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#c8a96e', display: 'block', marginBottom: 8 }}>
                  {other.category}
                </span>
                <h4 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, color: '#000', marginBottom: 8 }}>{other.title}</h4>
                <p style={{ fontSize: 12, color: '#aaa' }}>{other.date} · {other.readTime}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .blog-content { font-size: 16px !important; line-height: 1.85 !important; color: #333 !important; }
        .blog-content h2 { font-size: 1.3rem !important; font-weight: 800 !important; letter-spacing: -0.3px !important; color: #000 !important; margin: 36px 0 14px !important; line-height: 1.3 !important; }
        .blog-content h3 { font-size: 1.1rem !important; font-weight: 700 !important; color: #000 !important; margin: 28px 0 12px !important; line-height: 1.35 !important; }
        .blog-content p { font-size: 16px !important; color: #444 !important; line-height: 1.85 !important; margin: 0 0 20px !important; }
        .blog-content strong { font-weight: 700 !important; color: #000 !important; }
        .blog-content p:last-child { margin-bottom: 0 !important; }
        .blog-content blockquote { border-left: 3px solid #c8a96e !important; padding: 4px 0 4px 20px !important; margin: 24px 0 !important; font-style: italic !important; color: #555 !important; }
        .blog-content hr { border: none !important; border-top: 1px solid #e8e8e8 !important; margin: 32px 0 !important; }
        .blog-content figure.blog-image { margin: 24px 0 !important; }
        .blog-content figure.blog-image img { width: 100% !important; border-radius: 6px !important; }
        .blog-content figure.blog-image figcaption { font-size: 12px !important; color: #999 !important; text-align: center !important; margin-top: 8px !important; font-style: italic !important; }
        .blog-content .blog-section { display: grid !important; gap: 24px !important; margin: 24px 0 !important; align-items: center !important; }
        .blog-content .blog-section.image-left { grid-template-columns: 40% 1fr !important; }
        .blog-content .blog-section.image-right { grid-template-columns: 1fr 40% !important; }
        .blog-content .blog-section.image-right img { order: 2 !important; }
        .blog-content .blog-section.image-right .section-text { order: 1 !important; }
        .blog-content .blog-section.image-top,
        .blog-content .blog-section.image-bottom { grid-template-columns: 1fr !important; }
        .blog-content .blog-section.image-bottom img { order: 2 !important; }
        .blog-content .blog-section img { width: 100% !important; border-radius: 6px !important; object-fit: cover !important; }
        @media (max-width: 768px) {
          .blog-more-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .blog-content .blog-section.image-left,
          .blog-content .blog-section.image-right { grid-template-columns: 1fr !important; }
          .blog-content .blog-section.image-right img,
          .blog-content .blog-section.image-right .section-text { order: unset !important; }
        }
      `}</style>

      <SiteFooter />
    </div>
  );
}
