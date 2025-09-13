import React from 'react';

export const FontPreloader = React.memo(() => (
  <>
    <link
      rel="preload"
      href="/fonts/geist-sans.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />
    <link
      rel="preload"
      href="/fonts/geist-mono.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />
  </>
));

FontPreloader.displayName = 'FontPreloader';

export const FontDisplayStyles = React.memo(() => (
  <style>{`
    .font-sans {
      font-family: var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
      font-display: swap;
    }
    .font-mono {
      font-family: var(--font-geist-mono), ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
      font-display: swap;
    }
  `}</style>
));

FontDisplayStyles.displayName = 'FontDisplayStyles';