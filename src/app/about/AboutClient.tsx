'use client';

import Image from 'next/image';
import { FaArrowRight, FaCalendarAlt, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import CustomLink from '@/components/CustomLink';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { personalInfo, socialLinks } from '@/config';

const workingStandards = [
  {
    title: 'Direct Engineer Access',
    description:
      'You communicate directly with the engineer writing your code. Requirements, architecture, and timeline updates are resolved directly without account managers or delayed handoffs.',
  },
  {
    title: 'Production Testing & Reliability',
    description:
      'Every system undergoes thorough testing—validating payment flows (M-Pesa, Paystack), database constraints, and API error states before reaching production.',
  },
  {
    title: 'Clean & Documented Code',
    description:
      'We write maintainable code following modern industry standards. Projects are delivered with clear setup guides and documentation so your team can operate independently.',
  },
  {
    title: '100% Code & Asset Ownership',
    description:
      'You own all source code, repository commits, deployment configurations, and database assets upon project handover. Zero proprietary lock-in or recurring per-user fees.',
  },
];

const clientProfiles = [
  {
    title: 'Individuals & Independent Founders',
    description:
      'Solopreneurs, consultants, and leaders building high-impact custom platforms, professional web presence, or early-stage product MVPs that require precision execution.',
  },
  {
    title: 'Growing Businesses & Startups',
    description:
      'Launching fast, search-optimized web applications, authenticated user portals, and automated payment checkouts (Paystack, M-Pesa) designed for customer conversion.',
  },
  {
    title: 'Institutions & Organizations',
    description:
      'Engineering secure management information systems (MIS), internal record platforms, and role-based permissions aligned with Kenya’s Data Protection Act (2019) and GDPR.',
  },
  {
    title: 'Established Companies',
    description:
      'Replacing manual spreadsheets and disconnected tools with integrated API platforms, ERP bridges (Microsoft Dynamics 365), and automated reporting dashboards.',
  },
];

export default function AboutClient() {
  const introRef = useRevealOnScroll<HTMLElement>({ threshold: 0.08 });
  const founderRef = useRevealOnScroll<HTMLElement>({ threshold: 0.08 });
  const standardsRef = useRevealOnScroll<HTMLElement>({ threshold: 0.08 });
  const clientsRef = useRevealOnScroll<HTMLElement>({ threshold: 0.08 });
  const ctaRef = useRevealOnScroll<HTMLElement>({ threshold: 0.08 });

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 overflow-x-hidden">
      {/* 1. Header */}
      <section
        ref={introRef}
        className="w-full pt-20 pb-6 sm:pt-24 sm:pb-8 border-b border-border/60 bg-gradient-to-b from-primary/5 via-background to-background"
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 text-center">
          <p className="reveal-up text-xs font-mono font-medium tracking-widest uppercase text-primary mb-2">
            About AMLABS
          </p>

          <h1 className="reveal-up stagger-1 text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3 leading-tight">
            Software Engineering & <span className="text-primary">Technical Advisory</span>
          </h1>

          <p className="reveal-up stagger-2 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            AMLABS is an independent software studio founded by Austin Maina.
            We design, engineer, and deploy reliable digital systems, custom web applications, and integrated payment infrastructure with outright source code ownership.
          </p>
        </div>
      </section>

      {/* 2. Founder Profile & Approach */}
      <section
        id="founder"
        ref={founderRef}
        className="w-full py-8 sm:py-12 border-b border-border/50 bg-background"
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Left: Founder Card */}
            <div className="reveal-left md:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-sm rounded-2xl border border-border/80 bg-card p-6 shadow-sm text-center">
                <div className="relative w-44 h-44 mx-auto mb-4 rounded-xl overflow-hidden border border-border/60">
                  <Image
                    src={personalInfo.image}
                    alt="Austin Maina - Software Engineer & Studio Founder"
                    fill
                    sizes="(max-width: 768px) 176px, 176px"
                    priority
                    className="object-cover object-top"
                  />
                </div>

                <h2 className="text-xl font-bold text-foreground">
                  {personalInfo.name.full}
                </h2>
                <p className="text-xs font-mono text-primary mt-1 mb-2">
                  Software Engineer & Founder
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Full-stack software architect specializing in enterprise platforms, payment integrations, web applications, and data systems.
                </p>

                <div className="flex items-center justify-center gap-2 pt-3 border-t border-border/60">
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="w-8 h-8 rounded-lg border border-border/80 bg-background hover:bg-muted text-foreground flex items-center justify-center transition-colors text-xs"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="w-8 h-8 rounded-lg border border-border/80 bg-background hover:bg-muted text-foreground flex items-center justify-center transition-colors text-xs"
                  >
                    <FaLinkedinIn />
                  </a>
                  <CustomLink
                    href={socialLinks.calendly || '/contact'}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all duration-200"
                  >
                    <FaCalendarAlt className="text-[11px]" />
                    <span>Book a Call</span>
                  </CustomLink>
                </div>
              </div>
            </div>

            {/* Right: Background & Experience */}
            <div className="reveal-right md:col-span-7">
              <p className="text-xs font-mono font-medium tracking-wider text-muted-foreground uppercase mb-2">
                Background & Approach
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-4">
                Engineering built for <span className="text-primary">practical business needs</span>.
              </h2>

              <div className="space-y-3.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  I build software for organizations and individuals who need reliable, maintainable technology without agency overhead.
                  When you partner with AMLABS, you work directly with the engineer who architects the data models, writes the backend logic, connects third-party services, and deploys to production.
                </p>
                <p>
                  My engineering background covers high-concurrency payment integrations (including Kenya’s M-Pesa Daraja STK Push and Paystack), custom enterprise management systems, Python data analytics dashboards, and search-optimized web applications.
                </p>
                <p>
                  Every engagement is delivered with clean, documented code and complete ownership of all repositories and configurations transferred upon launch.
                </p>
              </div>

              {/* Technical Skills Link */}
              <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <div className="text-muted-foreground">
                  <span className="text-foreground font-semibold">Focus:</span> Software Systems, APIs & Data
                </div>
                <CustomLink
                  href="/skills"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  <span>View Technical Stack & Skills</span>
                  <FaArrowRight className="text-[10px]" />
                </CustomLink>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. How We Work (Working Standards) */}
      <section
        id="standards"
        ref={standardsRef}
        className="w-full py-8 sm:py-12 border-b border-border/50 bg-muted/20"
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="max-w-2xl mb-8">
            <p className="reveal-up text-xs font-mono font-medium tracking-wider text-muted-foreground uppercase mb-2">
              Working Standards
            </p>
            <h2 className="reveal-up stagger-1 text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
              How We Work
            </h2>
            <p className="reveal-up stagger-2 text-sm text-muted-foreground">
              Direct, reliable engineering practices applied to every engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {workingStandards.map((item, idx) => (
              <div
                key={idx}
                className="reveal-up rounded-xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Who We Work With (Includes Individuals & Founders) */}
      <section
        id="clients"
        ref={clientsRef}
        className="w-full py-8 sm:py-12 border-b border-border/50 bg-background"
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="max-w-2xl mb-8">
            <p className="reveal-up text-xs font-mono font-medium tracking-wider text-muted-foreground uppercase mb-2">
              Partnerships
            </p>
            <h2 className="reveal-up stagger-1 text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
              Who We Work With
            </h2>
            <p className="reveal-up stagger-2 text-sm text-muted-foreground">
              Individuals, startups, and institutions that value direct communication, reliable payment infrastructure, and code they own outright.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {clientProfiles.map((item, idx) => (
              <div
                key={idx}
                className="reveal-up rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Full-Width CTA */}
      <section
        id="cta"
        ref={ctaRef}
        className="w-full py-8 sm:py-12 bg-muted/20"
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 text-center">
          <div className="reveal-up rounded-[2.5rem] border border-border/80 bg-card p-8 sm:p-12 shadow-sm w-full relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none rounded-t-[2.5rem]" />

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-3">
              Have a project in mind?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-xl mx-auto">
              Schedule a direct consultation to discuss your system architecture, payment integrations, or data workflows.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <CustomLink
                href={socialLinks.calendly || '/contact'}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-105"
              >
                <FaCalendarAlt className="text-xs" />
                <span>Schedule a Call</span>
              </CustomLink>

              <CustomLink
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background hover:bg-muted/40 px-7 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:scale-105"
              >
                <span>Send a Message</span>
                <FaArrowRight className="text-xs text-primary" />
              </CustomLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
