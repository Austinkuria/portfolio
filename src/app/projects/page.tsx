'use client';

import { useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Image from 'next/image';
import { MotionDiv, MotionArticle } from '@/lib/motion';
import CanonicalURL from '@/components/CanonicalURL';
import ProjectSchema from '@/components/ProjectSchema';

type Project = {
  id: number;
  title: string;
  description: string;
  problem: string;
  solution: string;
  techStack: string[];
  metrics: string[];
  image: string;
  github: string;
  demo: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: 'Clinique Beauty E-Commerce Website',
    description: 'A full-stack e-commerce application built with the PERN stack (PostgreSQL, Express, React, Node.js) for a beauty shop, featuring M-Pesa integration for payments.',
    problem: 'Customers needed an intuitive online shopping experience for cosmetics with detailed product information and efficient checkout',
    solution: 'Developed a Next.js-based frontend with server-side rendering, implemented product categorization, dynamic filtering, and integrated shopping cart functionality',
    techStack: ['PostgreSQL', 'Express', 'React', 'Node.js', 'M-Pesa API'],
    metrics: ['Mobile-responsive design with 99% uptime', 'Advanced product filtering capabilities', 'Intuitive user experience with animated interactions'],
    image: '/images/clinique-beauty.png',
    github: 'https://github.com/Austinkuria/clinique-beauty',
    demo: 'https://clinique-beauty.vercel.app'
  },
  {
    id: 2,
    title: 'QRollCall - Smart QR Code based Student Attendance System',
    description: 'A progressive web app MERN stack attendance tracking application designed for educational institutions. It uses QR code technology for efficient attendance management, allowing lecturers to generate unique QR codes for each session that students can scan to mark their attendance.',
    problem: 'Traditional attendance systems were slow and prone to error, causing delays and inaccurate data',
    solution: 'Developed a QR-based system that allows instant check-ins via mobile devices with real-time analytics and reporting',
    techStack: ['MongoDB', 'Express', 'React', 'Node.js', 'QR Code'],
    metrics: ['Reduced check-in time by 75%', 'Improved attendance accuracy to 99.8%', 'Saved 15 hours per week in administrative work'],
    image: '/images/attendance-system.png',
    github: 'https://github.com/Austinkuria/attendance-system',
    demo: 'https://attendance-system123.vercel.app/'
  },
  {
    id: 4,
    title: 'E-Commerce Website',
    description: 'A fully functional e-commerce website built with Django (Python) for the backend and HTML, CSS, Bootstrap, and JavaScript for the frontend. Features include product listing, shopping cart, user authentication, and order management.',
    problem: 'Needed a robust, user-friendly platform for online shopping with secure authentication and efficient order processing.',
    solution: 'Developed a Django-based backend with secure user authentication, product and order management, and a responsive frontend using Bootstrap and JavaScript.',
    techStack: ['Django', 'Python', 'HTML', 'CSS', 'Bootstrap', 'JavaScript', 'jQuery', 'SQLite'],
    metrics: ['Fully responsive design', 'Secure user authentication', 'Admin dashboard for product and order management'],
    image: '/images/ecommerce-django.png',
    github: 'https://github.com/Austinkuria/E-commerce-Site',
    demo: 'https://austin125.pythonanywhere.com/',
  },
  {
    id: 5,
    title: 'Bijoux Jewelry Shop',
    description: 'A web-based platform for discovering and purchasing handcrafted jewelry, emphasizing luxury, craftsmanship, and sustainability.',
    problem: 'Needed an elegant, user-friendly online shop to showcase and sell artisan jewelry, with a focus on brand storytelling and customer engagement.',
    solution: 'Built a PHP and Python-powered site with a dynamic collections gallery, order management, user authentication, and a responsive design.',
    techStack: ['PHP', 'Python', 'HTML5', 'CSS3', 'JavaScript', 'MySQL'],
    metrics: ['Curated collections gallery', 'Order and user management', 'Contact and support features', 'Responsive design'],
    image: '/images/bijoux-jewelry.png',
    github: 'https://github.com/Austinkuria/Bijoux-Jewelry-Shop',
    demo: '#',
  },
  {
    id: 6,
    title: 'Veritas Travels',
    description: 'A responsive travel agency website offering curated travel experiences, destination guides, featured services, blog, testimonials, and newsletter subscription.',
    problem: 'Travelers needed a modern, user-friendly platform to explore destinations, book adventures, and access travel tips and services.',
    solution: 'Developed a responsive site with destination highlights, service listings, blog, testimonials, team profiles, and a contact form for personalized bookings.',
    techStack: ['HTML5', 'CSS3', 'Bootstrap 5'],
    metrics: ['Fully responsive design', 'Featured destinations and services', 'Integrated blog and newsletter', 'Client testimonials'],
    image: '/images/veritas-travels.png',
    github: 'https://github.com/Austinkuria/Veritas-Travels',
    demo: 'https://austinkuria.github.io/Veritas-Travels/',
  }
];

export default function Projects() {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  return (
    <>
      {projects.map((project) => (
        <ProjectSchema key={`schema-${project.id}`} project={project} />
      ))}
      <CanonicalURL />
      <section id="projects" className="py-20 w-full">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <MotionArticle
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: project.id * 0.1 }}
                className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                onMouseEnter={() => setActiveProject(project.id)}
                onMouseLeave={() => setActiveProject(null)}
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-contain transition-transform duration-500 hover:scale-[1.02] rounded-xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>

                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>

                  {activeProject === project.id && (
                    <MotionDiv
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
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
                          {project.metrics.map((metric, i) => (
                            <li key={i}>{metric}</li>
                          ))}
                        </ul>
                      </div>
                    </MotionDiv>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
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
                    <FaGithub className="h-4 w-4" />
                    <span>Repository</span>
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent/80 transition-colors flex items-center gap-1 text-sm"
                  >
                    <FaExternalLinkAlt className="h-3 w-3" />
                    <span>Live Demo</span>
                  </a>
                </div>
              </MotionArticle>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://github.com/austinmaina"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              View More Projects on GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}