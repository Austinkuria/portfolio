'use client';

import Link from 'next/link';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
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
    "We comply with Kenya's Data Protection Act (2019), sector-specific regulations in healthcare and finance, and implement GDPR-aligned data handling practices for engagements with international organizations. All client data is subject to formal data processing agreements and strict confidentiality protocols prior to project initiation.",
  capabilities: [
    {
      number: '01',
      title: 'Secure Development Lifecycle',
      description:
        'Security considerations are integrated directly into system architecture, code reviews, dependency checks, and deployment pipelines — not added as an afterthought.',
    },
    {
      number: '02',
      title: 'Granular Role-Based Access Control (RBAC)',
      description:
        'Strict permission hierarchies ensuring staff, administrators, and external users only access the specific records and functions relevant to their designated responsibilities.',
    },
    {
      number: '03',
      title: 'Data Encryption & Storage Governance',
      description:
        'End-to-end encryption for sensitive data in transit and at rest, configurable jurisdiction-aligned storage policies, and protected database backups.',
    },
    {
      number: '04',
      title: 'Audit Logging & Activity Monitoring',
      description:
        'Comprehensive, tamper-evident transaction logs and telemetry monitoring to support compliance reporting, internal reviews, and incident diagnostics.',
    },
  ],
};

function PracticeBlock({ practice }: { practice: EngineeringPractice }) {
  const sectionRef = useRevealOnScroll<HTMLElement>({
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
    once: false,
  });

  const contentColumn = (
    <div className={`relative ${practice.reverseLayout ? 'reveal-left' : 'reveal-right'}`}>
      <div className="max-w-xl">
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
      className="w-full py-10 sm:py-14 border-b border-border/50 overflow-hidden bg-background transition-colors duration-300"
    >
      <div className="w-full max-w-[1536px] 2xl:max-w-[1720px] 3xl:max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
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

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 overflow-x-hidden">
      {/* Services Header */}
      <section
        ref={headerRef}
        className="w-full pt-24 pb-8 sm:pt-28 sm:pb-10 border-b border-border/60 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden"
      >
        <div className="w-full max-w-[1536px] 2xl:max-w-[1720px] 3xl:max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-center">
          <p className="reveal-up text-xs font-mono font-medium tracking-widest uppercase text-primary mb-2">
            AMLABS Practice
          </p>

          <h1 className="reveal-up stagger-1 text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight mb-5 max-w-4xl mx-auto leading-tight">
            Services <span className="text-primary">Offered</span>
          </h1>

          <p className="reveal-up stagger-2 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10">
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
        className="w-full py-16 sm:py-24 border-b border-border/50 bg-muted/20 overflow-hidden"
      >
        <div className="w-full max-w-[1536px] 2xl:max-w-[1720px] 3xl:max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
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
        <div className="w-full max-w-[1536px] 2xl:max-w-[1720px] 3xl:max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Security Commitment */}
            <div className="lg:col-span-5 reveal-left">
              <p className="text-xs font-mono font-medium tracking-wider text-muted-foreground uppercase mb-3">
                Security & Compliance
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4 leading-tight">
                Enterprise Data Protection & Regulatory Compliance
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                We implement disciplined security and data governance practices across all client engagements. Every system we build is designed with access control, regulatory compliance, and auditability as foundational requirements.
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

      {/* Bottom Consultation CTA */}
      <section className="w-full py-10 sm:py-14 bg-background overflow-hidden">
        <div className="w-full max-w-[1536px] 2xl:max-w-[1720px] 3xl:max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="rounded-2xl bg-card border border-border/80 shadow-md p-8 sm:p-14 lg:p-18 text-center max-w-5xl mx-auto relative overflow-hidden">
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
                <span>View The 13-Stage Blueprint</span>
                <FaArrowRight className="text-xs text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
