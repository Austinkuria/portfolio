export type Project = {
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

export const projects: Project[] = [
    {
        id: 1,
        title: 'Clinique Beauty E-Commerce Website',
        description: 'A full-stack e-commerce application built with the PERN stack (PostgreSQL, Express, React, Node.js) for a beauty shop, featuring M-Pesa integration for payments.',
        problem: 'Customers needed an intuitive online shopping experience for cosmetics with detailed product information and efficient checkout',
        solution: 'Developed a Next.js-based frontend with server-side rendering, implemented product categorization, dynamic filtering, and integrated shopping cart functionality',
        techStack: ['PostgreSQL', 'Express', 'React', 'Node.js', 'M-Pesa API'], metrics: ['Mobile-responsive design with 99% uptime', 'Advanced product filtering capabilities', 'Intuitive user experience with animated interactions'],
        image: '/images/clinique-beauty.png',
        github: 'https://github.com/austin.125/clinique-beauty',
        demo: 'https://clinique-beauty.vercel.app'
    },
    {
        id: 2,
        title: 'QRollCall - Smart QR Code based Student Attendance System',
        description: 'A progressive web app MERN stack attendance tracking application designed for educational institutions. It uses QR code technology for efficient attendance management, allowing lecturers to generate unique QR codes for each session that students can scan to mark their attendance.',
        problem: 'Traditional attendance systems were slow and prone to error, causing delays and inaccurate data',
        solution: 'Developed a QR-based system that allows instant check-ins via mobile devices with real-time analytics and reporting',
        techStack: ['MongoDB', 'Express', 'React', 'Node.js', 'QR Code'], metrics: ['Reduced check-in time by 75%', 'Improved attendance accuracy to 99.8%', 'Saved 15 hours per week in administrative work'],
        image: '/images/attendance-system.png',
        github: 'https://github.com/austin.125/attendance-system',
        demo: 'https://attendance-system123.vercel.app/'
    },
    {
        id: 3,
        title: 'Personal Portfolio Website',
        description: 'A modern, responsive portfolio website built with Next.js and TypeScript to showcase my projects, skills, and professional experience.',
        problem: 'Needed a professional online presence to showcase my work, skills, and experience to potential employers and clients',
        solution: 'Designed and developed a Next.js-powered portfolio with optimized performance, responsive design, and interactive project displays',
        techStack: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Framer Motion'], 
        metrics: ['100/100 Lighthouse performance score', 'Fully responsive across all devices', 'SEO optimized with structured data', 'Interactive UI animations'],
        image: '/images/portfolio-website.png',
        github: 'https://github.com/Austinkuria/portfolio',
        demo: 'https://austinkuria.vercel.app'
    },
    {
        id: 4,
        title: 'E-Commerce Website',
        description: 'A fully functional e-commerce website built with Django (Python) for the backend and HTML, CSS, Bootstrap, and JavaScript for the frontend. Features include product listing, shopping cart, user authentication, and order management.',
        problem: 'Needed a robust, user-friendly platform for online shopping with secure authentication and efficient order processing.',
        solution: 'Developed a Django-based backend with secure user authentication, product and order management, and a responsive frontend using Bootstrap and JavaScript.',
        techStack: ['Django', 'Python', 'HTML', 'CSS', 'Bootstrap', 'JavaScript', 'jQuery', 'SQLite'], metrics: ['Fully responsive design', 'Secure user authentication', 'Admin dashboard for product and order management'],
        image: '/images/ecommerce-django.png',
        github: 'https://github.com/austin.125/E-commerce-Site',
        demo: 'https://austin125.pythonanywhere.com/',
    },
    {
        id: 5,
        title: 'Bijoux Jewelry Shop',
        description: 'A web-based platform for discovering and purchasing handcrafted jewelry, emphasizing luxury, craftsmanship, and sustainability.',
        problem: 'Needed an elegant, user-friendly online shop to showcase and sell artisan jewelry, with a focus on brand storytelling and customer engagement.',
        solution: 'Built a PHP and Python-powered site with a dynamic collections gallery, order management, user authentication, and a responsive design.',
        techStack: ['PHP', 'Python', 'HTML5', 'CSS3', 'JavaScript', 'MySQL'], metrics: ['Curated collections gallery', 'Order and user management', 'Contact and support features', 'Responsive design'],
        image: '/images/bijoux-jewelry.png',
        github: 'https://github.com/austin.125/Bijoux-Jewelry-Shop',
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
