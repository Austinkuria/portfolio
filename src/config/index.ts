/**
 * Central configuration file for the portfolio application
 * This file contains all the hardcoded values that should be easily configurable
 */

// Personal Information
export const personalInfo = {
    name: {
        first: 'Austin',
        last: 'Maina',
        full: 'Austin Maina',
        display: 'AustinMaina', // Used in URLs and specific contexts
    },
    title: 'Full Stack Developer',
    tagline: 'Building scalable solutions with code & creativity',
    description: 'Full Stack Developer with a passion for building scalable web applications that solve real-world problems',
    location: 'Nairobi, Kenya',
    email: 'kuriaaustin125@gmail.com',
    phone: '+254797561978',
    whatsappNumber: '254797561978', // Without + for WhatsApp URLs
    image: '/images/Passport_Photo_AustinMaina.jpg',
    logo: '/images/am-logo.jpg',
    initials: 'AM',
} as const;

// Website Configuration
export const siteConfig = {
    url: 'https://austinmaina.vercel.app',
    name: `${personalInfo.name.full} Portfolio`,
    applicationName: `${personalInfo.name.full} Portfolio`,
    siteName: `${personalInfo.name.full} Portfolio`,
    domain: 'austinmaina.vercel.app',
    googleSiteVerification: 'google771005efe7b937ff',
    defaultMetaImage: '/images/am-logo.jpg',
    favicon: '/images/am-logo.jpg',
    themeColor: '#ffffff',
} as const;

// Social Media Links
export const socialLinks = {
    github: 'https://github.com/Austinkuria',
    linkedin: 'https://www.linkedin.com/in/austin-maina/',
    discord: 'https://discord.gg/austin.125',
    whatsapp: `https://wa.me/${personalInfo.whatsappNumber}`,
    email: `mailto:${personalInfo.email}`,
    phone: `tel:${personalInfo.phone}`,
} as const;

// GitHub Usernames (for different projects)
export const githubUsernames = {
    main: 'Austinkuria',
    // alt1: 'austin.125',
    // alt2: 'Austinkuria',
} as const;

// Project URLs Configuration
export const projectUrls = {
    portfolio: {
        github: 'https://github.com/Austinkuria/portfolio',
        demo: 'https://austinmaina.vercel.app'
    },
    clinique: {
        github: 'https://github.com/Austinkuria/clinique-beauty',
        demo: 'https://clinique-beauty.vercel.app'
    },
    attendanceSystem: {
        github: 'https://github.com/Austinkuria/attendance-system',
        demo: 'https://attendance-system123.vercel.app/'
    },
    ecommerceDjango: {
        github: 'https://github.com/Austinkuria/E-commerce-Site',
        demo: 'https://austin125.pythonanywhere.com/'
    },
    bijouxJewelry: {
        github: 'https://github.com/Austinkuria/Bijoux-Jewelry-Shop',
        demo: '#'
    },
    veritasTravels: {
        github: 'https://github.com/Austinkuria/Veritas-Travels',
        demo: 'https://austinkuria.github.io/Veritas-Travels/'
    }
} as const;

