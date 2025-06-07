import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Featured Projects | Austin Maina',
    description: 'Explore my portfolio of full-stack web applications, including e-commerce platforms, attendance systems, and modern web solutions.',
    openGraph: {
        title: 'Featured Projects | Austin Maina',
        description: 'Explore my portfolio of full-stack web applications, including e-commerce platforms, attendance systems, and modern web solutions.',
        url: 'https://austinmaina.vercel.app/projects',
        type: 'website',
        images: [
            {
                url: '/images/clinique-beauty.png',
                width: 1200,
                height: 630,
                alt: 'Featured Projects by Austin Maina',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Featured Projects | Austin Maina',
        description: 'Full-stack web applications and modern solutions',
        images: ['/images/clinique-beauty.png'],
    },
};
