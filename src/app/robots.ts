import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/my-dreams/'],
    },
    sitemap: 'https://www.dreamsenseai.org/sitemap.xml',
  };
}
