import { Metadata } from 'next';
import { personalInfo, siteConfig, seoConfig } from '@/config';

export const projectsMetadata: Metadata = {
    title: 'Projects',
    description: seoConfig.descriptions.projects,
    openGraph: {
        title: `${personalInfo.name.first}'s Projects - Web Development Portfolio`,
        description: seoConfig.descriptions.projects,
        url: `${siteConfig.url}/projects`,
        type: 'website',
        images: [
            {
                url: `${siteConfig.url}/api/og?title=${encodeURIComponent('Projects Portfolio')}&description=${encodeURIComponent(seoConfig.descriptions.projects)}&type=project`,
                width: seoConfig.openGraph.images.width,
                height: seoConfig.openGraph.images.height,
                alt: `${personalInfo.name.full}'s Projects`,
            },
        ],
    },
    twitter: {
        card: seoConfig.twitter.card,
        title: `${personalInfo.name.first}'s Projects - Web Development Portfolio`,
        description: seoConfig.descriptions.projects,
        images: [`${siteConfig.url}/api/og?title=${encodeURIComponent('Projects Portfolio')}&description=${encodeURIComponent(seoConfig.descriptions.projects)}&type=project`],
    },
    alternates: {
        canonical: `${siteConfig.url}/projects`
    },
};
