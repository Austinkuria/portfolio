'use client';

import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';

interface StackDomain {
  domain: string;
  badge: string;
  description: string;
  coreTech: string[];
  keyHighlights: string[];
}

const stackDomains: StackDomain[] = [
  {
    domain: 'Web Architecture & Technical SEO',
    badge: '01 / Frontend & SEO',
    description:
      'Fast, mobile-first web platforms built for user conversion and durable organic search ranking.',
    coreTech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Schema.org'],
    keyHighlights: [
      'Sub-second Core Web Vitals performance',
      'Structured metadata & automatic sitemaps for SEO',
      'Responsive touch layouts across all screen viewports',
    ],
  },
  {
    domain: 'Backend Systems & Payment APIs',
    badge: '02 / Services & Fintech',
    description:
      'Reliable server-side architectures, event queues, and automated payment gateways.',
    coreTech: ['Node.js', 'Python (Django)', 'M-Pesa Daraja', 'Paystack', 'Redis'],
    keyHighlights: [
      'M-Pesa STK Push & Paystack checkout workflows',
      'RESTful APIs, WebSockets & BullMQ background queues',
      'Rate limiting, auth sessions & secure error logging',
    ],
  },
  {
    domain: 'Enterprise Platforms & Data Analytics',
    badge: '03 / Core Platforms & Data',
    description:
      'Custom management information systems (MIS), ERP connectors, and KPI dashboards.',
    coreTech: ['PostgreSQL', 'Python (Pandas)', 'Dynamics 365', 'Docker', 'Recharts'],
    keyHighlights: [
      'Custom departmental management & approval workflows',
      'Python data analysis pipelines & exportable reports',
      'Role-based permissions & audit logging compliance',
    ],
  },
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
      className="w-full py-10 sm:py-14 bg-background transition-colors duration-300 overflow-hidden"
    >
      <div className="w-full max-w-[1536px] 2xl:max-w-[1720px] 3xl:max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div className="max-w-2xl reveal-left">
            <p className="text-xs font-mono font-medium tracking-widest uppercase text-primary mb-2">
              Technology & Architecture
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
              Engineering Stack & <span className="text-primary">Integrations</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Production-tested frameworks, database stores, and third-party APIs deployed to build fast, dependable software.
            </p>
          </div>

          <div className="mt-5 md:mt-0 reveal-right stagger-1">
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs sm:text-sm border border-border/80 transition-all hover:scale-105"
            >
              <span>Explore Full Skills Directory</span>
              <FaArrowRight className="text-xs text-primary" />
            </Link>
          </div>
        </div>

        {/* 3 Core Capability Domain Panels (Clean, No Unnecessary Icons) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stackDomains.map((domain, idx) => {
            const revealClass =
              idx === 0
                ? 'reveal-left stagger-1'
                : idx === 1
                ? 'reveal-up stagger-2'
                : 'reveal-right stagger-3';

            return (
              <div
                key={domain.domain}
                className={`${revealClass} rounded-2xl bg-card border border-border/80 p-6 sm:p-7 shadow-sm hover:border-primary/50 transition-all duration-200 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border/60">
                    <span className="text-xs font-mono font-semibold text-primary">
                      {domain.badge}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Production Stack
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight">
                    {domain.domain}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {domain.description}
                  </p>

                  {/* Core Technologies Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {domain.coreTech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-muted text-foreground border border-border/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Highlights List */}
                  <ul className="space-y-2 pt-4 border-t border-border/60">
                    {domain.keyHighlights.map((highlight, hIdx) => (
                      <li
                        key={hIdx}
                        className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
                      >
                        <span className="text-primary font-bold text-[10px] mt-0.5">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
