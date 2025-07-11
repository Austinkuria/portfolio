import { personalInfo, siteConfig, socialLinks } from '@/config';

interface SchemaData {
    '@context': string;
    '@type': string;
    [key: string]: unknown;
}

export function generatePersonSchema(): SchemaData {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: personalInfo.name.full,
        jobTitle: personalInfo.title,
        description: personalInfo.description,
        url: siteConfig.url,
        image: `${siteConfig.url}${personalInfo.image}`,
        email: personalInfo.email,
        telephone: personalInfo.phone,
        address: {
            '@type': 'PostalAddress',
            addressLocality: personalInfo.location,
            addressCountry: 'KE'
        },
        sameAs: [
            socialLinks.linkedin,
            socialLinks.github,
        ],
        knowsAbout: [
            'Web Development',
            'Full Stack Development',
            'React',
            'Next.js',
            'TypeScript',
            'Node.js',
            'JavaScript',
            'Cloud Architecture',
            'Software Engineering'
        ],
        alumniOf: {
            '@type': 'Organization',
            name: 'Multimedia University of Kenya'
        },
        worksFor: {
            '@type': 'Organization',
            name: 'Freelance'
        }
    };
}

export function generateWebsiteSchema(): SchemaData {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.siteName,
        description: personalInfo.description,
        url: siteConfig.url,
        author: {
            '@type': 'Person',
            name: personalInfo.name.full,
            jobTitle: personalInfo.title,
            url: siteConfig.url
        },
        publisher: {
            '@type': 'Person',
            name: personalInfo.name.full,
            url: siteConfig.url
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteConfig.url}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        }
    };
}

export function generateOrganizationSchema(): SchemaData {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: `${personalInfo.name.full} - Freelance Developer`,
        url: siteConfig.url,
        logo: `${siteConfig.url}${personalInfo.logo}`,
        description: personalInfo.description,
        founder: {
            '@type': 'Person',
            name: personalInfo.name.full,
            jobTitle: personalInfo.title
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: personalInfo.phone,
            email: personalInfo.email,
            contactType: 'customer service',
            availableLanguage: ['English']
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: personalInfo.location,
            addressCountry: 'KE'
        },
        sameAs: [
            socialLinks.linkedin,
            socialLinks.github,
        ]
    };
}

export function generateProfessionalServiceSchema(): SchemaData {
    return {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: `${personalInfo.name.full} - Web Development Services`,
        description: 'Professional web development services including full-stack development, UI/UX design, and cloud architecture',
        url: siteConfig.url,
        image: `${siteConfig.url}${personalInfo.image}`,
        telephone: personalInfo.phone,
        email: personalInfo.email,
        address: {
            '@type': 'PostalAddress',
            addressLocality: personalInfo.location,
            addressCountry: 'KE'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: -1.2921,
            longitude: 36.8219
        },
        provider: {
            '@type': 'Person',
            name: personalInfo.name.full,
            jobTitle: personalInfo.title
        },
        serviceType: 'Web Development',
        areaServed: ['Kenya', 'Global'],
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Web Development Services',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Full Stack Web Development',
                        description: 'Complete web application development from frontend to backend'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'UI/UX Design',
                        description: 'User interface and user experience design for web applications'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'E-commerce Development',
                        description: 'Custom e-commerce solutions and online stores'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'API Development',
                        description: 'RESTful API development and third-party integrations'
                    }
                }
            ]
        }
    };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): SchemaData {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    };
}

export function generateProjectSchema(project: {
    name: string;
    description: string;
    url?: string;
    image?: string;
    technologies: string[];
    dateCreated?: string;
}): SchemaData {
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.name,
        description: project.description,
        url: project.url || siteConfig.url,
        image: project.image ? `${siteConfig.url}${project.image}` : `${siteConfig.url}${personalInfo.image}`,
        creator: {
            '@type': 'Person',
            name: personalInfo.name.full,
            jobTitle: personalInfo.title,
            url: siteConfig.url
        },
        dateCreated: project.dateCreated,
        keywords: project.technologies.join(', '),
        genre: 'Web Development',
        inLanguage: 'en-US',
        isAccessibleForFree: true
    };
}

export function generateArticleSchema(article: {
    title: string;
    description: string;
    url: string;
    image?: string;
    datePublished: string;
    dateModified?: string;
    tags?: string[];
}): SchemaData {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        url: article.url,
        image: article.image ? `${siteConfig.url}${article.image}` : `${siteConfig.url}${personalInfo.image}`,
        author: {
            '@type': 'Person',
            name: personalInfo.name.full,
            jobTitle: personalInfo.title,
            url: siteConfig.url
        },
        publisher: {
            '@type': 'Person',
            name: personalInfo.name.full,
            url: siteConfig.url,
            logo: {
                '@type': 'ImageObject',
                url: `${siteConfig.url}${personalInfo.logo}`
            }
        },
        datePublished: article.datePublished,
        dateModified: article.dateModified || article.datePublished,
        keywords: article.tags?.join(', '),
        inLanguage: 'en-US',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': article.url
        }
    };
}

export type { SchemaData };
