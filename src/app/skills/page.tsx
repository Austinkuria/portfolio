'use client';

import { useState } from 'react';
import { /* m, */ AnimatePresence } from 'framer-motion';
import { FaReact, FaNodeJs, FaPython, FaDatabase, FaDocker, FaAws, FaGitAlt, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { SiTypescript, SiJavascript, SiMongodb, SiPostgresql, SiTailwindcss, SiNextdotjs, SiFastapi, SiSupabase, SiGraphql, SiJenkins } from 'react-icons/si';
import { TbApi } from 'react-icons/tb';
import { MotionDiv /*, MotionP*/ } from '@/lib/motion';

type SkillCategory = 'frontend' | 'backend' | 'database' | 'devops';

type Skill = {
  name: string;
  icon: React.ReactNode;
  category: SkillCategory;
  proficiency: number; // 1-10
  experience?: string; // Added experience property
};

const skills: Skill[] = [
  { name: 'React', icon: <FaReact />, category: 'frontend', proficiency: 7, experience: '3+ years' },
  { name: 'TypeScript', icon: <SiTypescript />, category: 'frontend', proficiency: 8, experience: '2+ years' },
  { name: 'JavaScript', icon: <SiJavascript />, category: 'frontend', proficiency: 9, experience: '4+ years' },
  { name: 'Next.js', icon: <SiNextdotjs />, category: 'frontend', proficiency: 8, experience: '2+ years' },
  { name: 'Tailwind CSS', icon: <SiTailwindcss />, category: 'frontend', proficiency: 9, experience: '3+ years' },
  { name: 'Node.js', icon: <FaNodeJs />, category: 'backend', proficiency: 8, experience: '3+ years' },
  { name: 'Python', icon: <FaPython />, category: 'backend', proficiency: 7, experience: '2+ years' },
  // { name: 'FastAPI', icon: <SiFastapi />, category: 'backend', proficiency: 7, experience: '1+ year' },
  { name: 'MongoDB', icon: <SiMongodb />, category: 'database', proficiency: 8, experience: '2+ years' },
  { name: 'PostgreSQL', icon: <SiPostgresql />, category: 'database', proficiency: 7, experience: '2+ years' },
  { name: 'Supabase', icon: <SiSupabase />, category: 'database', proficiency: 7, experience: '1+ year' },
  { name: 'Docker', icon: <FaDocker />, category: 'devops', proficiency: 3, experience: '1+ year' },
  // { name: 'AWS', icon: <FaAws />, category: 'devops', proficiency: 6, experience: '1+ year' },
  { name: 'Git', icon: <FaGitAlt />, category: 'devops', proficiency: 8, experience: '4+ years' },
  { name: 'CI/CD', icon: <SiJenkins />, category: 'devops', proficiency: 6, experience: '1+ year' },
  { name: 'HTML', icon: <FaHtml5 />, category: 'frontend', proficiency: 10, experience: '5+ years' },
  { name: 'CSS', icon: <FaCss3Alt />, category: 'frontend', proficiency: 9, experience: '5+ years' },
  // { name: 'GraphQL', icon: <SiGraphql />, category: 'backend', proficiency: 6, experience: '1+ year' },
  { name: 'REST APIs', icon: <TbApi />, category: 'backend', proficiency: 8, experience: '3+ years' },
];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
  // const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const categories: { value: SkillCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Skills' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'database', label: 'Database' },
    { value: 'devops', label: 'DevOps' },
  ];

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  return (
    <section id="skills" className="py-20 w-full">
      <div className="container mx-auto px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Expertise</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My technical skills and tools that I use to bring projects to life
          </p>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setActiveCategory(category.value)}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === category.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              {category.label}
            </button>
          ))}
        </MotionDiv>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 relative">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <MotionDiv
                key={skill.name}
                // layout (removing to prevent layout shifts)
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="bg-card p-4 rounded-lg shadow-md flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-shadow relative"
                // onMouseEnter={() => setHoveredSkill(skill.name)}
                // onMouseLeave={() => setHoveredSkill(null)}
                whileHover={{ transform: 'translateY(-5px)' }}
                style={{ transform: 'translateY(0)', willChange: 'transform' }}
              >
                <div className="text-4xl mb-3 text-primary group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>
                <h3 className="font-medium text-center">{skill.name}</h3>
                
                {/* Proficiency indicator commented out
                {hoveredSkill === skill.name && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-2 left-0 right-0 flex justify-center"
                  >
                    <div className="bg-card shadow-lg p-2 rounded-md text-xs">
                      <div className="w-full bg-muted rounded-full h-1.5 mb-1">
                        <div 
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${skill.proficiency * 10}%` }}
                        ></div>
                      </div>
                      <span>Proficiency: {skill.proficiency}/10</span>
                    </div>
                  </m.div>
                )}
                */}
                
                {/* Experience indicator commented out
                {hoveredSkill === skill.name && (
                  <MotionP
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-center text-muted-foreground"
                  >
                    {skill.experience}
                  </MotionP>
                )}
                */}
              </MotionDiv>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
