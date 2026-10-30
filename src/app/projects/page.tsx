'use client';

import { useState, useCallback, useRef } from 'react';
import { FaGithub, FaExternalLinkAlt, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { MotionDiv, MotionArticle } from '@/lib/motion';
import CanonicalURL from '@/components/CanonicalURL';
import ProjectSchema from '@/components/ProjectSchema';
import RouteOptimizer from '@/components/RouteOptimizer';
import { Project, projects } from '@/data/projects';
import { socialLinks } from '@/config';

export default function Projects() {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback((projectId: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveProject(projectId);
    }, 50);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveProject(null);
  }, []);

  return (
    <>
      <RouteOptimizer pageName="projects" />
      {projects.map((project) => (
        <ProjectSchema key={`schema-${project.id}`} project={project} />
      ))}
      <CanonicalURL />
      <main id="projects" className="pt-20 md:pt-24 pb-8 sm:pb-12 w-full bg-background transition-colors duration-300">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10"
          >
            <p className="mb-2 text-xs font-mono font-medium uppercase tracking-widest text-primary">Selected Work</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
              Case Studies & Production <span className="text-primary">Builds</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Real-world systems, payment workflows, and applications demonstrating architecture, stability, and measurable business outcomes.
            </p>
          </MotionDiv>

          {/* 4 Cards Grid Layout for Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {projects.map((project) => (
              <MotionArticle
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: project.id * 0.05 }}
                className="bg-card rounded-2xl overflow-hidden border border-border/80 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200 h-full flex flex-col justify-between"
                onMouseEnter={() => handleMouseEnter(project.id)}
                onMouseLeave={handleMouseLeave}
                aria-expanded={activeProject === project.id}
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-muted/40">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-contain p-2 transition-transform duration-300 hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading={project.id <= 4 ? 'eager' : 'lazy'}
                      priority={project.id <= 2}
                      style={{ aspectRatio: '16/9' }}
                    />
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-bold mb-2 text-foreground leading-snug">{project.title}</h2>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-3">{project.description}</p>

                    {/* Expandable Case Study Details */}
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        activeProject === project.id ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="mb-3">
                        <h4 className="font-semibold text-xs text-primary mb-1">Problem:</h4>
                        <p className="text-xs text-card-foreground leading-relaxed">{project.problem}</p>
                      </div>
                      <div className="mb-3">
                        <h4 className="font-semibold text-xs text-primary mb-1">Solution:</h4>
                        <p className="text-xs text-card-foreground leading-relaxed">{project.solution}</p>
                      </div>
                      <div className="mb-3">
                        <h4 className="font-semibold text-xs text-primary mb-1">Metrics:</h4>
                        <ul className="list-disc pl-4 text-xs text-card-foreground space-y-0.5">
                          {project.metrics.map((metric: string, i: number) => (
                            <li key={i}>{metric}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {project.techStack.map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="text-[11px] font-mono px-2 py-0.5 bg-muted text-foreground border border-border/60 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border-t border-border/60 bg-muted/20">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-medium"
                  >
                    <FaGithub className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Repository</span>
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <span>Live Demo</span>
                    <FaExternalLinkAlt className="h-3 w-3" aria-hidden="true" />
                  </a>
                </div>
              </MotionArticle>
            ))}
          </div>

          {/* Bottom Full-Width Callout Banner */}
          <div className="w-full mt-10 sm:mt-12 rounded-[2.5rem] bg-card border border-border/80 p-8 sm:p-12 text-center shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none rounded-t-[2.5rem]" />

            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3 leading-tight">
              Ready to engineer your next production system?
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-7 leading-relaxed">
              Explore open repositories on GitHub or connect directly with our engineering lead to scope your architecture.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={socialLinks.calendly || '/contact'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow hover:bg-primary/90 transition-all hover:scale-105"
              >
                <FaCalendarAlt className="text-xs" />
                <span>Schedule Architecture Call</span>
              </a>

              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-muted text-foreground border border-border/80 font-semibold text-sm hover:bg-muted/80 transition-all hover:scale-105"
              >
                <FaGithub className="text-sm text-primary" />
                <span>View GitHub Proof</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
