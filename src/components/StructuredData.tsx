import { personalInfo, siteConfig, socialLinks } from '@/config';

/**
 * Structured Data (JSON-LD) component for SEO
 * Helps search engines understand your content better
 */
export default function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personalInfo.name.full,
    givenName: personalInfo.name.first,
    familyName: personalInfo.name.last,
    jobTitle: 'Software Engineer and Full Stack Developer',
    description: personalInfo.description,
    image: `${siteConfig.url}${personalInfo.image}`,
    url: siteConfig.url,
    sameAs: [
      socialLinks.linkedin,
      socialLinks.github,
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nairobi',
      addressCountry: 'Kenya',
    },
    email: personalInfo.email,
    knowsAbout: [
      'Full Stack Development',
      'Web Development',
      'React',
      'Next.js',
      'Node.js',
      'TypeScript',
      'JavaScript',
      'Python',
      'Django',
      'Software Engineering',
      'Frontend Development',
      'Backend Development',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${personalInfo.name.full} Portfolio`,
    alternateName: [`Austin Maina Developer`, `Austin Maina Portfolio`],
    url: siteConfig.url,
    description: personalInfo.description,
    author: {
      '@type': 'Person',
      name: personalInfo.name.full,
    },
    inLanguage: 'en-US',
  };

  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${personalInfo.name.full} - Full Stack Development Services`,
    image: `${siteConfig.url}${personalInfo.logo}`,
    '@id': siteConfig.url,
    url: siteConfig.url,
    telephone: personalInfo.phone,
    email: personalInfo.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nairobi',
      addressCountry: 'Kenya',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.286389,
      longitude: 36.817223,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    priceRange: '$$',
    areaServed: {
      '@type': 'Country',
      name: 'Kenya',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: `${siteConfig.url}/about`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Projects',
        item: `${siteConfig.url}/projects`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Skills',
        item: `${siteConfig.url}/skills`,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Contact',
        item: `${siteConfig.url}/contact`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
