import { headers } from 'next/headers';
import { usePathname } from 'next/navigation';

export default function CanonicalURL() {
    const pathname = usePathname();
    const headersList = headers();
    const domain = 'https://austinmaina.vercel.app';
    const pathname = headersList.get('x-pathname') || '/';
    const canonicalURL = `${domain}${pathname}`;

    return <link rel="canonical" href={canonicalURL} />;
}
