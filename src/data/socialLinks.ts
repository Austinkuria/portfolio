export const socialLinks = {
    github: 'https://github.com/austinmaina',
    linkedin: 'https://www.linkedin.com/in/austin-maina/',
    discord: 'https://discord.gg/austin.125', // Discord server invite link
    whatsapp: 'https://wa.me/254123456789' // WhatsApp business link with your number
} as const;

export type SocialPlatform = keyof typeof socialLinks;
