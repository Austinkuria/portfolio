import Link from 'next/link';
import { FaGithub, FaLinkedin, FaDiscord, FaWhatsapp } from 'react-icons/fa6';
import BackToTopLink from './BackToTopLink';
import { socialLinks, SocialPlatform } from '@/data/socialLinks';
import { personalInfo } from '@/config';

const SocialIcon = ({ platform }: { platform: SocialPlatform }) => {
  const icons = {
    github: FaGithub,
    linkedin: FaLinkedin,
    discord: FaDiscord,
    whatsapp: FaWhatsapp,
  } as const;
  
  // Only render icon if it exists in our icon mapping
  if (!(platform in icons)) return null;
  
  const Icon = icons[platform as keyof typeof icons];
  const url = socialLinks[platform];
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-muted-foreground/10 p-2.5 rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
      aria-label={platform.charAt(0).toUpperCase() + platform.slice(1)}
    >
      <Icon size={18} />
    </a>
  );
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-b from-muted/50 to-muted py-4 md:py-6 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-1/4 w-40 h-40 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              {personalInfo.name.first}<span className="text-primary">{personalInfo.name.last}</span>
              <span className="inline-block w-2 h-2 bg-primary rounded-full ml-1 animate-pulse"></span>
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xs">
              {personalInfo.tagline}. Let's create something amazing together.
            </p>            <div className="flex space-x-3">
              {(Object.keys(socialLinks) as SocialPlatform[]).map((platform) => (
                <SocialIcon key={platform} platform={platform} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-5 flex items-center">
              <span className="w-6 h-0.5 bg-primary mr-2"></span>
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group text-sm sm:text-base">
                  <span className="w-0 h-0.5 bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/skills" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group text-sm sm:text-base">
                  <span className="w-0 h-0.5 bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                  Skills
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group text-sm sm:text-base">
                  <span className="w-0 h-0.5 bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                  About
                </Link>
              </li>
              {/*
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="w-0 h-0.5 bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                  Blog
                </Link>
              </li>
              */}
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group text-sm sm:text-base">
                  <span className="w-0 h-0.5 bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-5 flex items-center">
              <span className="w-6 h-0.5 bg-primary mr-2"></span>
              Get In Touch
            </h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start group">
                  <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg text-primary transition-all duration-300 mr-2 sm:mr-3">
                    <FaDiscord size={14} className="sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <h5 className="font-medium text-xs sm:text-sm">Discord</h5>
                    <a
                      href={socialLinks.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm"
                    >
                      Join Discord Server
                    </a>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg text-primary transition-all duration-300 mr-2 sm:mr-3">
                    <FaWhatsapp size={14} className="sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <h5 className="font-medium text-xs sm:text-sm">WhatsApp</h5>
                    <a
                      href={socialLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <Link 
                href="/contact#contact-form" 
                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-primary/30 rounded-md text-xs sm:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Send a message
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1.5 sm:w-4 sm:h-4">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 mt-4 pt-4 flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground text-sm">© {currentYear} {personalInfo.name.full}. All rights reserved.</p>
          <div className="mt-4">
            <BackToTopLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
