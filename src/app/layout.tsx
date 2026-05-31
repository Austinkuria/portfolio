import { Suspense } from 'react';
import { Providers } from './providers';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { siteConfig } from '@/config';

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
        <meta name="google-site-verification" content="MITiuqfxCk5vimfFWcFiLCrXRpRx99Py6WwGRjz0AvQ" />
        {/* Preconnect to critical domains - early */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Google Tag Manager - moved to afterInteractive for better performance */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P2G8NGPF');`}
        </Script>
        
        {/* Google Analytics 4 - Only load if ID is configured */}
        {siteConfig.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-script" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${siteConfig.googleAnalyticsId}', {
                  page_path: window.location.pathname,
                  send_page_view: true
                });
              `}
            </Script>
          </>
        )}

        {/* Tawk.to live chat widget (only when enabled) */}
        {siteConfig.enableLiveChat && (
          <Script id="tawk-to-script" strategy="afterInteractive">
            {`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
  try{
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/6a1c8399e717081c2b47ec3e/1jpvm44n7';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s1.onload = function(){
      console.debug('Tawk.to widget loaded');
    };
    s1.onerror = function(ev){
      console.warn('Tawk.to failed to load (network or server error)', ev && ev.type ? ev.type : ev);
      if (s1.parentNode) s1.parentNode.removeChild(s1);
    };
    s0.parentNode.insertBefore(s1,s0);
  } catch (e) {
    console.warn('Tawk.to embed failed to initialize', e);
  }
})();`}
          </Script>
        )}
        
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
          {/* Cookiebot removed - not needed for portfolio site */}
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