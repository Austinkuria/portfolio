'use client';

import { personalInfo, socialLinks } from '@/config';
import { FaGithub, FaLinkedin, FaArrowDown } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';
import CustomLink from '@/components/CustomLink';
import { useRef } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { MotionDiv, MotionH1, MotionP } from '@/lib/motion';

// Pre-generate random values outside of render
const circles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  width: Math.random() * 300 + 50,
  height: Math.random() * 300 + 50,
  left: Math.random() * 100,
  top: Math.random() * 100,
  scale: Math.random() * 0.5 + 0.5,
  x: Math.random() * 100 - 50,
  y: Math.random() * 100 - 50,
  duration: Math.random() * 10 + 10,
}));

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToNextSection = () => {
    const homeProjectsSection = document.getElementById('home-projects');
    if (homeProjectsSection) {
      homeProjectsSection.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionRef.current) {
      const nextSection = sectionRef.current.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section ref={sectionRef} className="w-full min-h-screen flex flex-col justify-center items-center relative overflow-hidden px-4 pt-20 md:pt-24">
      <div className="absolute inset-0 -z-10">
        <MotionDiv 
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        {/* Reduce number of animated circles for better performance */}
        {circles.slice(0, 10).map((circle) => (
          <MotionDiv
            key={circle.id}
            className="absolute rounded-full bg-primary/10 dark:bg-primary/5"
            style={{
              width: circle.width,
              height: circle.height,
              left: `${circle.left}%`,
              top: `${circle.top}%`,
              opacity: 0.8,
            }}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: circle.scale,
              x: circle.x,
              y: circle.y,
            }}
            transition={{
              duration: circle.duration,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto max-w-6xl z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] items-start gap-16">
          <div>
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium inline-block">{personalInfo.name.full} - {personalInfo.title}</span>
            </MotionDiv>
            <MotionH1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-3 leading-tight"
              style={{ minHeight: '180px' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Hi, I'm <span className="text-primary">{personalInfo.name.first}</span>
              <br />
              I transform ideas into{' '}
              <span className="relative inline-block align-top" style={{ minWidth: '280px', display: 'inline-block' }}>
                <span className="text-primary relative z-10 inline-block">
                  <TypeAnimation
                    sequence={[...personalInfo.hero.typingAnimation]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                    cursor={true}
                    style={{ display: 'inline-block', minWidth: '280px' }}
                    preRenderFirstString={true}
                  />
                </span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-primary/20 -z-0"></span>
              </span>         
            </MotionH1>
            <MotionDiv 
              className="flex flex-col sm:flex-row items-center gap-4 md:justify-start justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <CustomLink 
                  href="/projects" 
                  className="bg-primary text-primary-foreground hover:bg-primary/80 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 text-center shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
                >
                  View Projects
                </CustomLink>
                <CustomLink 
                  href={socialLinks.resume} 
                  target="_blank"
                  className="bg-secondary/10 text-foreground hover:bg-secondary/30 border border-border px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1"
                >
                  <HiDownload className="h-5 w-5" />
                  Resume
                </CustomLink>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border"></div>
              <div className="flex gap-3">
                <a 
                  href={socialLinks.github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-white hover:bg-[#24292e] transition-all p-3 rounded-full border border-border hover:border-[#24292e]"
                  aria-label="GitHub"
                >
                  <FaGithub className="h-5 w-5" />
                </a>
                <a 
                  href={socialLinks.linkedin}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-white hover:bg-[#0a66c2] transition-all p-3 rounded-full border border-border hover:border-[#0a66c2]"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="h-5 w-5" />
                </a>
              </div>
            </MotionDiv>
          </div>
          <MotionDiv 
            className="order-1 md:order-2 flex justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-80 h-64 md:w-[400px] md:h-80 lg:w-[440px] lg:h-[360px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl"></div>
              <div className="absolute inset-4 rounded-xl border border-primary/20 backdrop-blur-sm bg-background/50 overflow-y-auto overflow-x-hidden">                
                <MotionDiv
                  className="p-4 font-mono text-xs md:text-sm text-foreground/70 h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <div className="flex items-center gap-2 mb-3 border-b border-border pb-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="ml-2 text-xs text-foreground/60">DevPortfolio.tsx</span>
                  </div>                  
                  <TypeAnimation
                    sequence={[
                      `function Developer() {\n`, 150,
                      `function Developer() {\n  const skills = [\n`, 120,
                      `function Developer() {\n  const skills = [\n    'React', 'Next.js',\n`, 150,
                      `function Developer() {\n  const skills = [\n    'React', 'Next.js',\n    'TypeScript', 'Node.js'\n  ];\n\n`, 100,
                      `function Developer() {\n  const skills = [\n    'React', 'Next.js',\n    'TypeScript', 'Node.js'\n  ];\n\n  const createProject = (idea) => {\n    return idea.plan()\n      .design().develop()\n      .deploy();\n  };\n\n  return (\n    <Portfolio>\n      {skills.map(s => <Tech name={s} />)}\n    </Portfolio>\n  );\n}`, 5000,
                    ]}
                    wrapper="div"
                    cursor={true}
                    repeat={Infinity}
                    className="text-primary/80 whitespace-pre"
                    style={{
                      display: 'block',
                      minHeight: '280px'
                    }}
                    preRenderFirstString={true}
                  />
                </MotionDiv>
              </div>
              
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-primary/10"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-secondary/10"></div>
            </div>
          </MotionDiv>
        </div>
      </div>
      <MotionDiv 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <button 
          onClick={scrollToNextSection}
          className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
          aria-label="Scroll down"
        >
          <span className="text-sm mb-2">Scroll Down</span>
          <MotionDiv
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          >
            <FaArrowDown className="h-4 w-4" />
          </MotionDiv>
        </button>
      </MotionDiv>
    </section>
  );
}