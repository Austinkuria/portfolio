'use client';

import { m } from 'framer-motion';
import { FaLayerGroup, FaCogs, FaShieldAlt, FaHandshake } from 'react-icons/fa';

const pillars = [
  {
    title: 'Navigating System Complexity',
    badge: '01 Architecture',
    description:
      'We translate multi-tiered operational workflows and complex business requirements into clean, modular software systems that adapt gracefully as your organization scales.',
    icon: FaLayerGroup,
  },
  {
    title: 'AI & Automation at the Core',
    badge: '02 Intelligence',
    description:
      'We integrate AI and workflow automation into every system where it moves the needle: automated data extraction, event-driven webhooks, and real-time operational insights that cut friction by 3x.',
    icon: FaCogs,
  },
  {
    title: 'Security & Data Protection First',
    badge: '03 Security',
    description:
      'Enterprise security is treated as a foundation, not an afterthought. Built with role-based access control (RBAC), end-to-end data encryption, and threat-hardened infrastructure.',
    icon: FaShieldAlt,
  },
  {
    title: 'Direct Engineering Partnership',
    badge: '04 Collaboration',
    description:
      'Collaborate directly with the lead engineer building your software. No account managers, no communication delays, and rapid iteration from first discovery to production deployment.',
    icon: FaHandshake,
  },
];

export default function HomePillarsSection() {
  return (
    <section className="w-full py-16 sm:py-24 bg-background transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <m.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-4"
          >
            Engineering Pillars
          </m.div>

          <m.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5"
          >
            Engineered for Resilience, <span className="text-primary">Scalability, and Speed</span>
          </m.h2>

          <m.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            We help ambitious businesses and institutions optimize operations, eliminate operational friction, and deploy reliable digital systems that drive measurable impact.
          </m.p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <m.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -5 }}
                className="rounded-[2rem] bg-card border border-border/80 shadow-sm hover:shadow-xl hover:border-primary/40 p-7 sm:p-9 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-5">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 tracking-tight">
                    {pillar.title}
                  </h3>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </m.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
