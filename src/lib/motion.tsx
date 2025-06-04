'use client';

import dynamic from 'next/dynamic';

export const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.m.div), { ssr: false });
export const MotionArticle = dynamic(() => import('framer-motion').then((mod) => mod.m.article), { ssr: false });
export const MotionButton = dynamic(() => import('framer-motion').then((mod) => mod.m.button), { ssr: false });
export const MotionHeader = dynamic(() => import('framer-motion').then((mod) => mod.m.header), { ssr: false });
export const MotionSection = dynamic(() => import('framer-motion').then((mod) => mod.m.section), { ssr: false });
export const MotionSpan = dynamic(() => import('framer-motion').then((mod) => mod.m.span), { ssr: false });
export const MotionP = dynamic(() => import('framer-motion').then((mod) => mod.m.p), { ssr: false });
export const MotionUl = dynamic(() => import('framer-motion').then((mod) => mod.m.ul), { ssr: false });
export const MotionLi = dynamic(() => import('framer-motion').then((mod) => mod.m.li), { ssr: false });
export const MotionH1 = dynamic(() => import('framer-motion').then((mod) => mod.m.h1), { ssr: false });
export const MotionH2 = dynamic(() => import('framer-motion').then((mod) => mod.m.h2), { ssr: false });
export const MotionH3 = dynamic(() => import('framer-motion').then((mod) => mod.m.h3), { ssr: false });