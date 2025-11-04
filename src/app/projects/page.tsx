'use client';

import { useState, useCallback, useRef } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Image from 'next/image';
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
    }, 50); // Reduced delay for faster response
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
      <main id="projects" className="py-20 w-full">
        <div className="container mx-auto px-4">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A selection of my recent work, showcasing my skills in web development and design
            </p>
          </MotionDiv>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {projects.map((project) => (
              <MotionArticle
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: project.id * 0.1 }}
                className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 h-full flex flex-col"
                onMouseEnter={() => handleMouseEnter(project.id)}
                onMouseLeave={handleMouseLeave}
                aria-expanded={activeProject === project.id}
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-contain transition-transform duration-300 hover:scale-[1.02] rounded-xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading={project.id <= 3 ? 'eager' : 'lazy'}
                    priority={project.id <= 2}
                    style={{ aspectRatio: '16/9' }} // Prevent CLS from image loading
                  />
                </div>

                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>

                  {/* Reserve space for expanded content */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      activeProject === project.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm text-primary mb-1">Problem:</h4>
                      <p className="text-sm text-card-foreground">{project.problem}</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm text-primary mb-1">Solution:</h4>
                      <p className="text-sm text-card-foreground">{project.solution}</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm text-primary mb-1">Metrics:</h4>
                      <ul className="list-disc pl-5 text-sm text-card-foreground">
                        {project.metrics.map((metric: string, i: number) => (
                          <li key={i}>{metric}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between p-4 border-t border-border">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm"
                  >
                    <FaGithub className="h-4 w-4" aria-hidden="true" />
                    <span>Repository</span>
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent/80 transition-colors flex items-center gap-1 text-sm"
                  >
                    <FaExternalLinkAlt className="h-3 w-3" aria-hidden="true" />
                    <span>Live Demo</span>
                  </a>
                </div>
              </MotionArticle>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-all duration-200"
            >
              View More Projects on GitHub
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
