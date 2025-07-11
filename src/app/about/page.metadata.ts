import { personalInfo, siteConfig, seoConfig } from '@/config';

export const aboutMetadata = {
    title: `About ${personalInfo.name.first}`,
    description: seoConfig.descriptions.about,
    alternates: {
        canonical: `${siteConfig.url}/about`
    },
    openGraph: {
        title: `About ${personalInfo.name.first} - ${personalInfo.title}`,
        description: seoConfig.descriptions.about,
        url: `${siteConfig.url}/about`,
        images: [
            {
                url: `${siteConfig.url}/api/og?title=${encodeURIComponent(`About ${personalInfo.name.first}`)}&description=${encodeURIComponent(seoConfig.descriptions.about)}&type=page`,
                width: seoConfig.openGraph.images.width,
                height: seoConfig.openGraph.images.height,
                alt: `About ${personalInfo.name.full}`,
            },
        ],
    },
    twitter: {
        card: seoConfig.twitter.card,
        title: `About ${personalInfo.name.first} - ${personalInfo.title}`,
        description: seoConfig.descriptions.about,
        images: [`${siteConfig.url}/api/og?title=${encodeURIComponent(`About ${personalInfo.name.first}`)}&description=${encodeURIComponent(seoConfig.descriptions.about)}&type=page`],
    },
};
