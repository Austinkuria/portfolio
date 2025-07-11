import { personalInfo, siteConfig, seoConfig } from '@/config';

export const skillsMetadata = {
    title: 'Skills & Expertise',
    description: seoConfig.descriptions.skills,
    alternates: {
        canonical: `${siteConfig.url}/skills`
    },
    openGraph: {
        title: `${personalInfo.name.first}'s Skills - Technical Expertise`,
        description: seoConfig.descriptions.skills,
        url: `${siteConfig.url}/skills`,
        images: [
            {
                url: `${siteConfig.url}/api/og?title=${encodeURIComponent('Skills & Expertise')}&description=${encodeURIComponent(seoConfig.descriptions.skills)}&type=page`,
                width: seoConfig.openGraph.images.width,
                height: seoConfig.openGraph.images.height,
                alt: `${personalInfo.name.full}'s Technical Skills`,
            },
        ],
    },
    twitter: {
        card: seoConfig.twitter.card,
        title: `${personalInfo.name.first}'s Skills - Technical Expertise`,
        description: seoConfig.descriptions.skills,
        images: [`${siteConfig.url}/api/og?title=${encodeURIComponent('Skills & Expertise')}&description=${encodeURIComponent(seoConfig.descriptions.skills)}&type=page`],
    },
};
