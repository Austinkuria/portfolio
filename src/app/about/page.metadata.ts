import { siteConfig } from '@/config';

export const metadata = {
    title: `About Austin Maina | Web Studio Portfolio`,
    description: `Learn more about Austin Maina, a developer based in Nairobi, Kenya who builds client-ready websites, landing pages, and lightweight web apps.`,
    keywords: [
        'Austin Maina',
        'Austin Maina about',
        'About Austin Maina',
        'Full Stack Developer Kenya',
        'Software Engineer Nairobi',
        'Web Developer biography',
    ],
    alternates: {
        canonical: `${siteConfig.url}/about`,
    },
    openGraph: {
        title: 'About Austin Maina | Web Studio Portfolio',
        description: 'Learn more about Austin Maina, a developer based in Nairobi, Kenya who builds client-ready websites, landing pages, and lightweight web apps.',
        url: `${siteConfig.url}/about`,
        type: 'profile',
    },
};
