import Link from 'next/link';
import { FaGithub, FaLinkedin, FaXTwitter, FaEnvelope, FaWhatsapp } from 'react-icons/fa6';
import BackToTopLink from './BackToTopLink'; 

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
              Austin<span className="text-primary">Maina</span>
              <span className="inline-block w-2 h-2 bg-primary rounded-full ml-1 animate-pulse"></span>
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Building scalable solutions with code & creativity. Let's create something amazing together.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://github.com/Austinkuria"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted-foreground/10 p-2.5 rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="GitHub"
              >
                <FaGithub size={18} />
              </a>
              <a
                href="https://linkedin.com/in/austin-maina"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted-foreground/10 p-2.5 rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted-foreground/10 p-2.5 rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Twitter (X)"
              >
                <FaXTwitter size={18} />
              </a>
              <a
                href="mailto:kuriaaustin125@gmail.com"
                className="bg-muted-foreground/10 p-2.5 rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Email"
              >
                <FaEnvelope size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-5 flex items-center">
              <span className="w-6 h-0.5 bg-primary mr-2"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="w-0 h-0.5 bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/skills" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="w-0 h-0.5 bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                  Skills
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
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
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
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
            <div className="space-y-4">
              <div className="flex items-start group">
                <div className="bg-primary/10 p-2 rounded-lg text-primary transition-all duration-300 mr-3">
                  <FaEnvelope size={16} />
                </div>
                <div>
                  <h5 className="font-medium text-sm">Email</h5>
                  <a
                    href="mailto:kuriaaustin125@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Send Email
                  </a>
                </div>
              </div>
              <div className="flex items-start group">
                <div className="bg-primary/10 p-2 rounded-lg text-primary transition-all duration-300 mr-3">
                  <FaWhatsapp size={16} />
                </div>
                <div>
                  <h5 className="font-medium text-sm">WhatsApp</h5>
                  <a
                    href="https://wa.me/254792123456"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              <Link 
                href="/contact" 
                className="mt-2 inline-flex items-center px-4 py-2 border border-primary/30 rounded-md text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Send a message
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1.5">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 mt-4 pt-4 flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground text-sm">© {currentYear} Austin Maina. All rights reserved.</p>
          <div className="mt-4">
            <BackToTopLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
