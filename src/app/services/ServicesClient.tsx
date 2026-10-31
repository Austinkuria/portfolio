'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowRight, FaCalendarAlt, FaCheckCircle, FaWhatsapp, FaExclamationTriangle } from 'react-icons/fa';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { socialLinks } from '@/config';

interface CapabilitySpec {
  number: string;
  title: string;
  description: string;
}

interface EngineeringPractice {
  id: string;
  label: string;
  index: string;
  title: string;
  shortTitle: string;
  tagline: string;
  overview: string;
  operationalValue: string;
  keyFocus: string;
  capabilities: CapabilitySpec[];
  reverseLayout: boolean;
}

const practices: EngineeringPractice[] = [
  {
    id: 'web-applications',
    label: '01 / Web Architecture',
    index: '01',
    title: 'Websites & High-Performance Web Applications',
    shortTitle: 'Websites & Web Apps',
    tagline: 'Fast, mobile-first, and search-optimized web applications designed for conversion.',
    overview:
      'We design and engineer fast, mobile-first websites and full-stack web applications tailored to your business operations. Every platform is built with modern web technologies, clean semantic code, and technical search engine optimization (SEO) at its core — ensuring fast load times on all mobile networks, high search engine visibility, and seamless visitor conversions.',
    operationalValue:
      'Improves search engine discovery, reduces bounce rates across mobile visitors, and establishes a secure, high-performing digital front door for your organization.',
    keyFocus: 'Sub-second load times, structured data, mobile responsiveness, and clean codebase architecture.',
    reverseLayout: false,
    capabilities: [
      {
        number: '01',
        title: 'Custom Web Applications & Portals',
        description:
          'Tailored full-stack applications with dynamic interfaces, authenticated user portals, and responsive layouts built using modern frameworks (Next.js, React, Node.js).',
      },
      {
        number: '02',
        title: 'Mobile-First Responsive Architecture',
        description:
          'Layouts structured and tested across all smartphone viewports, tablets, and desktop displays for fluid touch navigation and typography readability.',
      },
      {
        number: '03',
        title: 'Technical SEO & Semantic Indexing',
        description:
          'Server-rendered markup, OpenGraph social cards, structured Schema.org microdata, and automatic sitemaps ensuring maximum organic search discovery.',
      },
      {
        number: '04',
        title: 'Speed & Core Web Vitals Optimization',
        description:
          'Compressed assets, responsive image generation, and optimized rendering pathways engineered for fast load speeds even on variable mobile connections.',
      },
      {
        number: '05',
        title: 'Self-Serve Content Management',
        description:
          'Clean administrative dashboards or headless CMS integrations enabling non-technical teams to publish updates and manage content without developer intervention.',
      },
    ],
  },
  {
    id: 'enterprise-systems',
    label: '02 / Core Platforms',
    index: '02',
    title: 'Enterprise Software Systems & Operations Suites',
    shortTitle: 'Enterprise Systems',
    tagline: 'Custom software platforms built around your organization\'s business logic.',
    overview:
      'We develop bespoke enterprise applications engineered around your specific organizational workflows, approval structures, and compliance rules. Built with modular architectures, custom databases, and full source code ownership so your organization maintains complete control over its digital assets.',
    operationalValue:
      'Centralizes core operational workflows, establishes clear approval trails, and delivers software you own outright without ongoing commercial per-user license fees.',
    keyFocus: 'Full intellectual property ownership and custom workflow alignment.',
    reverseLayout: true,
    capabilities: [
      {
        number: '01',
        title: 'Custom Management Information Systems (MIS)',
        description:
          'Centralized platforms aggregating departmental records, operational activity, and governance oversight into one interface.',
      },
      {
        number: '02',
        title: 'Workflow & Approval Engines',
        description:
          'Digitized approval hierarchies, document routing, and review stages with immutable audit logs.',
      },
      {
        number: '03',
        title: 'Operations & Resource Modules',
        description:
          'Purpose-built applications covering procurement, inventory tracking, task allocation, and program milestones.',
      },
      {
        number: '04',
        title: 'Monitoring & Evaluation (M&E) Systems',
        description:
          'Structured tracking frameworks built for institutions, NGOs, and enterprise programs requiring verifiable progress reporting.',
      },
      {
        number: '05',
        title: 'Role-Based Access Control (RBAC)',
        description:
          'Granular permission systems ensuring staff and external stakeholders only access the records relevant to their designated responsibilities.',
      },
    ],
  },
  {
    id: 'systems-integration',
    label: '03 / Integration Architecture',
    index: '03',
    title: 'API Architecture & Multi-System Integrations',
    shortTitle: 'API & Integrations',
    tagline: 'Connecting software tools, legacy systems, and payment providers.',
    overview:
      'We connect core business applications, payment gateways, customer records, and cloud services into a synchronized network. Rather than requiring wholesale software replacements, we build dependable middleware and APIs that allow existing platforms to work together effectively.',
    operationalValue:
      'Reduces manual data re-entry between systems, improves synchronization consistency, and extends the useful lifespan of existing software investments.',
    keyFocus: 'Reliable payment processing and automated transaction reconciliation.',
    reverseLayout: false,
    capabilities: [
      {
        number: '01',
        title: 'RESTful & Webhook API Architecture',
        description:
          'Documented, type-safe API interfaces with request validation and rate limiting for secure inter-system communication.',
      },
      {
        number: '02',
        title: 'Payment Gateway Integrations',
        description:
          'Production-tested connectors for mobile payment rails (such as M-Pesa Daraja STK Push), regional fintech providers, and card payment services.',
      },
      {
        number: '03',
        title: 'Legacy System Modernization',
        description:
          'Connecting older core databases and applications with modern web interfaces using clean API layers.',
      },
      {
        number: '04',
        title: 'Data Synchronization Pipelines',
        description:
          'Event-driven pub/sub messaging patterns ensuring updates in one system reflect accurately across connected services.',
      },
    ],
  },
  {
    id: 'ai-automation',
    label: '04 / Intelligent Systems',
    index: '04',
    title: 'Applied AI & Workflow Automation',
    shortTitle: 'Applied AI & Automation',
    tagline: 'Practical machine learning and automated workflow pipelines.',
    overview:
      'We design and deploy practical artificial intelligence systems and automated workflow pipelines tailored to specific operational requirements. From document understanding and data extraction to predictive modeling and internal staff assistants, we help teams reduce manual bottlenecks and streamline day-to-day operations.',
    operationalValue:
      'Reduces repetitive manual tasks, improves processing turnaround times, and helps teams flag data inconsistencies before they affect production.',
    keyFocus: 'Measurable efficiency gains and auditable data pipelines.',
    reverseLayout: true,
    capabilities: [
      {
        number: '01',
        title: 'Predictive Operational Modeling',
        description:
          'Statistical models that forecast demand patterns, resource utilization, and operational constraints based on historical trends.',
      },
      {
        number: '02',
        title: 'Automated Document & Data Extraction',
        description:
          'Multi-modal pipelines that ingest invoices, contracts, and unstructured forms into organized, queryable database records.',
      },
      {
        number: '03',
        title: 'Autonomous Event Pipelines',
        description:
          'Background worker routines and webhook handlers that process recurring verification and notification steps reliably.',
      },
      {
        number: '04',
        title: 'Internal Knowledge Assistants',
        description:
          'Permission-aware assistants trained on internal documentation to assist team members with standard operating procedures and inquiries.',
      },
      {
        number: '05',
        title: 'Anomaly & Telemetry Monitoring',
        description:
          'Background inspection scripts that monitor transaction logs and operational metrics to surface unusual activity.',
      },
    ],
  },
  {
    id: 'data-platforms',
    label: '05 / Data Platforms',
    index: '05',
    title: 'Enterprise Data Platforms & Real-Time Dashboards',
    shortTitle: 'Data & Dashboards',
    tagline: 'Centralized data stores and operational metric dashboards.',
    overview:
      'We build structured data infrastructure, aggregation pipelines, and reporting dashboards that provide clear visibility across operations. Designed for leadership teams, project directors, and compliance personnel who require reliable, consistent data without maintaining disconnected spreadsheets.',
    operationalValue:
      'Brings operational metrics together into a single governed view, enabling informed management decisions and straightforward compliance reporting.',
    keyFocus: 'Low-latency queries across large datasets and consistent data definitions.',
    reverseLayout: false,
    capabilities: [
      {
        number: '01',
        title: 'Operational & Leadership Dashboards',
        description:
          'Tailored reporting interfaces presenting financial metrics, project milestones, and departmental activity with low query latency.',
      },
      {
        number: '02',
        title: 'Centralized Data Aggregation',
        description:
          'ETL and ELT pipelines consolidating distributed database sources into structured relational and document stores.',
      },
      {
        number: '03',
        title: 'Scheduled Reporting Engines',
        description:
          'Automated reporting jobs that generate standardized performance and regulatory summaries on scheduled intervals.',
      },
      {
        number: '04',
        title: 'Telemetry & Log Analysis',
        description:
          'Instrumentation capturing system performance, error rates, and key business events for straightforward diagnostics.',
      },
    ],
  },
  {
    id: 'digital-modernization',
    label: '06 / Modernization Roadmaps',
    index: '06',
    title: 'Digital Modernization & Engineering Roadmaps',
    shortTitle: 'Digital Modernization',
    tagline: 'Phased technical execution planned for operational continuity.',
    overview:
      'We work alongside organizational leaders to systematically modernize core technical processes. Rather than disruptive all-at-once migrations, we structure upgrades into manageable, test-driven phases with thorough architectural documentation and direct engineer support.',
    operationalValue:
      'Enables predictable milestone delivery, minimizes disruption to daily business, and ensures your in-house team is trained to maintain the system long term.',
    keyFocus: 'High availability during transitions and thorough technical documentation.',
    reverseLayout: true,
    capabilities: [
      {
        number: '01',
        title: 'Workflow Auditing & Architecture Planning',
        description:
          'Reviewing operational bottlenecks to design straightforward, maintainable software architectures.',
      },
      {
        number: '02',
        title: 'Phased Rollout Plans',
        description:
          'Breaking development and deployment into prioritized milestones with clear acceptance criteria for each release.',
      },
      {
        number: '03',
        title: 'Deployment Automation & Testing',
        description:
          'Setting up automated testing, staging environments, and containerized deployments to ensure stable production releases.',
      },
      {
        number: '04',
        title: 'Handover & Team Enablement',
        description:
          'Delivering clean code repositories, architectural diagrams, and practical training so your team can operate independently.',
      },
    ],
  },
];

