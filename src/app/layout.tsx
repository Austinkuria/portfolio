import { Suspense } from 'react';
import { Providers } from './providers';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';
import { FontPreloader, FontDisplayStyles } from '@/components/FontOptimization';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Font optimization */}
        <FontPreloader />
        <FontDisplayStyles />
        
        {/* Preconnect to critical domains early */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical routes */}
        <link rel="prefetch" href="/about" />
        <link rel="prefetch" href="/projects" />
        <link rel="prefetch" href="/skills" />
        
        {/* Preload critical images */}
        <link rel="preload" as="image" href="/images/optimized/clinique-beauty.webp" />
        <link rel="preload" as="image" href="/images/optimized/attendance-system.webp" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//vitals.vercel-insights.com" />
        
        {/* Resource hints for better performance */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Favicon with proper sizes */}
        <link rel="icon" href="/images/am-logo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/images/am-logo.jpg" />
        
        {/* Improved chunk loading error detection */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('error', function(e) {
              if ((e.error && e.error.name === 'ChunkLoadError') || 
                  (e.target && e.target.src && e.target.src.includes('/_next/'))) {
                console.warn('Chunk loading error detected, reloading page');
                window.location.reload();
              }
            }, true);
          `
        }} />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-P2G8NGPF"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        <Providers>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          }>
            <Header />
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            <Footer />
          </Suspense>
        </Providers>
        
        {/* Load analytics and tracking after main content */}
        <SpeedInsights />
        <Analytics />
        
        {/* Google Tag Manager - load after interactive */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P2G8NGPF');`}
        </Script>
      </body>
    </html>
  );
}
