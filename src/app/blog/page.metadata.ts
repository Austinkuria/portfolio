import { personalInfo, siteConfig, seoConfig } from '@/config';

export const blogMetadata = {
    title: 'Blog',
    description: seoConfig.descriptions.blog,
    alternates: {
        canonical: `${siteConfig.url}/blog`
    },
    openGraph: {
        title: `${personalInfo.name.first}'s Blog - Web Development Insights`,
        description: seoConfig.descriptions.blog,
        url: `${siteConfig.url}/blog`,
        images: [
            {
                url: `${siteConfig.url}/api/og?title=${encodeURIComponent(`${personalInfo.name.first}'s Blog`)}&description=${encodeURIComponent(seoConfig.descriptions.blog)}&type=blog`,
                width: seoConfig.openGraph.images.width,
                height: seoConfig.openGraph.images.height,
                alt: `${personalInfo.name.full}'s Blog`,
            },
        ],
    },
    twitter: {
        card: seoConfig.twitter.card,
        title: `${personalInfo.name.first}'s Blog - Web Development Insights`,
        description: seoConfig.descriptions.blog,
        images: [`${siteConfig.url}/api/og?title=${encodeURIComponent(`${personalInfo.name.first}'s Blog`)}&description=${encodeURIComponent(seoConfig.descriptions.blog)}&type=blog`],
    },
};
