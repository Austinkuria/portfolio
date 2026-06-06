'use client';

import { FaArrowRight, FaCalendarAlt, FaCheckCircle, FaClock, FaCode, FaCogs, FaRocket, FaShieldAlt } from 'react-icons/fa';
import { MotionDiv } from '@/lib/motion';
import CustomLink from '@/components/CustomLink';
import { contactConfig, socialLinks } from '@/config';

const services = [
  {
    title: 'Websites & Landing Pages',
    description: 'Fast, mobile-first, and built to convert. Perfect for startups, creators, and local businesses.',
    benefit: 'Ready in 1–2 weeks',
    icon: FaCode,
  },
  {
    title: 'MVPs & Web Apps',
    description: 'Launch a working prototype fast. I focus on core features, no feature creep.',
    benefit: 'Ship in weeks, not months',
    icon: FaRocket,
  },
  {
    title: 'M-Pesa & Payment Integration',
    description: 'Daraja STK Push, Paystack, Stripe – your customers pay the way they prefer.',
    benefit: 'Production-tested flows',
    icon: FaCogs,
  },
  {
    title: 'Fixes & Ongoing Support',
    description: 'Bug fixes, performance tuning, security updates. No need to re‑explain everything.',
    benefit: 'Same-week response',
    icon: FaShieldAlt,
  },
];

const processSteps = [
  { title: 'Tell me what you need', desc: 'One conversation – no forms, no questionnaires.' },
  { title: 'I show a direction', desc: 'Map out structure and flow before a single line of code.' },
  { title: 'I build, you stay in loop', desc: 'Regular previews, quick feedback turns.' },
  { title: 'Launch & I don’t vanish', desc: 'Clean handoff + ongoing support if needed.' },
];

const proofPoints = [
  {
    title: 'Silicon Savannah Technologies',
    label: 'E‑commerce + M‑Pesa',
    summary: 'Full online store with STK Push, Paystack, Cloudinary, and Cloudflare.',
  },
  {
    title: 'Overflow Technical College',
    label: 'Institutional website',
    summary: 'Professional presence that matches the college’s credibility.',
  },
  {
    title: 'QRollCall',
    label: 'Internal tool',
    summary: 'Replaced manual attendance with QR scanning – adopted by the whole team.',
  },
];

export default function HomeAgencySection() {
  return (
    <section id="home-agency" className="w-full py-16 md:py-24 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            What this studio does
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight text-balance">
            Clear, conversion-focused web work for real businesses.
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            I keep the process lean: define the goal, shape the page, build it cleanly, and hand it over ready to use. No fluff, no over-explaining.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm">
              <FaClock className="h-3 w-3" /> Response: {contactConfig.responseTime}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm">
              <FaCheckCircle className="h-3 w-3 text-green-600" /> {contactConfig.availability.statusMessage}
            </span>
          </div>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <MotionDiv
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{service.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{service.description}</p>
                    <span className="inline-block rounded-full bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary">
                      {service.benefit}
                    </span>
                  </div>
                </div>
              </MotionDiv>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-20">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border bg-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FaCalendarAlt className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-semibold">How it works</h3>
            </div>
            <div className="space-y-5">
              {processSteps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border bg-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold">Selected work</h3>
              <CustomLink href="/projects" className="text-sm font-medium text-primary hover:underline">
                View all →
              </CustomLink>
            </div>
            <div className="space-y-4">
              {proofPoints.map((project) => (
                <div key={project.title} className="border-b last:border-0 pb-3 last:pb-0">
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <h4 className="font-semibold">{project.title}</h4>
                    <span className="text-xs text-muted-foreground">{project.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{project.summary}</p>
                </div>
              ))}
            </div>
          </MotionDiv>
        </div>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8 md:p-12 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-semibold mb-3">
            Need a site that looks credible and gets replies?
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            I’m taking on a few new projects. You’ll work directly with me from the first message to the handoff.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <CustomLink
              href={socialLinks.calendly}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Book a call <FaArrowRight className="h-4 w-4" />
            </CustomLink>
            <CustomLink
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Start a project
            </CustomLink>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Typical response within {contactConfig.responseTime}
          </p>
        </MotionDiv>
      </div>
    </section>
  );
}