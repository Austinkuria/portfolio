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
    title: 'Full Stack Developer & Software Engineer',
    tagline: 'Transforming ideas into powerful web applications',
    description: 'Austin Maina - Software Engineer & Full Stack Developer based in Nairobi, Kenya. Specializing in MERN Stack (MongoDB, Express, React, Node.js) and PERN Stack (PostgreSQL, Express, React, Node.js). Expert in React, Next.js, TypeScript, Python & Django. View my portfolio, projects, and get in touch for web development services.',
    location: 'Nairobi, Kenya',
    email: process.env.NEXT_PUBLIC_EMAIL || '',
    phone: process.env.NEXT_PUBLIC_PHONE || '',
    image: '/images/Passport_Photo_AustinMaina.jpg',
    logo: '/images/am-logo.jpg',
    initials: 'AM',
    hero: {
        typingAnimation: [
            'Interactive Web Apps', 2000,
            'Scalable APIs', 2000,
            'Modern Interfaces', 2000,
            'Robust Full-Stack Apps', 2500,
            'Seamless User Experiences', 2500,
        ] as const,
    },
} as const;

// Website Configuration
export const siteConfig = {
    url: 'https://austinmaina.vercel.app',
    name: `${personalInfo.name.full} Portfolio`,
    applicationName: `${personalInfo.name.full} Portfolio`,
    siteName: `${personalInfo.name.full} Portfolio`,
    domain: 'austinmaina.vercel.app',
    googleSiteVerification: '771005efe7b937ff',
    googleAnalyticsId: 'G-S0LJ0MV7MY', // GA4 Measurement ID
    defaultMetaImage: '/images/am-logo.jpg',
    favicon: '/images/am-logo.jpg',
    themeColor: '#ffffff',
} as const;

// Social Media Links
export const socialLinks = {
    github: 'https://github.com/Austinkuria',
    linkedin: 'https://www.linkedin.com/in/austin-maina/',
    discord: 'https://discord.gg/austin.125',
    email: `mailto:${personalInfo.email}`,
    phone: `tel:${personalInfo.phone}`,
    resume: 'https://drive.google.com/file/d/1kVVnj5fCLo0NOxDDC8o1HqVurEvqIpJn/view?usp=drive_link',
    calendly: 'https://calendly.com/austinmaina',
} as const;

