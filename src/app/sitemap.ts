import type { MetadataRoute } from 'next';
import { blogs } from '@/data/blogs';

const siteUrl = 'https://mirhapret.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: siteUrl, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${siteUrl}/products`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${siteUrl}/blog`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${siteUrl}/about`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${siteUrl}/our-story`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${siteUrl}/contact`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${siteUrl}/faq`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${siteUrl}/shipping`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${siteUrl}/returns`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${siteUrl}/size-guide`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${siteUrl}/careers`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${siteUrl}/privacy`, priority: 0.4, changeFrequency: 'yearly' as const },
    { url: `${siteUrl}/terms`, priority: 0.4, changeFrequency: 'yearly' as const },
    { url: `${siteUrl}/signin`, priority: 0.3, changeFrequency: 'monthly' as const },
  ];

  const blogPages = blogs.map(post => ({
    url: `${siteUrl}/blog/${post.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
    lastModified: new Date(post.date),
  }));

  return [...staticPages, ...blogPages];
}
