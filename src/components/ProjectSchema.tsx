import { Project } from '@/data/projects';
import { personalInfo, siteConfig, socialLinks } from '@/config';

export default function ProjectSchema({ project }: { project: Project }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: project.title,
        description: project.description,
        author: {
            '@type': 'Person',
            name: personalInfo.name.full,
            url: siteConfig.url,
            jobTitle: personalInfo.title,
            image: personalInfo.image,
            sameAs: [
                socialLinks.github,
                siteConfig.url
            ]
        },
        programmingLanguage: project.techStack.join(', '),
        codeRepository: project.github,
        url: project.demo,
        image: project.image,
        applicationCategory: 'WebApplication',
        abstract: project.problem,
        text: project.solution
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
