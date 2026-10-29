import { siteConfig } from '@/config';

export const metadata = {
    title: `About Austin Maina | AM LABS`,
    description: `Lead Software Engineer and Founder of AM LABS. Delivering enterprise-grade digital systems, custom web applications, and AI automations.`,
    keywords: [
        'Austin Maina',
        'AM LABS',
        'Software Engineer',
        'Lead Engineer',
        'Enterprise Digital Systems',
        'Full Stack Developer',
    ],
    alternates: {
        canonical: `${siteConfig.url}/about`,
    },
    openGraph: {
        title: 'About Austin Maina | AM LABS',
        description: 'Lead Software Engineer and Founder of AM LABS. Delivering enterprise-grade digital systems, custom web applications, and AI automations.',
        url: `${siteConfig.url}/about`,
        type: 'profile',
    },
};