const seoBenefits = [
  {
    number: '01',
    title: 'Qualified Inbound Inquiries',
    description:
      'Organic search connects your application with clients actively looking for your specific services, producing higher-intent inquiries than generic advertising.',
  },
  {
    number: '02',
    title: 'Compounding Organic Discovery',
    description:
      'Unlike paid advertisements that stop generating visitors when spend ceases, technical SEO built into your codebase builds durable search authority over time.',
  },
  {
    number: '03',
    title: 'Institutional Trust & Authority',
    description:
      'Achieving strong ranking across primary search queries establishes credibility and reassurance for prospective clients and institutional partners.',
  },
  {
    number: '04',
    title: 'Fast, Accessible User Retention',
    description:
      'Search engines reward fast-loading, mobile-friendly code. Enforcing strict Core Web Vitals directly improves visitor retention and conversion rates.',
  },
];

const securityCommitment = {
  title: 'Our Security & Compliance Commitment',
  overview:
    "We build systems designed to support compliance with Kenya's Data Protection Act (2019), and we follow GDPR-aligned data handling practices for international engagements. Where a project involves personal data, we agree data processing and confidentiality terms with the client before work begins. For regulated sectors such as healthcare and finance, we work with your compliance team to meet your sector's requirements.",
  capabilities: [
    {
      number: '01',
      title: 'Secure Development Lifecycle',
      description:
        'Security is considered in system architecture, code review, dependency checks and deployment, not added as an afterthought.',
    },
    {
      number: '02',
      title: 'Role-Based Access Control',
      description:
        'Permission levels so staff, administrators and external users only access the records and functions their role requires.',
    },
    {
      number: '03',
      title: 'Encryption & Storage',
      description:
        'Encryption in transit (HTTPS/TLS) and at rest for sensitive data, secured database backups, and hosting choices agreed with you.',
    },
    {
      number: '04',
      title: 'Audit Logging & Monitoring',
      description:
        'Audit logs and monitoring to support compliance reporting, internal reviews and incident diagnosis.',
    },
  ],
};

