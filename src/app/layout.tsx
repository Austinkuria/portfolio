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
import StructuredData from '@/components/StructuredData';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager - moved to afterInteractive for better performance */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P2G8NGPF');`}
        </Script>

        {/* Preload important routes with higher priority */}
        <link rel="preload" as="fetch" href="/about" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/projects" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/skills" crossOrigin="anonymous" />
        
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" crossOrigin="anonymous" />
        
        {/* Humans.txt link */}
        <link rel="author" href="/humans.txt" />
        
        {/* Improved chunk loading error detection */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('error', function(e) {
              if ((e.error && e.error.name === 'ChunkLoadError') || 
                  (e.target && e.target.src && e.target.src.includes('/_next/'))) {
                console.error('Chunk loading error detected:', e);
                // Emit a custom event to notify our error handler component
                window.dispatchEvent(new CustomEvent('chunkError'));
              }
            }, true);
          `
        }} />
        <link rel="icon" href="/images/am-logo.jpg" type="image/jpeg" />
        <StructuredData />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-P2G8NGPF"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>        <Providers>
          <Header />
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          <Footer />
        </Providers>
        {/* Moved analytics to the end for better performance */}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
