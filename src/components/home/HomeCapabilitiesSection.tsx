'use client';

import Link from 'next/link';
import {
  FaArrowRight,
  FaCode,
  FaServer,
  FaDatabase,
  FaShieldAlt,
  FaCheck,
  FaBolt,
  FaLayerGroup,
} from 'react-icons/fa';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';

interface StackDomain {
  icon: typeof FaCode;
  domain: string;
  badge: string;
  coreTech: string[];
  metrics: string[];
}

const stackDomains: StackDomain[] = [
  {
    icon: FaCode,
    domain: 'Frontend & Web Systems',
    badge: 'UI & App Layer',
    coreTech: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS'],
    metrics: [
      'Sub-second Core Web Vitals (LCP < 1.2s)',
      'Server Components (RSC) for instant loads',
      'Adaptive mobile-first layout architecture',
    ],
  },
  {
    icon: FaServer,
    domain: 'Backend & Microservices',
    badge: 'API & Service Layer',
    coreTech: ['Node.js', 'Express', 'Python', 'FastAPI'],
    metrics: [
      'Resilient RESTful APIs & background workers',
      'Idempotent webhook handlers & event queues',
      'Type-safe data contracts & validation pipelines',
    ],
  },
  {
    icon: FaDatabase,
    domain: 'Databases & State Caching',
    badge: 'Persistence Layer',
    coreTech: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma ORM'],
    metrics: [
      'ACID transactional data integrity',
      'In-memory Redis caching (< 8ms query response)',
      'Structured relational schemas & data migrations',
    ],
  },
  {
    icon: FaShieldAlt,
    domain: 'Fintech, Security & Cloud',
    badge: 'Infrastructure Layer',
    coreTech: ['M-Pesa STK Push', 'Stripe', 'Docker', 'Cloudflare'],
    metrics: [
      'Zero-drop checkout & ledger reconciliation',
      'Role-based access control (RBAC) & TLS 1.3',
      'Bot defense & automated CI/CD deployments',
    ],
  },
];

const techPills = [
  'TypeScript',
  'Next.js 15',
  'React 19',
  'Node.js',
  'Python',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Docker',
  'Cloudflare Turnstile',
  'M-Pesa Daraja API',
  'Stripe',
  'Prisma ORM',
  'Tailwind CSS',
  'REST APIs',
  'CI/CD Pipelines',
];

export default function HomeCapabilitiesSection() {
  const sectionRef = useRevealOnScroll<HTMLElement>({
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
    once: false,
  });

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 sm:py-24 bg-background transition-colors duration-300 overflow-hidden"
    >
      <div className="w-full max-w-[1536px] 2xl:max-w-[1720px] 3xl:max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div className="max-w-2xl reveal-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-4">
              <FaLayerGroup className="text-[11px]" />
              <span>Technology & Architecture</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
              Engineering Stack & <span className="text-primary">Infrastructure</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Production-hardened technologies, frameworks, and cloud infrastructure engineered for low latency, zero downtime, and seamless horizontal scale.
            </p>
          </div>

          <div className="mt-6 md:mt-0 reveal-right stagger-1">
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted hover:bg-muted/80 text-foreground font-semibold text-sm border border-border/80 transition-all hover:scale-105"
            >
              <span>Explore Full Skills Directory</span>
              <FaArrowRight className="text-xs text-primary" />
            </Link>
          </div>
        </div>

        {/* 4 Architectural Domain Panels (Tech Stack Strip) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stackDomains.map((domain, idx) => {
            const Icon = domain.icon;
            const revealClass =
              idx === 0
                ? 'reveal-left stagger-1'
                : idx === 1
                ? 'reveal-up stagger-2'
                : idx === 2
                ? 'reveal-up stagger-3'
                : 'reveal-right stagger-4';

            return (
              <div
                key={domain.domain}
                className={`${revealClass} rounded-[2rem] bg-card border border-border/80 p-6 sm:p-7 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="p-2.5 rounded-xl bg-primary/10 text-primary text-sm group-hover:scale-110 transition-transform">
                      <Icon />
                    </span>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {domain.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-3 tracking-tight">
                    {domain.domain}
                  </h3>

                  {/* Core Technologies Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {domain.coreTech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-md text-[11.5px] font-mono font-medium bg-primary/5 text-primary border border-primary/15"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Architectural Standards */}
                  <ul className="space-y-2 pt-4 border-t border-border/60">
                    {domain.metrics.map((metric, mIdx) => (
                      <li
                        key={mIdx}
                        className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
                      >
                        <FaCheck className="text-primary text-[10px] shrink-0 mt-1" />
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Tech Pills Ribbon */}
        <div className="reveal-up stagger-5 rounded-2xl bg-muted/40 border border-border/70 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground shrink-0">
              <FaBolt className="text-primary" />
              <span>Core Tooling & Protocols</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {techPills.map((pill) => (
                <span
                  key={pill}
                  className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-background text-foreground/90 border border-border shadow-2xs hover:border-primary/50 transition-colors"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
