'use client';

import { m } from 'framer-motion';
import { FaCheckCircle, FaRocket, FaShieldAlt, FaBolt } from 'react-icons/fa';

const stats = [
  {
    value: '50+',
    label: 'Systems & Features Shipped',
    description: 'High-performance web apps, APIs, and custom architectures deployed into production.',
    icon: FaRocket,
  },
  {
    value: '99.9%',
    label: 'Production Uptime & Reliability',
    description: 'Engineered with fault tolerance, load resilience, and proactive health monitoring.',
    icon: FaShieldAlt,
  },
  {
    value: '3x',
    label: 'Workflow Acceleration',
    description: 'Eliminating manual bottlenecks through automated pipelines and intelligent processing.',
    icon: FaBolt,
  },
  {
    value: '100%',
    label: 'Source Code & IP Handover',
    description: 'Zero vendor lock-in. Full repository admin access, credentials, and documentation.',
    icon: FaCheckCircle,
  },
];

export default function HomeStatsBar() {
  return (
    <section className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 mb-16 sm:mb-24">
      <div className="rounded-[2rem] bg-card/95 backdrop-blur-md border border-border/80 shadow-xl p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <m.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`${idx > 0 ? 'pt-6 sm:pt-0 sm:pl-6 lg:pl-8' : ''} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-foreground">
                      {stat.value}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm shrink-0">
                      <Icon />
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground mb-1.5 leading-snug">
                    {stat.label}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                    {stat.description}
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
