import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { personalInfo, siteConfig, socialLinks } from '@/config';

const AboutClient = dynamic(() => import('./AboutClient'), {
  ssr: true,
});

export const metadata: Metadata = {
  title: 'About AM LABS | Austin Maina, Software Engineer',
  description:
    'AM LABS is an independent software studio founded by Austin Maina. Engineering digital systems, web applications, and API integrations with direct communication and full code ownership.',
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    title: 'About AM LABS | Austin Maina, Software Engineer',
    description:
      'AM LABS is an independent software studio founded by Austin Maina. Engineering digital systems, web applications, and API integrations with direct communication and full code ownership.',
    url: `${siteConfig.url}/about`,
    siteName: 'AM LABS',
    locale: 'en_US',
    type: 'profile',
    images: [
      {
        url: personalInfo.image,
        width: 800,
        height: 800,
        alt: 'Austin Maina - Software Engineer & Founder of AM LABS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About AM LABS | Austin Maina, Software Engineer',
    description:
      'AM LABS is an independent software studio founded by Austin Maina. Engineering digital systems, web applications, and API integrations.',
    images: [personalInfo.image],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Structured Data for search engines
const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': `${siteConfig.url}/about`,
      url: `${siteConfig.url}/about`,
      name: 'About AM LABS & Austin Maina',
      description:
        'Studio profile of AM LABS, founded by Austin Maina. Specializing in modern web applications, custom management systems, and API integrations with direct communication and full code ownership.',
      publisher: {
        '@id': `${siteConfig.url}/#organization`,
      },
    },
    {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#organization`,
      name: 'AM LABS',
      url: siteConfig.url,
      logo: `${siteConfig.url}${personalInfo.logo}`,
      founder: {
        '@id': `${siteConfig.url}/#founder`,
      },
      description:
        'Independent software engineering studio delivering custom enterprise systems, mobile-first web applications, and API architecture.',
    },
    {
      '@type': 'Person',
      '@id': `${siteConfig.url}/#founder`,
      name: personalInfo.name.full,
      jobTitle: 'Software Engineer & Studio Founder',
      worksFor: {
        '@id': `${siteConfig.url}/#organization`,
      },
      url: siteConfig.url,
      sameAs: [
        socialLinks.github,
        socialLinks.linkedin,
      ],
      knowsAbout: [
        'Software Architecture',
        'Payment Gateways (M-Pesa Daraja, Paystack)',
        'Microsoft Dynamics 365 Business Central',
        'Data Analysis & Dashboards (Python, Pandas)',
        'Technical SEO & Core Web Vitals',
        'Applied AI & Workflow Automation',
        'TypeScript',
        'Next.js',
        'React',
        'Node.js',
        'Python',
        'Django',
        'PostgreSQL',
        'Redis',
        'Docker',
        'Kenya Data Protection Act (2019)',
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <main>
        <AboutClient />
      </main>
    </>
  );
}
