'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { personalInfo } from '@/config';

interface LogoProps {
  showText?: boolean;
}

export default function Logo({ showText = true }: LogoProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <Link href="/" className="flex items-center space-x-3 group mr-4">
      {!imageError ? (
        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-border/80 shadow-sm flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 bg-card/80 p-1">
          <Image
            src={personalInfo.logo}
            alt="AM LABS Logo"
            fill
            className="object-contain p-1"
            priority
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
          AM
        </div>
      )}
      
      {showText && (
        <div className="font-bold text-xl sm:text-2xl tracking-tight text-foreground flex items-center">
          <span>AM</span>
          <span className="ml-1.5 text-primary">LABS</span>
        </div>
      )}
    </Link>
  );
}
