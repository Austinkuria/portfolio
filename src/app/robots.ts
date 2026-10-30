import { MetadataRoute } from 'next';
import { siteConfig } from '@/config';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/services',
                    '/skills',
                    '/projects',
                    '/process',
                    '/about',
                    '/contact',
                    '/images/',
                ],
                disallow: [
                    '/api/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/api/'],
            },
        ],
        sitemap: `${siteConfig.url}/sitemap.xml`,
    };
}
