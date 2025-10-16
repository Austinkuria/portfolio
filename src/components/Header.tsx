'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import CustomLink from './CustomLink';
import ThemeToggle from './ThemeToggle';
import { MotionDiv, MotionLi, MotionSpan } from '@/lib/motion';
import Logo from './Logo';

const navLinks = [
	{ name: 'Home', href: '/' },
	{ name: 'Projects', href: '/projects' },
	{ name: 'Skills', href: '/skills' },
	{ name: 'About', href: '/about' },
	// { name: 'Blog', href: '/blog' }, // Blog link commented out
	{ name: 'Contact', href: '/contact' },
];

export default function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Handle scroll event to change header style
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled
					? 'py-3 bg-background/80 backdrop-blur-md shadow-sm'
					: 'py-5 bg-transparent'
			}`}
		>
			<div className="container mx-auto px-4 flex justify-between items-center">
				<Logo />

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center space-x-8">
					<ul className="flex space-x-7">
						{navLinks.map((link) => (
							<li key={link.name} className="relative group">
								<CustomLink
									href={link.href}
									className="text-muted-foreground hover:text-primary transition-colors py-2"
								>
									{link.name}
									<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
								</CustomLink>
							</li>
						))}
					</ul>
					<div className="h-6 w-px bg-border/50 mx-2"></div>
					<ThemeToggle />
				</nav>

				{/* Mobile Navigation */}
				<div className="flex items-center md:hidden gap-4">
					<ThemeToggle />

					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="text-foreground p-2"
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? (
							<MotionDiv
								initial={{ rotate: 0 }}
								animate={{ rotate: 90 }}
								exit={{ rotate: 0 }}
								transition={{ duration: 0.2 }}
							>
								<FaTimes size={20} />
							</MotionDiv>
						) : (
							<MotionDiv
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
							>
								<FaBars size={20} />
							</MotionDiv>
						)}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<MotionDiv
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.3 }}
						className="md:hidden bg-card/95 backdrop-blur-md border-b border-border shadow-lg overflow-hidden"
					>
						<nav className="container mx-auto px-4 py-6">
							<ul className="flex flex-col space-y-0 divide-y divide-border/30">
								{navLinks.map((link, index) => (
									<MotionLi
										key={link.name}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.3, delay: index * 0.05 }}
									>
										<Link
											href={link.href}
											onClick={() => setMobileMenuOpen(false)}
											className="group flex items-center justify-between py-4 text-foreground hover:text-primary transition-colors"
										>
											<span>{link.name}</span>
											<MotionSpan
												initial={{ x: -8, opacity: 0 }}
												animate={{ x: 0, opacity: 1 }}
												transition={{ duration: 0.2, delay: index * 0.05 + 0.3 }}
												className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
													<path d="M5 12h14"></path>
													<path d="m12 5 7 7-7 7"></path>
												</svg>
											</MotionSpan>
										</Link>
									</MotionLi>
								))}
								<MotionLi
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}
									className="pt-4"
								>
									<Link
										href="/contact"
										onClick={() => setMobileMenuOpen(false)}
										className="flex items-center justify-center w-full py-3 px-6 bg-primary text-primary-foreground rounded-md font-medium transition-all hover:bg-primary/90"
									>
										<span>Get in Touch</span>
									</Link>
								</MotionLi>
							</ul>
						</nav>
					</MotionDiv>
				)}
			</AnimatePresence>
		</header>
	);
}