import { MetadataRoute } from 'next'
import { siteConfig } from '@/config';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/about',
                    '/projects',
                    '/skills',
                    '/contact',
                    '/images/'
                ],
                disallow: [
                    '/api/',
                    '/_next/',
                    '/static/',
                    '/*.json$',
                    '/*.js$',
                    '/*.css$'
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/api/', '/_next/'],
            }
        ],
        sitemap: `${siteConfig.url}/sitemap.xml`,
    }
}