interface RateTier {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  timeline: string;
  price: string;
  rangeNote: string;
  deliverables: string[];
  strictScopeCaps?: string[];
  badge?: string;
  highlight?: boolean;
}

const tabATiers: RateTier[] = [
  {
    id: 'web-website-seo',
    number: '01',
    title: 'Business Website & SEO',
    subtitle: 'Digital Front Door & Web Presence',
    description: 'Mobile-first business website built for high conversion, speed, and search visibility.',
    timeline: '5 – 10 Business Days',
    price: 'Starting from KES 18,000',
    rangeNote: 'Range: KES 15k – 25k',
    deliverables: [
      'Responsive, touch-optimized layouts across all viewports.',
      'Technical SEO (Schema.org microdata, sitemaps, OpenGraph tags).',
      'Sub-second Core Web Vitals performance optimization.',
      'Contact forms with spam protection & Google Maps embed.',
      'Includes 3 months of free maintenance & uptime monitoring.',
    ],
  },
  {
    id: 'web-app-payments',
    number: '02',
    title: 'Web App + Payments',
    subtitle: 'Full-Stack Product Engineering',
    description: 'Full-stack web applications featuring end-to-end user workflows and native payment pipelines.',
    timeline: '2 – 3 Weeks',
    price: 'Starting from KES 38,000',
    rangeNote: 'Range: KES 35k – 55k',
    badge: 'Popular in Kenya',
    highlight: true,
    deliverables: [
      'Lipa na M-Pesa Daraja (STK Push, C2B) & Paystack integration.',
      'Automated transaction verification & secure webhook handlers.',
      'Customer accounts, secure login sessions & booking/order portals.',
      'Instant SMS/Email receipt triggers on successful payment.',
      'Includes 3 months of free maintenance & uptime monitoring.',
    ],
  },
  {
    id: 'custom-mis-suite',
    number: '03',
    title: 'Custom Management System (MIS)',
    subtitle: 'Enterprise Operations Suites',
    description: 'Bespoke internal operations suites, central record platforms, and automated workflow engines.',
    timeline: '3 – 5 Weeks',
    price: 'Starting from KES 75,000',
    rangeNote: 'Range: KES 70k – 120k',
    deliverables: [
      'Custom workflows (inventory tracker, attendance log, multi-branch tracking).',
      'Granular Role-Based Access Control (RBAC) & immutable audit trails.',
      'Multi-step hierarchical approval & document review engines.',
      'Executive KPI dashboards & exportable business data reports (CSV/PDF).',
      'Includes 3 months of free maintenance & uptime monitoring.',
    ],
  },
];

