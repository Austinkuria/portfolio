'use client';

import { useState } from 'react';
import Link from 'next/link';
import { m } from 'framer-motion';
import {
  FaCalendarAlt,
  FaComments,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
  FaFileContract,
  FaLayerGroup,
  FaServer,
  FaVial,
  FaRocket,
  FaHandshake,
  FaUserLock,
  FaSearchPlus,
  FaChartLine,
} from 'react-icons/fa';
import { socialLinks } from '@/config';

interface ProcessStep {
  number: number;
  title: string;
  phase: string;
  description: string;
  bullets?: string[];
  icon: typeof FaComments;
  isSpecial?: boolean;
}

const steps: ProcessStep[] = [
  {
    number: 1,
    title: 'Initial Engagement',
    phase: 'Discovery',
    icon: FaComments,
    description:
      'You reach out with your project idea or business challenge. We connect for a direct introduction to discuss what you want to build, answer your initial questions, and schedule a discovery session.',
  },
  {
    number: 2,
    title: 'Confidentiality & NDA Alignment',
    phase: 'Discovery',
    icon: FaUserLock,
    description:
      'Before looking at any proprietary workflows, customer data, or internal systems, we sign a Non-Disclosure Agreement (NDA)—either yours or mine—so your business information remains 100% protected.',
  },
  {
    number: 3,
    title: 'Project Briefing/ Requirement Workshop',
    phase: 'Discovery',
    icon: FaSearchPlus,
    description:
      'A structured, focused session where we dig into your requirements and clarify what the software needs to do:',
    bullets: [
      'Understand how your business currently operates and where friction exists',
      'Define clear system objectives, essential features, and user journeys',
      'Assess the best technology and architecture fit for your goals',
    ],
  },
  {
    number: 4,
    title: 'Formal Proposal Submission',
    phase: 'Scoping',
    icon: FaFileContract,
    description:
      'I deliver a comprehensive, easy-to-read proposal outlining the entire plan:',
    bullets: [
      'Exact scope of work and features to be built',
      'Recommended tech stack and system architecture',
      'Clear delivery timeline broken into milestones',
      'Transparent pricing and post-launch support options',
    ],
  },
  {
    number: 5,
    title: 'Research and Solution Development',
    phase: 'Scoping',
    icon: FaLayerGroup,
    description:
      'I research technical integrations and workflows specific to your industry, then develop a solution architecture designed to scale with your user volume, keep data secure, and run reliably.',
  },
  {
    number: 6,
    title: 'Negotiation and Agreement',
    phase: 'Scoping',
    icon: FaHandshake,
    description:
      'We review the proposal together and fine-tune scope, timelines, and payment milestones. This ensures total alignment with your budget and launch schedule before any code is written.',
  },
  {
    number: 7,
    title: 'Contract Signing',
    phase: 'Planning',
    icon: FaShieldAlt,
    description:
      'We finalize the agreed deliverables, timeline, and costs into a clear, binding contract. Both sides have total clarity and peace of mind on what will be delivered.',
  },
  {
    number: 8,
    title: 'Project Milestone Mapping',
    phase: 'Planning',
    icon: FaChartLine,
    description:
      'I map out the project into concrete milestones with realistic delivery dates. You always know what is being built in each phase, what comes next, and when you can test it.',
  },
  {
    number: 9,
    title: 'Project Kick-off and Server Setup',
    phase: 'Execution',
    icon: FaServer,
    description:
      'Development starts. I design clean UI/UX layouts and flows while setting up your cloud infrastructure, databases, and a private staging environment where you can preview progress in real time.',
  },
  {
    number: 10,
    title: 'Governance & Progress Reporting',
    phase: 'Execution',
    icon: FaCheckCircle,
    description:
      'You are never left guessing. I maintain direct, consistent communication with regular updates:',
    bullets: [
      'Bi-weekly progress demos showing working software',
      'Review sessions to gather your feedback and iterate quickly',
      'Transparent reporting on completed milestones and upcoming work',
    ],
  },
  {
    number: 11,
    title: 'Testing & QA',
    phase: 'Execution',
    icon: FaVial,
    description:
      'Before anything goes to your customers, I put the entire system through thorough quality checks:',
    bullets: [
      'Functional and end-to-end user workflow testing',
      'Speed, mobile responsiveness, and load optimization',
      'Security audits, data validation, and payment flow checks (e.g., M-Pesa STK Push)',
    ],
  },
  {
    number: 12,
    title: 'Project Completion & Handover',
    phase: 'Launch',
    icon: FaRocket,
    description:
      'Once tested and approved, I deploy your system to production and hand over full ownership with zero lock-in:',
    bullets: [
      'Source code repository access with full administrative ownership',
      'Compiled builds (web apps, mobile apps, or backend APIs)',
      'Clear documentation (API docs, admin guides, system setup)',
      'All design files, assets, and branding materials',
    ],
  },
  {
    number: 13,
    title: 'Ongoing Support & Partnership',
    phase: 'Partnership',
    icon: FaShieldAlt,
    isSpecial: true,
    description:
      'Launch is just the beginning. I remain your dedicated technical partner to keep your software fast, secure, and competitive:',
    bullets: [
      'System maintenance, uptime monitoring, and security updates',
      'New feature rollouts, API updates, and performance tuning',
      'AI and automated workflow integrations as your business grows',
      'Direct technical advisory whenever you have a strategic question',
    ],
  },
];

