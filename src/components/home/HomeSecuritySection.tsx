'use client';

import { m } from 'framer-motion';
import { FaShieldAlt, FaUserLock, FaLock, FaClipboardList } from 'react-icons/fa';

const securityTenets = [
  {
    title: 'Secure Development Lifecycle (SDLC)',
    description:
      'Security requirements are embedded directly from architecture design through deployment—including automated dependency audits, code sanitization, and threat modeling.',
    icon: FaShieldAlt,
  },
  {
    title: 'Granular Role-Based Access Control',
    description:
      'Least-privilege permission schemas ensure administrators, staff, and end users access only the exact data and operations strictly relevant to their authenticated role.',
    icon: FaUserLock,
  },
  {
    title: 'End-to-End Data Encryption',
    description:
      'Robust data encryption applied both in transit (modern TLS 1.3) and at rest (AES-256), aligned with international data privacy best practices and GDPR principles.',
    icon: FaLock,
  },
  {
    title: 'Audit Logging & System Telemetry',
    description:
      'Comprehensive, immutable activity logs and real-time telemetry monitoring support incident investigation, anomaly detection, and transparent operational reporting.',
    icon: FaClipboardList,
  },
];

export default function HomeSecuritySection() {
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
            Security & Governance
          </m.div>

          <m.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5"
          >
            Enterprise Security Built as a Foundation, <span className="text-primary">Not an Afterthought</span>
          </m.h2>

          <m.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            We implement enterprise-grade security practices across every engagement, ensuring your systems remain resilient, secure, and compliant.
          </m.p>
        </div>

        {/* 4 Security Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {securityTenets.map((tenet, idx) => {
            const Icon = tenet.icon;
            return (
              <m.div
                key={tenet.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -5 }}
                className="rounded-[2rem] bg-card border border-border/80 shadow-sm hover:shadow-xl hover:border-primary/40 p-7 sm:p-9 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block">
                    0{idx + 1}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 tracking-tight">
                    {tenet.title}
                  </h3>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {tenet.description}
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
