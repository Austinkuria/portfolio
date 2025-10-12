'use client';
import { ThemeProvider } from 'next-themes';
import { LazyMotion, domAnimation } from 'framer-motion';
import { ReCaptchaProvider } from 'next-recaptcha-v3';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        useEnterprise={false}
      >
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
      </ReCaptchaProvider>
    </ThemeProvider>
  );
}