import { personalInfo } from '@/config';

export const metadata = {
    title: `About | ${personalInfo.name.full}`,
    description: `Learn more about ${personalInfo.name.full}, a ${personalInfo.title.toLowerCase()} based in ${personalInfo.location}.`,
};
