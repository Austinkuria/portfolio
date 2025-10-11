import { siteConfig } from '@/config';

export const metadata = {
    title: `About Austin Maina | Full Stack Developer Portfolio`,
    description: `Learn more about Austin Maina, a professional Full Stack Developer & Software Engineer based in Nairobi, Kenya. Discover my journey, skills in React, Next.js, Node.js, TypeScript, Python, and Django.`,
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
        title: 'About Austin Maina | Full Stack Developer',
        description: 'Learn more about Austin Maina, a professional Full Stack Developer & Software Engineer based in Nairobi, Kenya.',
        url: `${siteConfig.url}/about`,
        type: 'profile',
    },
};
