import { Metadata } from 'next';
import { personalInfo, siteConfig } from '@/config';

export const metadata: Metadata = {
    title: `Featured Projects | ${personalInfo.name.full}`,
    description: 'Explore my portfolio of full-stack web applications, including e-commerce platforms, attendance systems, and modern web solutions.',
    openGraph: {
        title: `Featured Projects | ${personalInfo.name.full}`,
        description: 'Explore my portfolio of full-stack web applications, including e-commerce platforms, attendance systems, and modern web solutions.',
        url: `${siteConfig.url}/projects`,
        type: 'website',
        images: [
            {
                url: '/images/clinique-beauty.png',
                width: 1200,
                height: 630,
                alt: `Featured Projects by ${personalInfo.name.full}`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `Featured Projects | ${personalInfo.name.full}`,
        description: 'Full-stack web applications and modern solutions',
        images: ['/images/clinique-beauty.png'],
    },
};
