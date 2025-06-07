import { Project } from '@/data/projects';

export default function ProjectSchema({ project }: { project: Project }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: project.title,
        description: project.description,
        applicationCategory: 'WebApplication',
        operatingSystem: 'Any',
        author: {
            '@type': 'Person',
            name: 'Austin Maina',
            url: 'https://austinmaina.vercel.app'
        },
        screenshot: project.image,
        softwareVersion: '1.0',
        url: project.demo,
        codeRepository: project.github
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
