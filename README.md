
# Portfolio Website

This is a personal portfolio website showcasing my skills, projects, and experience as a Full Stack Developer. Built with [Next.js](https://nextjs.org), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/), it features a modern, responsive design and interactive UI.

> 📋 **Configuration Note:**  
All personal information, project details, and settings are managed centrally in [`src/config/index.ts`](src/config/index.ts). For customization instructions, see [CONFIGURATION.md](CONFIGURATION.md).

---

## ✨ Features

- **Responsive Design:** Optimized for desktop, tablet, and mobile.
- **Interactive UI:** Smooth animations via [Framer Motion](https://www.framer.com/motion/).
- **Project Showcase:** Detailed views with live demos and source code links.
- **Skills Overview:** Highlights proficiency in frontend, backend, database, and DevOps tools.
- **Blog Section:** (Optional) Share insights and articles on web development.
- **Contact Form:** Secure, validated form with file upload and social links.
- **Dark Mode:** Theme toggling for user preference.
- **SEO Optimized:** Structured data, Open Graph, Twitter cards, and sitemap.
- **Centralized Configuration:** Update all personal and site data in one place.
- **Performance:** Fast load times, smooth navigation, and optimized assets.
- **Accessibility:** Keyboard navigation, color contrast, and ARIA labels.
- **Deployment:** Ready for [Vercel](https://vercel.com/) with optimized build.

---

## 🛠️ Tech Stack

**Frontend:**
- [Next.js](https://nextjs.org/) (React Framework)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (animations)
- [React Icons](https://react-icons.github.io/react-icons/)

**Deployment:**
- [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/Austinkuria/portfolio.git
cd portfolio
```

Install dependencies and run the development server:

```bash
npm install
npm run dev
# or
yarn install
yarn dev
# or
pnpm install
pnpm dev
# or
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ Project Structure

- `src/app/` — Next.js app directory (pages, routing, metadata)
- `src/components/` — Reusable UI components (Hero, Footer, ProjectSchema, etc.)
- `src/data/` — Project and skills data
- `src/config/` — Centralized configuration (personal info, site settings, social links)
- `public/images/` — Project and profile images

---

## 🧩 Customization

- Update your details, skills, and social links in [`src/config/index.ts`](src/config/index.ts).
- Add or edit projects in [`src/data/projects.ts`](src/data/projects.ts).
- Change theme colors in [`tailwind.config.js`](tailwind.config.js) and [`src/app/globals.css`](src/app/globals.css).
- For advanced SEO, edit [`src/app/metadata.ts`](src/app/metadata.ts).

---

## 📈 Performance & SEO

- **SEO:** Structured data, Open Graph, sitemap
- **Accessibility:** ARIA labels, keyboard navigation

---

## 📬 Contact

Use the contact form or reach out via:
- [GitHub](https://github.com/Austinkuria)
- [LinkedIn](https://www.linkedin.com/in/austin-maina/)
- [Discord](https://discord.gg/austin.125)
- [Email](contact@austinmaina.vercel.app)

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.