// Navigation Configuration
export const navigation = {
    mainMenu: [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Projects', href: '/projects' },
        { name: 'Skills', href: '/skills' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' },
    ],
    prefetchPages: ['/about', '/projects', '/skills', '/blog', '/contact'],
} as const;

// SEO Configuration - Enhanced for better search visibility
export const seoConfig = {
    defaultTitle: `${personalInfo.name.full} - ${personalInfo.title} | Modern Web Solutions`,
    titleTemplate: `%s | ${personalInfo.name.full}`,
    keywords: [
        // Primary skills
        'Full Stack Developer',
        'Web Development',
        'React Developer',
        'Next.js Developer',
        'TypeScript Developer',
        'Node.js Developer',
        'JavaScript Developer',

        // Services
        'Frontend Development',
        'Backend Development',
        'UI/UX Design',
        'E-commerce Development',
        'API Development',
        'Web Applications',
        'Custom Software Development',
        'Responsive Web Design',

        // Technologies
        'React',
        'Next.js',
        'TypeScript',
        'Node.js',
        'TailwindCSS',
        'MongoDB',
        'PostgreSQL',
        'Express.js',
        'REST API',
        'GraphQL',

        // Industry terms
        'Software Engineer',
        'Web Applications',
        'Cloud Architecture',
        'Scalable Solutions',
        'Modern Web Technologies',
        'Progressive Web Apps',
        'Single Page Applications',

        // Location-based
        personalInfo.name.full,
        personalInfo.location,
        'Kenya Developer',
        'Nairobi Developer',
        'East Africa Developer',

        // Client-focused
        'Freelance Developer',
        'Web Development Services',
        'Custom Web Solutions',
        'Business Web Applications',
        'Startup Development',
        'Small Business Websites',
        'Enterprise Solutions'
    ],
    descriptions: {
        home: `${personalInfo.name.full} is a ${personalInfo.title.toLowerCase()} based in ${personalInfo.location}, specializing in modern web applications built with React, Next.js, and TypeScript. Available for freelance projects and consultations.`,
        about: `Learn about ${personalInfo.name.full}, a passionate ${personalInfo.title.toLowerCase()} with expertise in full-stack development, UI/UX design, and modern web technologies. Discover my journey, skills, and approach to building exceptional web solutions.`,
        projects: `Explore ${personalInfo.name.full}'s portfolio of web development projects, featuring modern applications built with React, Next.js, TypeScript, and other cutting-edge technologies. See real-world examples of full-stack development work.`,
        skills: `Discover the technical skills and expertise of ${personalInfo.name.full}, including proficiency in React, Next.js, TypeScript, Node.js, and modern web development tools and frameworks.`,
        contact: `Get in touch with ${personalInfo.name.full} for web development projects, consultations, or collaborations. Available for freelance work including full-stack development, UI/UX design, and custom web solutions.`,
        blog: `Read ${personalInfo.name.full}'s insights on web development, programming tutorials, industry trends, and technical guides covering React, Next.js, TypeScript, and modern development practices.`
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: siteConfig.siteName,
        images: {
            url: '/api/og', // Dynamic OG image
            width: 1200,
            height: 630,
            alt: `${personalInfo.name.full} - ${personalInfo.title} Portfolio`,
        },
    },
    twitter: {
        card: 'summary_large_image',
        site: '@austinmaina', // Add if you have Twitter
        creator: '@austinmaina', // Add if you have Twitter
    },
    robots: {
        index: true,
        follow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    additionalMetaTags: [
        {
            name: 'application-name',
            content: siteConfig.applicationName,
        },
        {
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
        },
        {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'default',
        },
        {
            name: 'apple-mobile-web-app-title',
            content: siteConfig.applicationName,
        },
        {
            name: 'format-detection',
            content: 'telephone=yes',
        },
        {
            name: 'mobile-web-app-capable',
            content: 'yes',
        },
        {
            name: 'theme-color',
            content: siteConfig.themeColor,
        },
        // Professional/Business related
        {
            name: 'classification',
            content: 'Business',
        },
        {
            name: 'coverage',
            content: 'Worldwide',
        },
        {
            name: 'distribution',
            content: 'Global',
        },
        {
            name: 'rating',
            content: 'General',
        },
        // Geographic
        {
            name: 'geo.region',
            content: 'KE',
        },
        {
            name: 'geo.placename',
            content: personalInfo.location,
        },
        {
            name: 'ICBM',
            content: '-1.2921, 36.8219', // Nairobi coordinates
        },
    ],
} as const;

// Email Configuration
export const emailConfig = {
    from: {
        default: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        name: personalInfo.name.full,
        noreply: process.env.FROM_EMAIL || `noreply@${siteConfig.domain}`,
    },
    to: {
        default: process.env.TO_EMAIL || personalInfo.email,
        support: personalInfo.email,
    },
    apiKey: process.env.RESEND_API_KEY || '',
    templates: {
        contactForm: {
            subject: `New contact form submission from ${siteConfig.name}`,
            replyTo: personalInfo.email,
        },
        autoReply: {
            subject: `Thank you for contacting ${personalInfo.name.first}`,
            from: personalInfo.email,
        },
    },
} as const;

// Contact Form Configuration
export const contactConfig = {
    whatsappMessage: `Hi ${personalInfo.name.first}! I found your portfolio and would like to discuss a project with you.`,
    phoneFormatExample: '+254712345678',
    emailPlaceholder: 'austinexample@gmail.com',
    supportEmail: personalInfo.email,
    responseTime: '24-48 hours',
    availability: {
        status: 'available', // 'available', 'busy', 'limited', 'unavailable'
        statusMessage: 'Available for new projects',
        currentWork: 'Currently accepting web development and consultation work'
    },
    validCategories: [
        'web-development', 'ui-ux-design', 'ecommerce', 'backend-development',
        'api-development', 'consultation', 'maintenance', 'other'
    ],
    spamKeywords: [
        'urgent!!', 'click here', 'free money', 'winner!', 'viagra', 'casino',
        'lottery', 'bitcoin investment', 'get rich quick', 'nigerian prince',
        'click here now'
    ],
    suspiciousEmailDomains: [
        '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org',
        'throwaway.email', 'temp-mail.org', 'sharklasers.com', 'guerrillamailblock.com'
    ]
} as const;

// Skills Configuration
export const skillsConfig = {
    categories: [
        'Frontend Development',
        'Backend Development',
        'Database',
        'Cloud & DevOps',
        'Tools & Others',
    ],
} as const;

// Blog Configuration
export const blogConfig = {
    postsPerPage: 10,
    defaultAuthor: personalInfo.name.full,
    defaultAuthorImage: personalInfo.image,
} as const;

// Error Messages
export const errorMessages = {
    generic: `Something went wrong. Please try again or contact me directly at ${personalInfo.email}`,
    networkError: 'Network error. Please check your connection and try again.',
    validationError: 'Please check your input and try again.',
} as const;

// Success Messages
export const successMessages = {
    contactForm: 'Thank you for your message! I will get back to you soon.',
    newsletter: 'Successfully subscribed to the newsletter!',
} as const;

// App Configuration
export const appConfig = {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    buildTime: new Date().toISOString(),
    version: '1.0.0',
} as const;

// Export types for better TypeScript support
export type SocialPlatform = keyof typeof socialLinks;
export type NavigationItem = typeof navigation.mainMenu[number];
export type SkillCategory = typeof skillsConfig.categories[number];
export type GithubUsername = keyof typeof githubUsernames;
export type ProjectKey = keyof typeof projectUrls;
