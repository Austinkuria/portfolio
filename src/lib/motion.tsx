'use client';

import dynamic from 'next/dynamic';

// For SSR safety, we'll provide fallbacks
export const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), { 
  ssr: false,
  loading: () => <div />
});
export const MotionArticle = dynamic(() => import('framer-motion').then((mod) => mod.motion.article), { 
  ssr: false,
  loading: () => <article />
});
export const MotionButton = dynamic(() => import('framer-motion').then((mod) => mod.motion.button), { 
  ssr: false,
  loading: () => <button />
});
export const MotionHeader = dynamic(() => import('framer-motion').then((mod) => mod.motion.header), { 
  ssr: false,
  loading: () => <header />
});
export const MotionSection = dynamic(() => import('framer-motion').then((mod) => mod.motion.section), { 
  ssr: false,
  loading: () => <section />
});
export const MotionSpan = dynamic(() => import('framer-motion').then((mod) => mod.motion.span), { 
  ssr: false,
  loading: () => <span />
});
export const MotionP = dynamic(() => import('framer-motion').then((mod) => mod.motion.p), { 
  ssr: false,
  loading: () => <p />
});
export const MotionUl = dynamic(() => import('framer-motion').then((mod) => mod.motion.ul), { 
  ssr: false,
  loading: () => <ul />
});
export const MotionLi = dynamic(() => import('framer-motion').then((mod) => mod.motion.li), { 
  ssr: false,
  loading: () => <li />
});
export const MotionH1 = dynamic(() => import('framer-motion').then((mod) => mod.motion.h1), { 
  ssr: false,
  loading: () => <h1 />
});
export const MotionH2 = dynamic(() => import('framer-motion').then((mod) => mod.motion.h2), { 
  ssr: false,
  loading: () => <h2 />
});
export const MotionH3 = dynamic(() => import('framer-motion').then((mod) => mod.motion.h3), { 
  ssr: false,
  loading: () => <h3 />
});
export const MotionForm = dynamic(() => import('framer-motion').then((mod) => mod.motion.form), { 
  ssr: false,
  loading: () => <form />
});