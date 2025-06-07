import { MetadataRoute } from 'next';
import { projects, Project } from '@/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://austinmaina.vercel.app'

    // List all static routes
    const routes = [
        '',
        '/about',
        '/projects',
        '/skills',
        '/blog',
        '/contact'
    ]
    const staticPages = routes.map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));    // Add project pages to sitemap
    const projectPages = projects.map((project: Project) => ({
        url: `${baseUrl}/projects#${project.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...projectPages]
}
