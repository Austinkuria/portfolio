'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaCheckCircle, FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { projects } from '@/data/projects';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';

// Pick the top flagship enterprise projects
const selectedProjects = [
  projects[0], // Silicon Savannah Technologies
  projects[1], // Overflow Technical College
  projects[3], // QRollCall - Smart QR Attendance System
];

export default function HomeCaseStudiesSection() {
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
              Case Studies
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
              Selected <span className="text-primary">Work</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              A selection of recent builds showing the business challenge, architectural execution, and measurable outcomes.
            </p>
          </div>

          <div className="mt-6 md:mt-0 reveal-right stagger-1">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted hover:bg-muted/80 text-foreground font-semibold text-sm border border-border/80 transition-all hover:scale-105"
            >
              <span>View All Projects</span>
              <FaArrowRight className="text-xs text-primary" />
            </Link>
          </div>
        </div>

        {/* 3 Projects Grid - Aligned with Project Cards & Directional Scroll Entrance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {selectedProjects.map((project, idx) => {
            const revealClass =
              idx === 0
                ? 'reveal-left stagger-1'
                : idx === 1
                ? 'reveal-up stagger-2'
                : 'reveal-right stagger-3';

            return (
              <article
                key={project.id}
                className={`${revealClass} rounded-[2.5rem] bg-card border border-border/80 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden group`}
              >
              {/* Project Image Preview */}
              <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-muted/40 border-b border-border/60">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/90 backdrop-blur-md text-foreground text-xs font-semibold shadow hover:bg-primary hover:text-primary-foreground transition-all z-10"
                    aria-label={`View live demo for ${project.title}`}
                  >
                    <span>Live Site</span>
                    <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2.5 tracking-tight group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Structured Problem & Solution & Results */}
                  <div className="space-y-3.5 mb-5 p-4 rounded-xl bg-muted/40 border border-border/60">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">
                        The Challenge
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {project.problem}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">
                        Engineering Solution
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {project.solution}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                        Measurable Results
                      </h4>
                      <ul className="space-y-1.5">
                        {project.metrics.map((metric, mIdx) => (
                          <li key={mIdx} className="flex items-start gap-2 text-xs text-foreground font-medium">
                            <FaCheckCircle className="text-primary text-xs shrink-0 mt-0.5" />
                            <span>{metric}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-secondary text-secondary-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <FaGithub className="text-sm" />
                      <span>Repository</span>
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground/60 italic font-medium">
                      Client Proprietary
                    </span>
                  )}

                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                      <span>Live Demo</span>
                      <FaExternalLinkAlt className="text-[10px]" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
        </div>

      </div>
    </section>
  );
}
