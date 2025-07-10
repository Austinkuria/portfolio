'use client';

import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config';

export default function CanonicalURL() {
    const pathname = usePathname();
    const canonicalURL = `${siteConfig.url}${pathname}`;

    return <link rel="canonical" href={canonicalURL} />;
}
