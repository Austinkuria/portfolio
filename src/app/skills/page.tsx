import type { Metadata } from 'next';
import Link from 'next/link';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import { siteConfig, socialLinks } from '@/config';
import CustomLink from '@/components/CustomLink';

export const metadata: Metadata = {
  title: 'Technical Capabilities & Engineering Stack | AM LABS',
  description:
    'Explore the production-hardened technologies, frameworks, and third-party integrations engineered by Austin Maina and AM LABS: M-Pesa, Paystack, Dynamics 365, Python, Node.js, Next.js, and PostgreSQL.',
  alternates: {
    canonical: `${siteConfig.url}/skills`,
  },
  openGraph: {
    title: 'Technical Capabilities & Engineering Stack | AM LABS',
    description:
      'Production-hardened engineering stack and integrations: Paystack, M-Pesa Daraja, Microsoft Dynamics 365, Python, PostgreSQL, Next.js, and Docker.',
    url: `${siteConfig.url}/skills`,
    siteName: 'AM LABS',
    locale: 'en_US',
    type: 'website',
  },
};

interface TechDomain {
  category: string;
  badge: string;
  description: string;
  technologies: string[];
}

const technicalDomains: TechDomain[] = [
  {
    category: 'Integrations & Payment APIs',
    badge: 'Financial & External Services',
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
    badge: 'API & Service Layer',
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
    badge: 'Data Persistence',
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
    badge: 'Reporting & Insights',
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
    badge: 'User Interface & Discovery',
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
    badge: 'Infrastructure & Delivery',
    description:
      'Continuous deployment, edge network caching, and automated server configuration.',
    technologies: [
      'Docker Containerization',
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
    <main className="min-h-screen pt-24 md:pt-28 pb-12 sm:pb-14 bg-background transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
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

        {/* 6 Clean Technical Domain Cards (No Unnecessary Icons) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10 sm:mb-12">
          {technicalDomains.map((domain, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm hover:border-primary/50 transition-colors duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-border/60">
                  <span className="text-xs font-mono font-semibold text-primary">
                    0{idx + 1}.
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {domain.badge}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-foreground tracking-tight mb-2">
                  {domain.category}
                </h2>

                <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                  {domain.description}
                </p>

                <ul className="space-y-2 pt-2 border-t border-border/40 text-xs">
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

        {/* Bottom Navigation & CTA */}
        <div className="max-w-3xl mx-auto rounded-2xl border border-border/80 bg-card p-8 sm:p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Looking for end-to-end service delivery?
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto leading-relaxed">
            See how these technologies are applied across our client practices or schedule a direct architectural discussion.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <CustomLink
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200"
            >
              <span>Explore Services Offered</span>
              <FaArrowRight className="text-xs" />
            </CustomLink>

            <CustomLink
              href={socialLinks.calendly || '/contact'}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background hover:bg-muted/40 px-6 py-2.5 text-xs sm:text-sm font-semibold text-foreground transition-all duration-200"
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
