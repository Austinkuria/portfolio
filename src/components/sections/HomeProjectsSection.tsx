'use client';

import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import CustomLink from '@/components/CustomLink';
import { MotionDiv } from '@/lib/motion';

const featuredProjects = [
	{
		id: 1,
		title: 'Clinique Beauty E-Commerce Website',
		description:
			'A full-stack e-commerce application built with the PERN stack (PostgreSQL, Express, React, Node.js) for a beauty shop, featuring M-Pesa integration for payments.',
		image: '/images/clinique-beauty.png',
		link: '/projects',
		technologies: ['PostgreSQL', 'Express', 'React', 'Node.js', 'M-Pesa'],
	},
	{
		id: 2,
		title: 'QRollCall - Smart QR Code based Student Attendance System',
		description:
			'It is a progressive web app MERN stack attendance tracking application designed for educational institutions. It uses QR code technology for efficient attendance management, allowing lecturers to generate unique QR codes for each session that students can scan to mark their attendance.',
		image: '/images/attendance-system.png',
		link: '/projects',
		technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'QR Code'],
	},
];

export default function HomeProjectsSection() {
	return (
		<section id="home-projects" className="py-12 w-full">
			<div className="container mx-auto px-4">
				<MotionDiv
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="mb-12 text-center"
				>
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Featured Projects
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						A selection of my recent work, showcasing my skills in web development
						and design
					</p>
				</MotionDiv>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 max-w-4xl mx-auto">
					{featuredProjects.map((project, index) => (
						<MotionDiv
							key={project.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.2 }}
							className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
						>
							<div className="relative h-44 overflow-hidden bg-white dark:bg-background mx-3 mt-3 -mb-2 rounded-lg">
								<Image
									src={project.image}
									alt={project.title}
									fill
									className="object-contain transition-transform duration-500 hover:scale-105 rounded-lg"
									sizes="(max-width: 768px) 100vw, 50vw"
									loading={index === 0 ? 'eager' : 'lazy'}
									priority={index === 0}
								/>
							</div>
							<div className="px-5 pb-5 pt-0">
								<h3 className="text-xl font-bold mb-2">{project.title}</h3>
								<p className="text-muted-foreground mb-4">
									{project.description}
								</p>
								{project.technologies && (
									<div className="flex flex-wrap gap-2 mt-2">
										{project.technologies.map((tech, techIndex) => (
											<span
												key={techIndex}
												className="text-xs px-2 py-1 bg-secondary rounded-full text-secondary-foreground"
											>
												{tech}
											</span>
										))}
									</div>
								)}
							</div>
						</MotionDiv>
					))}
				</div>

				<div className="text-center">
					<CustomLink
						href="/projects"
						className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
					>
						View All Projects
						<FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
					</CustomLink>
				</div>
			</div>
		</section>
	);
}
