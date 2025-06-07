import { MetadataRoute } from 'next'

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
                    '/blog',
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
        sitemap: 'https://austinmaina.vercel.app/sitemap.xml',
    }
}
