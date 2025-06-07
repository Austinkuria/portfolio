'use client';

import { usePathname } from 'next/navigation';

export default function CanonicalURL() {
    const pathname = usePathname();
    const domain = 'https://austinmaina.vercel.app';
    const canonicalURL = `${domain}${pathname}`;

    return <link rel="canonical" href={canonicalURL} />;
}
