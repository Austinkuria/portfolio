import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Add security headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

    // Add performance headers
    const pathname = request.nextUrl.pathname;

    // Cache static assets aggressively
    if (pathname.startsWith('/_next/static') || pathname.startsWith('/images')) {
        response.headers.set(
            'Cache-Control',
            'public, max-age=31536000, immutable'
        );
    }

    // Cache pages for a shorter duration
    if (!pathname.startsWith('/api')) {
        response.headers.set(
            'Cache-Control',
            'public, s-maxage=3600, stale-while-revalidate=86400'
        );
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes - handled separately)
         * - _next/webpack-hmr (dev hot reload)
         */
        '/((?!api/|_next/webpack-hmr).*)',
    ],
};