const tabBTiers: RateTier[] = [
  {
    id: 'spec-payments-api',
    number: '01',
    title: 'Standalone Payment Gateway & API Bridges',
    subtitle: 'Middleware & Native Connectors',
    description: 'Injecting payment infrastructure, SMS channels, or ERP connectors into your existing system.',
    timeline: '3 – 7 Business Days',
    price: 'Starting from KES 20,000',
    rangeNote: 'Range: KES 20k – 35k',
    deliverables: [
      'Lipa na M-Pesa STK Push / Paystack retrofitting for legacy applications.',
      'Bulk SMS API integrations (Africa\'s Talking) with secure delivery loops.',
      'Custom API middleware bridges connecting disparate data silos.',
    ],
    strictScopeCaps: [
      'System Limit: Pricing applies to standard monoliths or CMS platforms (WordPress, Laravel, Node.js).',
      'Enterprise Exception: Integrations into enterprise ERPs (Microsoft Dynamics 365, SAP, or Sage) require complex accounting table mapping and start from KES 55,000.',
    ],
  },
  {
    id: 'spec-data-bi',
    number: '02',
    title: 'Data Analytics & Executive Dashboards',
    subtitle: 'Python Data Pipelines & BI',
    description: 'Transforming messy spreadsheets and unoptimized databases into automated, production-grade visual intelligence.',
    timeline: '1 – 2 Weeks',
    price: 'Starting from KES 35,000',
    rangeNote: 'Range: KES 30k – 60k',
    deliverables: [
      'Automated Python ETL pipelines for data extraction, cleansing, and normalization.',
      'Relational database optimization and secure warehouse configurations.',
      'Interactive business intelligence dashboards tailored for executive oversight.',
      'Scheduled, automated email reports containing localized operational insights.',
    ],
    strictScopeCaps: [
      'Data Sources: Includes integration of up to two (2) separate data sources (e.g., 1 MySQL database + 1 standardized Excel sheet schema).',
      'Data Cleansing: Assumes raw historical data is provided in a uniform structure. Repairing heavily corrupted or inconsistently formatted historic spreadsheets attracts an extra hourly data-prep fee.',
    ],
  },
  {
    id: 'spec-ai-automation',
    number: '03',
    title: 'Applied AI & Workflow Automation',
    subtitle: 'Intelligent Automation Engines',
    description: 'Deploying production-ready AI agents and automated triggers to eliminate repetitive manual labor.',
    timeline: '5 – 10 Business Days',
    price: 'Starting from KES 28,000',
    rangeNote: 'Range: KES 25k – 45k',
    deliverables: [
      'Context-aware AI customer support chatbots (WhatsApp Business, Web, Telegram).',
      'Automated lead capturing, CRM updates, and transaction triggers.',
      'Large Language Model (LLM) fine-tuning for proprietary internal document searching.',
    ],
    strictScopeCaps: [
      'Token & Gateway Costs: Base price covers software architecture and logic. All ongoing third-party usage fees—specifically OpenAI/Claude API token consumption and Meta WhatsApp Cloud API/Twilio hosting costs—are paid directly by the Client.',
      'Knowledge Base Limit: Initial AI training/vector grounding is capped at a maximum of 5 core company reference documents (PDFs/Markdown files).',
    ],
  },
];

