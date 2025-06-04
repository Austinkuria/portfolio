import { Suspense } from 'react';
import { Providers } from './providers';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload important routes */}
        <link rel="preload" as="fetch" href="/about" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/projects" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/skills" crossOrigin="anonymous" />
        
        {/* Preload critical resources for faster page loads */}
        <link rel="preload" href="/_next/static/chunks/main.js" as="script" />
        <link rel="preload" href="/_next/static/chunks/webpack.js" as="script" />
        <link rel="preload" href="/_next/static/chunks/pages/_app.js" as="script" />
        
        {/* Script for chunk error detection */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Initialize a flag to track reload attempts
            if (!window.__chunksLoadAttempts) {
              window.__chunksLoadAttempts = 0;
            }
            
            // Handle chunk loading errors
            window.addEventListener('error', function(e) {
              if (e.error && e.error.name === 'ChunkLoadError' || 
                  (e.target && e.target.src && e.target.src.includes('/_next/'))) {
                console.error('Chunk loading error detected:', e);
                
                // Limit reload attempts to avoid infinite loops
                if (window.__chunksLoadAttempts < 3) {
                  window.__chunksLoadAttempts++;
                  console.log('Reloading page, attempt:', window.__chunksLoadAttempts);
                  setTimeout(() => window.location.reload(), 500);
                }
                e.preventDefault();
                return true;
              }
              return false;
            }, true);
          `
        }} />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>
          <Header />
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}