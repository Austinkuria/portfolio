import { NextResponse } from 'next/server';
import { siteConfig } from '@/config';

export async function GET() {
    try {
        const baseUrl = siteConfig.url;
        const routes = ['', '/about', '/projects', '/skills', '/contact'];

        // Submit sitemap to Google (don't fail if this doesn't work)
        try {
            const sitemapResponse = await fetch(
                `https://www.google.com/ping?sitemap=${baseUrl}/sitemap.xml`,
                { method: 'GET', signal: AbortSignal.timeout(5000) } // 5 second timeout
            );

            if (!sitemapResponse.ok) {
                console.warn('Failed to ping Google, but continuing...');
            }
        } catch (googleError) {
            console.warn('Google ping failed, but continuing:', googleError instanceof Error ? googleError.message : 'Unknown error');
        }

        // Submit individual URLs to Bing (which tends to be more accepting of direct submissions)
        try {
            const bingUrls = routes.map(route => `${baseUrl}${route}`);
            const _bingSubmissions = await Promise.allSettled(
                bingUrls.map(url =>
                    fetch(`https://www.bing.com/ping?sitemap=${url}`, {
                        method: 'GET',
                        signal: AbortSignal.timeout(5000)
                    })
                )
            );
        } catch (bingError) {
            console.warn('Bing ping failed, but continuing:', bingError instanceof Error ? bingError.message : 'Unknown error');
        }

        return NextResponse.json({
            success: true,
            message: 'Sitemap notification attempted'
        });
    } catch (error) {
        console.error('Error in sitemap notification:', error);
        // Don't fail the build, just log the error
        return NextResponse.json(
            { success: false, message: 'Sitemap notification failed, but build continues' },
            { status: 200 } // Return 200 to not fail the build
        );
    }
}