const systemCareTier = {
  number: '04',
  title: 'System Care & Maintenance',
  subtitle: 'Continuous Engineering Support',
  description: 'Continuous health monitoring, proactive security updates, and dedicated on-call developer support.',
  billingCycle: 'Monthly Retainer',
  pricing: '3 Months FREE with any build; then KES 3,500 – 5,000 / month',
  deliverables: [
    '24/7 continuous UptimeRobot infrastructure monitoring & automated alerts.',
    'Regular security updates, dependency patches, and offsite cloud backups.',
    'Up to 3 hours/month of developer labor for minor fixes & layout tweaks.',
    'Direct WhatsApp & email engineering technical support.',
    'Zero long-term lock-in (cancel anytime with 30 days notice).',
  ],
};

const protectivePolicies = [
  {
    code: '01 / Infrastructure & Disbursements',
    title: 'Third-Party Infrastructure & Disbursements',
    points: [
      'Infrastructure Costs: All package prices cover software engineering, architecture, database design, testing, and deployment. These rates explicitly exclude annual domain registration and hosting fees (e.g., Kenya Web Experts, Truehost, HostPinnacle, AWS) and bulk SMS API balances (e.g., Africa\'s Talking).',
      'Administrative Ownership: The client pays for and retains 100% direct administrative ownership of all third-party hosting, domain, and API accounts.',
    ],
  },
  {
    code: '02 / Support Scope & Overages',
    title: 'Support Scope & Overages Defined',
    points: [
      'Adjustment Boundaries: Covered maintenance strictly targets text/image modifications, document uploads, system optimization, security patch installation, and crash restoration. It explicitly excludes architectural layout overhauls or new API integrations.',
      'Overage Billing: Any work exceeding the 3-hour monthly cap, or classified as outside the maintenance boundary, defaults to a separate milestone project or a standardized out-of-scope rate of KES 2,000 per hour (billed in 30-minute blocks).',
    ],
  },
  {
    code: '03 / Project Onboarding & Payments',
    title: 'Project Onboarding & Milestone Payments',
    points: [
      'Milestone Splits: Fixed-fee development projects require a 50% upfront deposit to schedule and initiate work. The remaining 50% balance is due immediately upon final review and staging approval, prior to production deployment or credential transfer.',
      'Content Dependency: Development timelines officially commence only after the Client has submitted at least 80% of the core content (logos, copy, product parameters) required for execution.',
    ],
  },
];

