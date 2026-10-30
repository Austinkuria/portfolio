/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1920px",
            },
        },
        screens: {
            '2xs': '320px',
            'xs': '475px',
            'sm': '640px',
            'md': '768px',
            'md-sm': '850px',
            'lg': '1024px',
            'xl': '1280px',
            'xl-lg': '1440px',
            '2xl': '1536px',
            '2xl-md': '1680px',
            '2xl-lg': '1920px',
            '3xl': '2560px',
        },
        extend: {
            backgroundSize: {
                '300%': '300%',
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // AMLABS Brand Colors
                brand: {
                    blue: "#2563EB",
                    navy: "#0F172A",
                    sky: "#60A5FA",
                    mist: "#BFDBFE",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: [
                    'var(--font-poppins)',
                    'Poppins',
                    'Arial',
                    'sans-serif'
                ],
                heading: [
                    'var(--font-poppins)',
                    'Poppins',
                    'Arial Bold',
                    'Arial',
                    'sans-serif'
                ],
                mono: [
                    'var(--font-jetbrains-mono)',
                    'JetBrains Mono',
                    'monospace'
                ]
            },
            keyframes: {
                gradient: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'gradient': 'gradient 8s linear infinite',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