const phases = ['All Steps', 'Discovery', 'Scoping', 'Planning', 'Execution', 'Launch', 'Partnership'];

export default function ProcessClient() {
  const [activePhase, setActivePhase] = useState('All Steps');

  const filteredSteps =
    activePhase === 'All Steps'
      ? steps
      : steps.filter((s) => s.phase === activePhase);

  return (
    <main className="min-h-screen pt-28 md:pt-36 pb-24 bg-[#faf8f5] dark:bg-background transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">


          <m.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4"
          >
            How Ambitious Systems Get Built <span className="text-primary">Without The Friction</span>
          </m.h1>


          {/* Phase Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {phases.map((phase) => (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activePhase === phase
                    ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border/60 hover:bg-muted/40'
                }`}
              >
                {phase}
              </button>
            ))}
          </div>
        </div>

        {/* 13 Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredSteps.map((step) => {
            const isNavyCard = step.isSpecial;

            return (
              <m.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: step.number * 0.03 }}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col justify-between rounded-[2rem] p-7 sm:p-8 transition-all duration-300 ${
                  isNavyCard
                    ? 'bg-[#0c2340] dark:bg-[#07172b] text-white shadow-xl hover:shadow-2xl border-0 overflow-hidden'
                    : 'bg-card text-card-foreground border border-border/80 shadow-sm hover:shadow-xl hover:border-primary/40'
                }`}
              >
                {/* Background glow decoration for Card 13 */}
                {isNavyCard && (
                  <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
                )}

                <div>
                  {/* Top Badge: Amber/Golden Circle as in Reference */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-4 ring-amber-500/20">
                      {step.number}
                    </div>

                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isNavyCard
                          ? 'bg-white/10 text-amber-300 border border-white/10'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step.phase}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3
                    className={`text-xl sm:text-[22px] font-bold tracking-tight mb-3.5 leading-snug ${
                      isNavyCard ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    {step.title}
                  </h3>

                  {/* Card Main Description */}
                  <p
                    className={`text-sm sm:text-[15px] leading-relaxed mb-3 ${
                      isNavyCard ? 'text-slate-200/90' : 'text-muted-foreground'
                    }`}
                  >
                    {step.description}
                  </p>

                  {/* Bullet points if present */}
                  {step.bullets && step.bullets.length > 0 && (
                    <ul className="space-y-1.5 mt-2.5">
                      {step.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className={`text-xs sm:text-[13.5px] leading-relaxed flex items-start gap-2 ${
                            isNavyCard ? 'text-slate-300' : 'text-muted-foreground'
                          }`}
                        >
                          <span
                            className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                              isNavyCard ? 'bg-amber-400' : 'bg-primary'
                            }`}
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Subtext footnote for Card 13 */}
                {isNavyCard && (
                  <div className="mt-6 pt-5 border-t border-white/10 text-xs text-slate-300/80 italic">
                    Ensuring your systems not only function smoothly, but continuously adapt and support your business growth.
                  </div>
                )}
              </m.div>
            );
          })}
        </div>

        {/* Bottom Callout Banner */}
        <m.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 lg:mt-24 rounded-[2.5rem] bg-card border border-border/80 shadow-md p-8 sm:p-12 lg:p-16 text-center max-w-5xl mx-auto relative overflow-hidden"
        >
          {/* Subtle gradient highlights */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none rounded-t-[2.5rem]" />

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-5 max-w-2xl mx-auto leading-tight">
            Looking for a dedicated software partner to build your next system?
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
            At <strong className="text-foreground font-semibold">AM Softwares Ke</strong>, you collaborate directly with the engineer designing and building your product to deliver scalable software built around how your business works.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={socialLinks.calendly || '/contact'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-all duration-200 cursor-pointer hover:scale-105"
            >
              <FaCalendarAlt className="text-xs" />
              <span>Book a Discovery Call</span>
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-muted text-foreground font-semibold text-sm border border-border/80 hover:bg-muted/80 transition-all duration-200 cursor-pointer"
            >
              <span>Send a Message</span>
              <FaArrowRight className="text-xs text-primary" />
            </Link>
          </div>
        </m.div>

      </div>
    </main>
  );
}
