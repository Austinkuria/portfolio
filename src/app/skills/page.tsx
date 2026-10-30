import type { Metadata } from 'next';
import Link from 'next/link';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import { siteConfig, socialLinks } from '@/config';
import CustomLink from '@/components/CustomLink';

export const metadata: Metadata = {
  title: 'Technical Capabilities & Engineering Stack | AMLABS',
  description:
    'Explore the production-hardened technologies, frameworks, and third-party integrations engineered by Austin Maina and AMLABS: M-Pesa, Paystack, Dynamics 365, Python, Node.js, Next.js, and PostgreSQL.',
  alternates: {
    canonical: `${siteConfig.url}/skills`,
  },
  openGraph: {
    title: 'Technical Capabilities & Engineering Stack | AMLABS',
    description:
      'Production-hardened engineering stack and integrations: Paystack, M-Pesa Daraja, Microsoft Dynamics 365, Python, PostgreSQL, Next.js, and Docker.',
    url: `${siteConfig.url}/skills`,
    siteName: 'AMLABS',
    locale: 'en_US',
    type: 'website',
  },
};

interface TechDomain {
  category: string;
  description: string;
  technologies: string[];
}

const technicalDomains: TechDomain[] = [
  {
    category: 'Integrations & Payment APIs',
    description:
      'Connecting reliable payment gateways, ERP systems, and cloud communication APIs.',
    technologies: [
      'M-Pesa Daraja API (STK Push, B2C, C2B)',
      'Paystack Payment Processing',
      'Microsoft Dynamics 365 Business Central',
      'Africa’s Talking SMS API',
      'Google OAuth Authentication',
      'Cloudinary Media Management',
      'tawk.to CRM & AI Chatbots',
    ],
  },
  {
    category: 'Backend & Systems Architecture',
    description:
      'Scalable, secure server-side architectures engineered for performance and data integrity.',
    technologies: [
      'Node.js & Express.js',
      'Python & Django',
      'RESTful API Architecture',
      'WebSockets for Real-Time State',
      'BullMQ Background Job Queues',
      'API Rate Limiting & Auth Pipelines',
    ],
  },
  {
    category: 'Databases & In-Memory Caching',
    description:
      'Relational and document storage configured for ACID transactions and sub-millisecond retrieval.',
    technologies: [
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'Redis (Caching & Queue Management)',
      'SQLite',
    ],
  },
  {
    category: 'Data Analytics & Dashboards',
    description:
      'Data extraction, statistical processing, and dynamic visual dashboards for operational insights.',
    technologies: [
      'Python (Pandas, NumPy, Matplotlib, Seaborn)',
      'Data Analysis & Cleansing Pipelines',
      'Recharts & Chart.js Visualization',
      'Executive KPI & Admin Reporting Dashboards',
      'Automated CSV & Report Generation',
    ],
  },
  {
    category: 'Frontend & Technical SEO',
    description:
      'Fast, accessible, mobile-first web applications built for conversion and search rankings.',
    technologies: [
      'Next.js (App Router, Server Components)',
      'React & TypeScript',
      'Tailwind CSS & shadcn/ui',
      'Material UI & Framer Motion',
      'Zustand & React Hook Form',
      'Technical SEO (Schema.org, Sitemaps, OpenGraph)',
      'Core Web Vitals Optimization',
    ],
  },
  {
    category: 'DevOps & Deployment',
    description:
      'Continuous deployment, edge network caching, and automated server configuration.',
    technologies: [
      'Docker Containerization',
      'UptimeRobot Monitoring & Health Checks',
      'Cloudflare CDN, DNS & Security',
      'Vercel Cloud Deployment',
      'Git & GitHub Team Workflows',
      'Linux Environments & cPanel Management',
      'Vite & Build Tooling',
    ],
  },
];

export default function SkillsPage() {
  return (
    <main className="min-h-screen pt-20 md:pt-24 pb-8 sm:pb-12 bg-background transition-colors duration-300">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-10">
          <p className="text-xs font-mono font-medium tracking-widest uppercase text-primary mb-2">
            AMLABS Capabilities
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3 leading-tight">
            Engineering Stack & <span className="text-primary">Integrations</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A comprehensive directory of the production-tested languages, databases, payment APIs, and cloud infrastructure we deploy across client engagements.
          </p>
        </div>

        {/* 6 Clean Technical Domain Cards (No Unnecessary Badges) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 sm:mb-12">
          {technicalDomains.map((domain, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm hover:border-primary/50 transition-colors duration-200 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold text-foreground tracking-tight mb-2">
                  {domain.category}
                </h2>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {domain.description}
                </p>

                <ul className="space-y-2 pt-3 border-t border-border/40 text-xs">
                  {domain.technologies.map((tech, tIdx) => (
                    <li key={tIdx} className="flex items-baseline gap-2 text-foreground/90">
                      <span className="text-primary font-bold text-[10px]">•</span>
                      <span className="leading-relaxed">{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation & Full-Width CTA */}
        <div className="w-full rounded-[2.5rem] border border-border/80 bg-card p-8 sm:p-12 text-center shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none rounded-t-[2.5rem]" />

          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
            Looking for end-to-end service delivery?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-7 max-w-xl mx-auto leading-relaxed">
            See how these technologies are applied across our client practices or schedule a direct architectural discussion.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <CustomLink
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-105"
            >
              <span>Explore Services Offered</span>
              <FaArrowRight className="text-xs" />
            </CustomLink>

            <CustomLink
              href={socialLinks.calendly || '/contact'}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background hover:bg-muted/40 px-7 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:scale-105"
            >
              <FaCalendarAlt className="text-xs" />
              <span>Schedule a Call</span>
            </CustomLink>
          </div>
        </div>

      </div>
    </main>
  );
}
