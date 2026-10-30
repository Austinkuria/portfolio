'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import {
  FaBars,
  FaTimes,
  FaGithub,
  FaLinkedinIn,
  FaChevronDown,
  FaCalendarAlt,
} from 'react-icons/fa';
import Link from 'next/link';
import CustomLink from './CustomLink';
import ThemeToggle from './ThemeToggle';
import { MotionDiv, MotionLi } from '@/lib/motion';
import Logo from './Logo';
import { socialLinks } from '@/config';
import ObfuscatedEmail from '@/components/common/ObfuscatedEmail';

interface NavLink {
  name: string;
  href: string;
  hasDropdown?: boolean;
}

const navLinks: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Skills', href: '/skills' },
  { name: 'Portfolio', href: '/projects' },
  { name: 'The Blueprint', href: '/process' },
  { name: 'About', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-300">
      {/* Top Bar: Clean Minimal AM LABS Identifier + Social Connections */}
      <div className="hidden lg:block w-full bg-card/90 dark:bg-card/80 backdrop-blur-md border-b border-border text-[12px] text-muted-foreground py-1.5 px-4 transition-colors">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          {/* Left: Clean Brand Indicator */}
          <div className="flex items-center space-x-3 text-xs font-mono text-muted-foreground">
            <span className="font-bold text-foreground">AMLABS</span>
            <span className="text-border">/</span>
            <span>Software Engineering & Technology</span>
          </div>

          {/* Right: Email & Social Links */}
          <div className="flex items-center space-x-5">
            <ObfuscatedEmail />
            <div className="flex items-center space-x-3 pl-3 border-l border-border text-foreground">
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="hover:text-primary transition-colors"
              >
                <FaGithub className="text-xs" />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="hover:text-primary transition-colors"
              >
                <FaLinkedinIn className="text-xs" />
              </a>
              <a
                href={socialLinks.calendly}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Book a Call"
                className="hover:text-primary transition-colors"
              >
                <FaCalendarAlt className="text-xs" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50 py-3'
            : 'bg-background/80 backdrop-blur-sm py-4'
        }`}
      >
        <div className="container mx-auto max-w-7xl px-4 flex justify-between items-center">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <ul className="flex items-center space-x-7 text-sm font-medium text-foreground">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name} className="relative group">
                    <CustomLink
                      href={link.href}
                      className={`flex items-center gap-1.5 py-1.5 transition-colors ${
                        isActive
                          ? 'text-primary font-semibold'
                          : 'text-foreground/80 hover:text-primary'
                      }`}
                    >
                      <span>{link.name}</span>
                      {link.hasDropdown && (
                        <FaChevronDown className="text-[9px] text-muted-foreground transition-transform group-hover:rotate-180 group-hover:text-primary" />
                      )}
                    </CustomLink>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center space-x-4 pl-2">
              <ThemeToggle />
              <CustomLink
                href={socialLinks.calendly || '/contact'}
                target="_blank"
                className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
              >
                Schedule Meeting
              </CustomLink>
            </div>
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center lg:hidden gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-card/95 backdrop-blur-md border-b border-border shadow-xl overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-6">
              <ul className="flex flex-col space-y-1 divide-y divide-border/40">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <MotionLi
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-3 font-medium transition-colors ${
                          isActive
                            ? 'text-primary font-semibold'
                            : 'text-foreground hover:text-primary'
                        }`}
                      >
                        <span>{link.name}</span>
                      </Link>
                    </MotionLi>
                  );
                })}
                <li className="pt-4 flex flex-col gap-3">
                  <CustomLink
                    href={socialLinks.calendly || '/contact'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full py-3 px-6 bg-primary text-primary-foreground rounded-full font-semibold text-sm shadow-md"
                  >
                    Schedule Meeting
                  </CustomLink>
                  <div className="text-xs text-muted-foreground text-center pt-2">
                    <p className="flex items-center justify-center gap-1.5 flex-wrap">
                      <span>AM LABS ·</span>
                      <ObfuscatedEmail showIcon={false} />
                    </p>
                  </div>
                </li>
              </ul>
            </nav>
          </MotionDiv>
        )}
      </AnimatePresence>
    </header>
  );
}