// GitHub Usernames (for different projects)
export const githubUsernames = {
    main: 'Austinkuria',
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
    defaultTitle: `Austin Maina - Software Engineer & Full Stack Developer Portfolio`,
    titleTemplate: `%s | Austin Maina - Software Engineer`,
    keywords: [
        'Austin Maina',
        'Austin Maina Portfolio',
        'Austin Maina Developer',
        'Austin Maina Full Stack Developer',
        'Austin Maina Software Engineer',
        'Austin Maina MERN Stack',
        'Austin Maina PERN Stack',
        'Austin Maina MERN',
        'Austin Maina PERN',
        'MERN Stack Developer Kenya',
        'PERN Stack Developer Kenya',
        'Full Stack Developer Kenya',
        'Full Stack Developer Nairobi',
        'Web Developer Kenya',
        'Software Engineer Kenya',
        'React Developer Kenya',
        'Next.js Developer',
        'TypeScript Developer',
        'Node.js Developer',
        'Python Developer Kenya',
        'Django Developer',
        'Web Development',
        'React',
        'Node.js',
        'TypeScript',
        'Next.js',
        'Python',
        'Django',
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
        noreply: process.env.FROM_EMAIL || 'devhubmailer@gmail.com',
    },
    to: {
        default: process.env.TO_EMAIL || personalInfo.email,
        support: personalInfo.email,
        // Additional notification email for new leads
        devhub: 'devhubmailer@gmail.com',
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
    phoneFormatExample: '+254712345678',
    emailPlaceholder: 'austinexample@gmail.com',
    subjectPlaceholder: 'Project Inquiry',
    messagePlaceholder: 'Hello! I\'d like to talk about...',
    supportEmail: personalInfo.email,
    maxFileSize: 5 * 1024 * 1024, // 5MB in bytes
    allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'],
    responseTime: '24-48 hours',
    availability: {
        status: 'available', // 'available', 'busy', 'limited', 'unavailable'
        statusMessage: 'Available for new projects',
        currentWork: 'Currently accepting web development and consultation work'
    },
    categoryOptions: [
        { value: '', label: 'Select a category...' },
        { value: 'build-website', label: 'Build a Website' },
        { value: 'design-redesign', label: 'Website Design & Redesign' },
        { value: 'ecommerce', label: 'Online Store / E-commerce' },
        { value: 'maintenance-support', label: 'Website Maintenance & Support' },
        { value: 'developer-collaboration', label: 'Developer Collaboration' },
        { value: 'other', label: 'Other / Let me Explain' }
    ],
    validCategories: [
        'build-website', 'design-redesign', 'ecommerce', 'maintenance-support', 'developer-collaboration', 'other'
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
    ],
    faq: [
        {
            question: "What types of projects do you work on?",
            answer: "I create professional websites, online stores, mobile-responsive designs, and business automation solutions. I work on everything from simple business websites to complex custom applications that help grow your business."
        },
        {
            question: "What is your typical project timeline?",
            answer: "Project timelines vary based on complexity: Simple websites (1-2 weeks), Online stores and custom applications (4-8 weeks), Design projects (2-3 weeks), System integrations (2-4 weeks). I always provide detailed timelines during our initial consultation."
        },
        {
            question: "Do you offer ongoing maintenance and support?",
            answer: "Yes! I provide ongoing maintenance packages including bug fixes, security updates, performance optimization, content updates, and feature enhancements. Maintenance plans are customized based on your specific needs."
        },
        {
            question: "What is your development process?",
            answer: "My process includes: 1) Discovery & Planning, 2) Design & Wireframing, 3) Development & Testing, 4) Review & Feedback, 5) Deployment & Launch, 6) Training & Handover. I maintain regular communication throughout each phase."
        },
        {
            question: "How do you handle project pricing?",
            answer: "I offer both fixed-price and hourly arrangements depending on project scope. For fixed-price projects, I provide detailed proposals after understanding your requirements. Hourly rates apply for ongoing maintenance and consultation work."
        },
        {
            question: "What's the best way to contact you?",
            answer: "For project inquiries, fill out the contact form on this page—it ensures I have all the details and context. For general questions or professional networking, email or LinkedIn work well too. I respond to all methods within 24 hours."
        },
        {
            question: "Do you work with international clients?",
            answer: "Absolutely! I work with clients globally and am experienced in remote collaboration. I'm based in Nairobi (EAT, UTC+3) and maintain async-friendly workflows to accommodate different time zones. I typically respond within 24 hours and am flexible with scheduling for meetings."
        }
    ]
} as const;

// Contact Benefits Configuration
export const contactBenefits = {
    'build-website': [
        'Mobile responsive design',
        'Fast loading times',
        'SEO optimized',
        'User-friendly interface',
        'Modern tech stack',
        'Custom features as needed'
    ],
    'design-redesign': [
        'Complete visual redesign',
        'Improved user experience',
        'Professional branding',
        'Consistent across devices',
        'Accessibility compliant',
        'Additional design elements'
    ],
    'ecommerce': [
        'Seller Dashboard - Manage products, pricing, inventory',
        'Admin Dashboard - Order processing, customer management, analytics',
        'Customer Dashboard - Order history, account management, preferences',
        'Secure payment gateways',
        'Inventory tracking system',
        'Custom integrations & features'
    ],
    'maintenance-support': [
        'Proactive bug fixes',
        'Performance optimization',
        'Security updates',
        'Feature enhancements',
        'Technical support',
        'Additional services available'
    ],
    'developer-collaboration': [
        'Code review & architecture discussions',
        'Open-source contributions',
        'Joint project development',
        'Technology stack alignment',
        'Git workflow & best practices',
        'Custom integrations available'
    ],
    'other': [
        'Custom solution design',
        'Collaborative planning',
        'Flexible development',
        'Transparent communication',
        'Quality assurance',
        'Open to your specific requirements'
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
export type FAQItem = typeof contactConfig.faq[number];
