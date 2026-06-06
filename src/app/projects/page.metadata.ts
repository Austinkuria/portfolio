import { Metadata } from 'next';
import { personalInfo, siteConfig } from '@/config';

export const metadata: Metadata = {
    title: `Selected Work | ${personalInfo.name.full}`,
    description: 'Explore selected case studies and builds that show how I approach websites, landing pages, and full-stack work.',
    openGraph: {
        title: `Selected Work | ${personalInfo.name.full}`,
        description: 'Explore selected case studies and builds that show how I approach websites, landing pages, and full-stack work.',
        url: `${siteConfig.url}/projects`,
        type: 'website',
        images: [
            {
                url: '/images/clinique-beauty.png',
                width: 1200,
                height: 630,
                alt: `Selected work by ${personalInfo.name.full}`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `Selected Work | ${personalInfo.name.full}`,
        description: 'Selected case studies and web builds',
        images: ['/images/clinique-beauty.png'],
    },
};