function PracticeBlock({ practice }: { practice: EngineeringPractice }) {
  const sectionRef = useRevealOnScroll<HTMLElement>({
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
    once: false,
  });

  const contentColumn = (
    <div className={`relative ${practice.reverseLayout ? 'reveal-left' : 'reveal-right'}`}>
      <div className="w-full">
        <p className="text-xs font-mono font-medium tracking-wider text-muted-foreground uppercase mb-3">
          {practice.label}
        </p>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4 leading-tight">
          {practice.title}
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          {practice.overview}
        </p>

        {/* 4-sided Strategic Value Card */}
        <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-2">
            Strategic Value
          </h3>
          <p className="text-sm text-foreground/90 leading-relaxed mb-3">
            {practice.operationalValue}
          </p>
          <div className="pt-3 border-t border-border/60 text-xs font-mono text-muted-foreground">
            <span className="text-foreground font-semibold">Priority:</span> {practice.keyFocus}
          </div>
        </div>
      </div>
    </div>
  );

  const capabilitiesColumn = (
    <div className={`relative ${practice.reverseLayout ? 'reveal-right' : 'reveal-left'}`}>
      <div className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/60">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Core Capabilities
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            {practice.capabilities.length} Specs
          </span>
        </div>

        <div className="space-y-5">
          {practice.capabilities.map((cap) => (
            <div
              key={cap.number}
              className="pb-5 border-b border-border/40 last:border-b-0 last:pb-0"
            >
              <div className="flex items-baseline gap-3 mb-1.5">
                <span className="text-xs font-mono font-semibold text-primary">
                  {cap.number}.
                </span>
                <h4 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                  {cap.title}
                </h4>
              </div>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed pl-6">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section
      id={practice.id}
      ref={sectionRef}
      className="w-full py-8 sm:py-12 border-b border-border/50 overflow-hidden bg-background transition-colors duration-300"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {practice.reverseLayout ? (
            <>
              {contentColumn}
              {capabilitiesColumn}
            </>
          ) : (
            <>
              {capabilitiesColumn}
              {contentColumn}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function ServicesClient() {
  const [activeRateTab, setActiveRateTab] = useState<'platforms' | 'specialized'>('platforms');

  const headerRef = useRevealOnScroll<HTMLElement>({
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
    once: false,
  });

  const seoRef = useRevealOnScroll<HTMLElement>({
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
    once: false,
  });

  const securityRef = useRevealOnScroll<HTMLElement>({
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
    once: false,
  });

  const pricingRef = useRevealOnScroll<HTMLElement>({
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
    once: false,
  });

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 overflow-x-hidden">
      {/* Services Header */}
      <section
        ref={headerRef}
        className="w-full pt-20 pb-6 sm:pt-24 sm:pb-8 border-b border-border/60 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden"
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 text-center">
          <p className="reveal-up text-xs font-mono font-medium tracking-widest uppercase text-primary mb-2">
            AMLABS Practice
          </p>

          <h1 className="reveal-up stagger-1 text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight mb-5 max-w-4xl mx-auto leading-tight">
            Services <span className="text-primary">Offered</span>
          </h1>

          <p className="reveal-up stagger-2 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto mb-10">
            High-performance web applications, enterprise management platforms, API integrations, and applied AI automation — engineered for reliability, security, and outright ownership.
          </p>

          {/* Quick-Jump Services Navigation */}
          <div className="reveal-up stagger-3 pt-2">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
              Quick Navigation
            </p>
            <nav
              aria-label="Services Quick Navigation"
              className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-5xl mx-auto"
            >
              {practices.map((p) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border/80 hover:border-primary/60 hover:bg-muted/40 text-foreground transition-all duration-200 shadow-sm hover:shadow text-xs font-mono"
                >
                  <span className="font-semibold text-primary">{p.index}.</span>
                  <span className="font-medium group-hover:text-primary transition-colors">{p.shortTitle}</span>
                </a>
              ))}
              <a
                href="#security-compliance"
                className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border/80 hover:border-primary/60 hover:bg-muted/40 text-foreground transition-all duration-200 shadow-sm hover:shadow text-xs font-mono"
              >
                <span className="font-semibold text-primary">07.</span>
                <span className="font-medium group-hover:text-primary transition-colors">Security & Compliance</span>
              </a>
              <a
                href="#rate-card"
                className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border/80 hover:border-primary/60 hover:bg-muted/40 text-foreground transition-all duration-200 shadow-sm hover:shadow text-xs font-mono"
              >
                <span className="font-semibold text-primary">08.</span>
                <span className="font-medium group-hover:text-primary transition-colors">Commercial Rate Card</span>
              </a>
            </nav>
          </div>
        </div>
      </section>

      {/* 6 Distinct Architectural Service Offerings */}
      {practices.map((practice) => (
        <PracticeBlock key={practice.id} practice={practice} />
      ))}

      {/* SEO Strategic Impact Section */}
      <section
        id="seo-standards"
        ref={seoRef}
        className="w-full py-8 sm:py-12 border-b border-border/50 bg-muted/20 overflow-hidden"
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="max-w-3xl mb-12 reveal-up">
            <p className="text-xs font-mono font-medium tracking-wider text-muted-foreground uppercase mb-3">
              Search Visibility & Growth
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
              Why Technical SEO Is Built Into Every Web Project
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Search engine optimization is an engineering standard embedded directly into our codebase to maximize organic discovery, user retention, and business conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {seoBenefits.map((benefit) => (
              <div
                key={benefit.number}
                className="reveal-up rounded-xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-primary mb-3 block">
                    {benefit.number}.
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 tracking-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance Section (with Kenyan Data Protection Act 2019) */}
      <section
        id="security-compliance"
        ref={securityRef}
        className="w-full py-10 sm:py-14 border-b border-border/50 bg-background overflow-hidden"
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Security Commitment */}
            <div className="lg:col-span-5 reveal-left">
              <p className="text-xs font-mono font-medium tracking-wider text-muted-foreground uppercase mb-3">
                Security & Compliance
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4 leading-tight">
                Data Protection & Regulatory Readiness
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                We apply disciplined security and data governance practices to every client engagement. Systems are designed with access control, auditability and data protection as core requirements.
              </p>

              {/* Commitment Card */}
              <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-2">
                  {securityCommitment.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {securityCommitment.overview}
                </p>
              </div>
            </div>

            {/* Right Column: Capabilities Specs */}
            <div className="lg:col-span-7 reveal-right">
              <div className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-sm shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/60">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Security Protocols
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    4 Standards
                  </span>
                </div>

                <div className="space-y-6">
                  {securityCommitment.capabilities.map((cap) => (
                    <div
                      key={cap.number}
                      className="pb-5 border-b border-border/40 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-baseline gap-3 mb-1.5">
                        <span className="text-xs font-mono font-semibold text-primary">
                          {cap.number}.
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                          {cap.title}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed pl-6">
                        {cap.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Rate Card & Engagement Tiers */}
      <section
        id="rate-card"
        ref={pricingRef}
        className="w-full py-12 sm:py-16 border-b border-border/50 bg-muted/20 overflow-hidden"
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-12">
            <p className="reveal-up text-xs font-mono font-medium tracking-widest uppercase text-primary mb-2">
              Commercial Alignment
            </p>

            <h2 className="reveal-up stagger-1 text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
              Transparent Commercial <span className="text-primary">Rate Card</span>
            </h2>

            <p className="reveal-up stagger-2 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Grounded, scope-based pricing for organizations, enterprise teams, and founders in Kenya. No agency bloat, no hidden per-user licensing fees, and full source code ownership on delivery.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="reveal-up stagger-3 flex justify-center mb-10 sm:mb-12">
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-card border border-border/80 shadow-sm max-w-full overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveRateTab('platforms')}
                className={`flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeRateTab === 'platforms'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span>Tab A: Web Platforms & Systems</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    activeRateTab === 'platforms'
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  3 Suites
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRateTab('specialized')}
                className={`flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeRateTab === 'specialized'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span>Tab B: Specialized Integrations & Data</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    activeRateTab === 'specialized'
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  3 Specs
                </span>
              </button>
            </div>
          </div>

          {/* 3 Active Tier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {(activeRateTab === 'platforms' ? tabATiers : tabBTiers).map((tier) => (
              <div
                key={tier.id}
                className={`rounded-2xl bg-card border ${
                  tier.highlight
                    ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                    : 'border-border/80 shadow-sm hover:border-primary/50'
                } p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative`}
              >
                {/* Badge if present */}
                {tier.badge && (
                  <div className="absolute -top-3 right-6">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-primary text-primary-foreground shadow-sm">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Top Tier Index & Timeline */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border/60">
                    <span className="text-xs font-mono font-bold text-primary">
                      {tier.number}.
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground font-medium">
                      ⏱ {tier.timeline}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-1 tracking-tight">
                    {tier.title}
                  </h3>

                  <p className="text-xs font-mono text-primary font-medium mb-3">
                    {tier.subtitle}
                  </p>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                    {tier.description}
                  </p>

                  {/* Pricing Block */}
                  <div className="mb-6 pb-5 border-b border-border/60">
                    <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono tracking-tight">
                      {tier.price}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground mt-1">
                      {tier.rangeNote}
                    </div>
                  </div>

                  {/* Deliverables List */}
                  <div className="mb-6">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-3 font-semibold">
                      Core Deliverables:
                    </p>
                    <ul className="space-y-2.5 text-xs text-muted-foreground">
                      {tier.deliverables.map((item, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2 leading-relaxed">
                          <FaCheckCircle className="text-primary text-[11px] shrink-0 mt-0.5" />
                          <span className="text-foreground/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Strict Scope Caps (Only on Tab B) */}
                  {tier.strictScopeCaps && tier.strictScopeCaps.length > 0 && (
                    <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5 p-4 text-xs">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold mb-2">
                        <FaExclamationTriangle className="text-[12px] shrink-0" />
                        <span className="font-mono text-[11px] uppercase tracking-wider">
                          Strict Scope Caps
                        </span>
                      </div>
                      <ul className="space-y-2 text-muted-foreground text-[11px] leading-relaxed">
                        {tier.strictScopeCaps.map((cap, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-1.5">
                            <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">•</span>
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-border/60">
                  <Link
                    href="/contact"
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                      tier.highlight
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow'
                        : 'bg-muted text-foreground hover:bg-muted/80 border border-border/80'
                    }`}
                  >
                    <span>Initiate Project</span>
                    <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Cross-Tier Recurring Benefit: 04. System Care & Maintenance */}
          <div className="reveal-up rounded-2xl border-2 border-primary/30 bg-card p-6 sm:p-8 lg:p-10 shadow-md mb-12 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-6 border-b border-border/60">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-xs font-mono font-bold text-primary">
                    {systemCareTier.number}.
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                    Cross-Tier Recurring Benefit
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                    {systemCareTier.billingCycle}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
                  {systemCareTier.title}
                </h3>
                <p className="text-sm font-medium text-primary font-mono mb-2">
                  {systemCareTier.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {systemCareTier.description}
                </p>
              </div>

              <div className="lg:text-right shrink-0 bg-muted/40 lg:bg-transparent p-4 lg:p-0 rounded-xl border border-border/40 lg:border-none">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                  Pricing Structure
                </span>
                <div className="text-lg sm:text-xl font-extrabold text-foreground font-mono">
                  {systemCareTier.pricing}
                </div>
                <span className="text-xs text-muted-foreground block mt-1">
                  Zero lock-in · 30-day notice cancellation
                </span>
              </div>
            </div>

            {/* Deliverables Subgrid */}
            <div className="pt-6">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4 font-semibold">
                Continuous Care Deliverables:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
                {systemCareTier.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs leading-relaxed">
                    <FaCheckCircle className="text-primary text-[12px] shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/40">
                <p className="text-xs text-muted-foreground">
                  * 3 hours/month covers minor adjustments, copy updates, and security patch deployment.
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://wa.me/254797834903?text=Hi%20AMLABS,%20I'm%20interested%20in%20System%20Care%20%26%20Maintenance"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm cursor-pointer"
                  >
                    <FaWhatsapp className="text-sm" />
                    <span>WhatsApp Support Inquiry</span>
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <span>Request System Care</span>
                    <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Protective Commercial Policies (3 Columns) */}
          <div className="mb-10">
            <div className="text-center mb-8">
              <p className="text-xs font-mono font-medium tracking-widest uppercase text-muted-foreground mb-1">
                Transparency & Governance
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                Protective Commercial Policies
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {protectivePolicies.map((policy) => (
                <div
                  key={policy.code}
                  className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors"
                >
                  <div>
                    <div className="mb-3 pb-2 border-b border-border/60">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                        {policy.code}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-foreground mb-4 tracking-tight">
                      {policy.title}
                    </h4>

                    <div className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                      {policy.points.map((pt, pIdx) => (
                        <p key={pIdx}>
                          {pt}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Milestone Terms Banner */}
          <div className="reveal-up rounded-2xl border border-border/60 bg-card/60 p-5 sm:p-6 text-center text-xs sm:text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Transparent Milestone Structure:</strong> 50% upfront deposit to commence engineering on private staging · 50% balance upon final staging approval, prior to production deployment or credential transfer · 100% full source code ownership on delivery.
            </p>
          </div>

        </div>
      </section>

      {/* Bottom Consultation CTA */}
      <section className="w-full py-8 sm:py-12 bg-background overflow-hidden">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="rounded-2xl bg-card border border-border/80 shadow-md p-8 sm:p-14 lg:p-18 text-center w-full mx-auto relative overflow-hidden">
            <p className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Direct Engineering Partnership
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5 max-w-3xl mx-auto leading-tight">
              Ready to Discuss Your <span className="text-primary">Software Architecture?</span>
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-9">
              Collaborate directly with the lead engineer building your platform. Structured discovery, clear milestone roadmaps, and reliable production execution.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={socialLinks.calendly || '/contact'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer hover:scale-105"
              >
                <FaCalendarAlt className="text-xs" />
                <span>Book Technical Consultation</span>
              </a>

              <Link
                href="/process"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-muted text-foreground font-semibold text-sm border border-border/80 hover:bg-muted/80 transition-all cursor-pointer hover:scale-105"
              >
                <span>View Delivery Plan</span>
                <FaArrowRight className="text-xs text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
