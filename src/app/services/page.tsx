import type { Metadata } from 'next';
import { siteConfig } from '@/config';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Services Offered | AM LABS',
  description:
    'Explore software engineering and web development services offered by AM LABS: mobile-first web applications, technical SEO, enterprise systems, API integrations, and AI workflow automation.',
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
  openGraph: {
    title: 'Services Offered | AM LABS',
    description:
      'Explore software engineering and web development services offered by AM LABS: mobile-first web applications, technical SEO, enterprise systems, API integrations, and AI workflow automation.',
    url: `${siteConfig.url}/services`,
    siteName: 'AM LABS',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services Offered | AM LABS',
    description:
      'Explore software engineering and web development services offered by AM LABS: mobile-first web applications, technical SEO, enterprise systems, API integrations, and AI workflow automation.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Structured Data for search engines
const servicesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Services Offered',
  provider: {
    '@type': 'Organization',
    name: 'AM LABS',
    url: siteConfig.url,
  },
  serviceType: 'Software Engineering & Web Application Development',
  description:
    'Full-lifecycle software engineering services by AM LABS including fast mobile-first websites, technical SEO, custom enterprise management systems, API architecture, data platforms, and applied AI automation.',
  areaServed: 'Worldwide',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'AM LABS Services Offered',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Websites & High-Performance Web Applications',
          description:
            'Mobile-first responsive web applications, semantic HTML5, Core Web Vitals performance tuning, and technical SEO architecture.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Enterprise Software Systems & Operations Suites',
          description:
            'Custom MIS platforms, digitized approval workflows, role-based access control, and modular back-office suites.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'API Architecture & Multi-System Integrations',
          description:
            'High-concurrency RESTful APIs, payment gateway connectors (including M-Pesa Daraja and Stripe), and legacy modernization.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Applied AI & Workflow Automation',
          description:
            'Predictive modeling, automated document processing, and autonomous event pipelines.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Enterprise Data Platforms & Real-Time Dashboards',
          description:
            'Centralized data warehousing, ETL pipelines, and executive KPI reporting dashboards.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Digital Modernization & Engineering Roadmaps',
          description:
            'Phased architecture migrations, deployment automation, and comprehensive technical handovers.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Security & Compliance Architecture',
          description:
            "Data protection frameworks compliant with Kenya's Data Protection Act (2019) and international GDPR standards.",
        },
      },
    ],
  },
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <main>
        <ServicesClient />
      </main>
    </>
  );
}
