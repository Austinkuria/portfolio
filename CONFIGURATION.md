# CONFIGURATION.md

## Portfolio Website Configuration Guide

This guide explains how to customize your portfolio website by updating personal information, project details, skills, theme, and site settings. All configuration is centralized for easy management.

---

## 1. Personal Information & Social Links

Edit your personal details and social media links in:
- `src/config/index.ts`

**Example:**
```ts
export const personalInfo = {
  name: 'Your Name',
  title: 'Full Stack Developer',
  location: 'Your City, Country',
  email: 'your-email@example.com',
  social: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourprofile',
    // ...other links
  }
};
```

---

## 2. Projects

Add or edit your projects in:
- `src/data/projects.ts`

Each project can include a title, description, tech stack, image, live demo link, and source code link.

**Example:**
```ts
export const projects = [
  {
    title: 'Project Name',
    description: 'Short description of the project.',
    image: '/images/project-image.png',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    liveDemo: 'https://project-demo.com',
    sourceCode: 'https://github.com/yourusername/project-repo',
  },
  // ...more of your projects
];
```

---

## 3. Skills

Update your skills in:
- `src/data/skills.ts` (or within `src/config/index.ts` if combined)

**Example:**
```ts
export const skills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Tailwind CSS', 'MongoDB', 'Docker',
  // ...other skills
];
```

---

## 4. Theme & Styling

- Change theme colors in `tailwind.config.js`.
- Update global styles in `src/app/globals.css`.
- Customize layout in `src/app/layout.tsx` and related files.

---

## 5. SEO & Metadata

- Edit site metadata in `src/app/metadata.ts` and `src/app/page.metadata.ts`.
- Update Open Graph, Twitter cards, and sitemap settings as needed.

---

## 6. Images & Assets

- Add profile and project images to `public/images/`.
- Reference images in your project and config files using relative paths (e.g., `/images/your-image.png`).

---

## 7. Advanced Configuration

- For custom routing, update files in `src/app/`.
- For additional providers or context, edit `src/app/providers.tsx`.
- For custom components, add to `src/components/`.

---

## 8. Deployment

- The project is ready for deployment on [Vercel](https://vercel.com/). See `vercel.json` for configuration.
- For other platforms, adjust build settings as needed.

---

## 9. Contact Form

- The contact form is located in `src/app/contact/` and API routes in `src/app/api/contact/`.
- Configure email or integration settings in the API route as needed.

---

## 10. Troubleshooting

- If you encounter issues, check your configuration files for typos or missing fields.
- Refer to the README for setup instructions.

---

## Need Help?

Feel free to open an issue or reach out via the contact links in the README.
