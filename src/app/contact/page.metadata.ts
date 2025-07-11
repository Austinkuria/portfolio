import { personalInfo, siteConfig, seoConfig } from '@/config';

export const contactMetadata = {
    title: 'Contact',
    description: seoConfig.descriptions.contact,
    alternates: {
        canonical: `${siteConfig.url}/contact`
    },
    openGraph: {
        title: `Contact ${personalInfo.name.first} - Get in Touch`,
        description: seoConfig.descriptions.contact,
        url: `${siteConfig.url}/contact`,
        images: [
            {
                url: `${siteConfig.url}/api/og?title=${encodeURIComponent(`Contact ${personalInfo.name.first}`)}&description=${encodeURIComponent(seoConfig.descriptions.contact)}&type=page`,
                width: seoConfig.openGraph.images.width,
                height: seoConfig.openGraph.images.height,
                alt: `Contact ${personalInfo.name.full}`,
            },
        ],
    },
    twitter: {
        card: seoConfig.twitter.card,
        title: `Contact ${personalInfo.name.first} - Get in Touch`,
        description: seoConfig.descriptions.contact,
        images: [`${siteConfig.url}/api/og?title=${encodeURIComponent(`Contact ${personalInfo.name.first}`)}&description=${encodeURIComponent(seoConfig.descriptions.contact)}&type=page`],
    },
};
