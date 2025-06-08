import { Project } from '@/data/projects';

export default function ProjectSchema({ project }: { project: Project }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: project.title,
        description: project.description,
        author: {
            '@type': 'Person',
            name: 'Austin Maina',
            url: 'https://austinmaina.vercel.app',
            jobTitle: 'Full Stack Developer',
            image: '/images/Passport_Photo_AustinMaina.jpg',
            sameAs: [
                'https://github.com/austinmaina',
                'https://austinmaina.vercel.app'
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
