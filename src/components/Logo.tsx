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
    <Link href="/" className="flex items-center group mr-4">
      {!imageError ? (
        <div className="relative w-10 h-10 mr-2 overflow-hidden rounded-md bg-primary/10 flex items-center justify-center">
          <Image
            src={personalInfo.logo}
            alt={`${personalInfo.name.full} Logo`}
            fill
            className="object-cover rounded-md"
            priority
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="w-10 h-10 mr-2 rounded-md bg-primary/10 flex items-center justify-center text-primary font-bold">
          AM
        </div>
      )}
      
      {showText && (
        <div className="font-bold text-2xl text-foreground relative">
          {personalInfo.name.first}<span className="text-primary">{personalInfo.name.last}</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
        </div>
      )}
    </Link>
  );
}
