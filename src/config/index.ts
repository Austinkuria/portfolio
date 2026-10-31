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
    title: 'Software Engineer & Studio Founder',
    tagline: 'Transforming ideas into powerful web applications',
    description: 'Austin Maina - Software Engineer & Studio Founder at AMLABS. Architecting enterprise digital systems, web applications, AI automation, and payment infrastructure.',
    location: 'Global & Remote',
    email: process.env.NEXT_PUBLIC_EMAIL || '',
    phone: process.env.NEXT_PUBLIC_PHONE || '',
    image: '/images/Passport_Photo_AustinMaina.jpg',
    logo: '/images/am-softwares-logo.png',
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
    // Enable live chat widget (Tawk). Can be controlled via env var NEXT_PUBLIC_ENABLE_LIVE_CHAT
    // If not set, defaults to true in production only.
    enableLiveChat: process.env.NEXT_PUBLIC_ENABLE_LIVE_CHAT
        ? process.env.NEXT_PUBLIC_ENABLE_LIVE_CHAT === 'true'
        : process.env.NODE_ENV === 'production',
    defaultMetaImage: '/images/am-softwares-logo.png',
    favicon: '/images/am-softwares-logo.png',
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
        { name: 'Services', href: '/services' },
        { name: 'Portfolio', href: '/projects' },
        { name: 'Delivery Plan', href: '/process' },
        { name: 'About', href: '/about' },
        { name: 'Skills', href: '/skills' },
        { name: 'Contact Us', href: '/contact' },
    ],
    prefetchPages: ['/services', '/skills', '/projects', '/process', '/about', '/contact'],
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
        'AM LABS',
        'AM LABS',
        'Custom Web Applications',
        'API Integration & Development',
        'M-Pesa API Architecture',
        'AI Workflow Automation',
        'Next.js Developer',
        'TypeScript Developer',
        'Node.js Developer',
        'Cloud Solutions',
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
            question: "What types of systems and applications do you engineer?",
            answer: "At AMLABS, we engineer high-performance business websites, full-stack web applications with native payment pipelines (Lipa na M-Pesa Daraja STK Push & Paystack), bespoke enterprise management platforms (MIS / ERP portals), automated Python data pipelines & BI dashboards, and applied AI workflows. Every platform is delivered with 100% full source code ownership—no per-seat software licenses or agency bloat."
        },
        {
            question: "How does your Commercial Rate Card work?",
            answer: "We operate with transparent, scope-based pricing tailored for organizations and founders in Kenya: Business Websites & SEO start from KES 18,000 (Range: KES 15k–25k); Full-Stack Web Apps + Payments start from KES 38,000 (Range: KES 35k–55k); Custom Management Systems (MIS) start from KES 75,000 (Range: KES 70k–120k); and Standalone Payment & API Bridges start from KES 20,000 (Range: KES 20k–35k). Scope caps are clearly defined upfront to prevent hidden surprises."
        },
        {
            question: "What is your milestone payment structure?",
            answer: "All fixed-fee development engagements follow a disciplined 50/50 milestone split: a 50% upfront deposit to commence system architecture and staging environment setup, and the remaining 50% balance upon final staging approval, prior to production deployment or credential transfer. Timelines officially commence once at least 80% of required project content and assets are submitted."
        },
        {
            question: "What are your typical project delivery timelines?",
            answer: "Delivery timelines vary with architectural scope: Business Websites take 5 – 10 business days; Full-Stack Web Apps with payments take 2 – 3 weeks; Custom MIS suites take 3 – 5 weeks; and Standalone Payment / API Bridges take 3 – 7 business days. You receive continuous visibility via private staging previews and direct engineering updates."
        },
        {
            question: "Do you provide ongoing maintenance and technical support?",
            answer: "Yes! Every system we build includes 3 months of free maintenance and 24/7 uptime monitoring. After the initial 3 months, you can continue with our System Care monthly retainer (KES 3,500 – 5,000/month), which covers 24/7 UptimeRobot monitoring, security patches, regular offsite backups, and up to 3 hours of developer labor per month for minor adjustments. Additional out-of-scope tasks default to KES 2,000/hour or a separate milestone project."
        },
        {
            question: "Are third-party hosting, domain, and API costs included in the fees?",
            answer: "Our package rates cover software engineering, database design, architecture, testing, and deployment. They explicitly exclude recurring third-party costs such as annual domain/hosting subscriptions (e.g., Truehost, Kenya Web Experts, AWS), bulk SMS API wallet balances (e.g., Africa's Talking), and AI token consumption (OpenAI, Anthropic, WhatsApp Cloud API). The client pays for and retains 100% direct administrative ownership of all third-party accounts."
        },
        {
            question: "How do you handle confidentiality, security, and data protection?",
            answer: "We take data governance seriously. We execute a mutual Non-Disclosure Agreement (NDA) before reviewing proprietary business workflows, databases, or internal documents. All applications are built to support compliance with Kenya's Data Protection Act (2019) and international GDPR standards, featuring Role-Based Access Control (RBAC), end-to-end TLS encryption, and immutable audit logging."
        },
        {
            question: "Do you work with international clients and remote teams?",
            answer: "Yes, we collaborate with founders, companies, and organizations worldwide. Headquartered in Nairobi (EAT, UTC+3), we maintain async-friendly development workflows, private staging servers, clear GitHub version control, and flexible scheduling for meetings across Pan-African, European, and North American time zones."
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
