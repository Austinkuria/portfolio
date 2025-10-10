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
    description: 'Building scalable solutions with code & creativity. Portfolio, projects, and contact for Austin Maina, a full stack developer based in Nairobi, Kenya.',
    location: 'Nairobi, Kenya',
    email: process.env.NEXT_PUBLIC_EMAIL || '',
    phone: process.env.NEXT_PUBLIC_PHONE || '',
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP || '', // Without + for WhatsApp URLs
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
    resume: 'https://drive.google.com/file/d/1kVVnj5fCLo0NOxDDC8o1HqVurEvqIpJn/view?usp=drive_link',
    calendly: 'https://calendly.com/austinmaina',
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

// SEO Configuration
export const seoConfig = {
    defaultTitle: `${personalInfo.name.full} | ${personalInfo.title}`,
    titleTemplate: `%s | ${personalInfo.name.full}`,
    keywords: [
        'Full Stack Developer',
        'Web Development',
        'React',
        'Node.js',
        'TypeScript',
        'Next.js',
        'Software Engineer',
        'Web Applications',
        'Cloud Architecture',
        'Backend Development',
        'Frontend Development',
        personalInfo.name.full,
        personalInfo.location,
    ],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: siteConfig.siteName,
        images: {
            url: siteConfig.defaultMetaImage,
            width: 1200,
            height: 630,
            alt: `${personalInfo.name.full} - ${personalInfo.title} Portfolio`,
        },
    },
    twitter: {
        card: 'summary_large_image',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
} as const;

// Email Configuration
export const emailConfig = {
    from: {
        default: process.env.FROM_EMAIL || 'onboarding@resend.dev', // For notifications to you
        notification: 'onboarding@resend.dev', // For client messages to you
        autoReply: process.env.FROM_EMAIL || 'onboarding@resend.dev', // Will be overridden by Gmail
        name: personalInfo.name.full,
        noreply: process.env.FROM_EMAIL || 'kuriaaustin125@gmail.com',
    },
    to: {
        default: process.env.TO_EMAIL || personalInfo.email,
        support: personalInfo.email,
    },
    apiKey: process.env.RESEND_API_KEY || '',
    // Gmail SMTP Configuration
    gmail: {
        user: process.env.GMAIL_USER || '',
        password: process.env.GMAIL_APP_PASSWORD || '',
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
    },
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
    maxFileSize: 5 * 1024 * 1024, // 5MB in bytes
    allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'],
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
    validContactMethods: ['email', 'phone', 'whatsapp'],
    validBudgetRanges: [
        'under-500', '500-1000', '1000-2500', '2500-5000', 'over-5000'
    ],
    spamKeywords: [
        'urgent!!', 'click here', 'free money', 'winner!', 'viagra', 'casino',
        'lottery', 'bitcoin investment', 'get rich quick', 'nigerian prince',
        'click here now'
    ],
    suspiciousEmailDomains: [
        // Known temporary/disposable email services
        '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org',
        'throwaway.email', 'temp-mail.org', 'sharklasers.com', 'guerrillamailblock.com',
        'yopmail.com', 'maildrop.cc', 'getnada.com', 'tempail.com',

        // Obvious testing domains
        'example.com', 'example.org', 'example.net', 'test.com', 'test.org',
        'fake.com', 'dummy.com', 'sample.com', 'placeholder.com', 'localhost.com',
        'invalid.com', 'notreal.com', 'faker.com', 'testing.com'
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
    fileUploadError: 'File upload failed. Please try again with a smaller file.',
} as const;

// Success Messages
export const successMessages = {
    contactForm: 'Thank you for your message! I will get back to you soon.',
    newsletter: 'Successfully subscribed to the newsletter!',
    fileUpload: 'File uploaded successfully.',
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
