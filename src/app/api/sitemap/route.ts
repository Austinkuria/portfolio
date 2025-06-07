import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const baseUrl = 'https://austinmaina.vercel.app';
        const routes = ['', '/about', '/projects', '/skills', '/blog', '/contact'];

        // Submit sitemap to Google
        const sitemapResponse = await fetch(
            `https://www.google.com/ping?sitemap=${baseUrl}/sitemap.xml`,
            { method: 'GET' }
        );

        // Submit individual URLs to Bing (which tends to be more accepting of direct submissions)
        const bingUrls = routes.map(route => `${baseUrl}${route}`);
        const bingSubmissions = await Promise.all(
            bingUrls.map(url =>
                fetch(`https://www.bing.com/ping?sitemap=${url}`, { method: 'GET' })
            )
        );

        if (!response.ok) {
            throw new Error('Failed to ping Google');
        }

        return NextResponse.json({
            success: true,
            message: 'Sitemap submitted successfully'
        });
    } catch (error) {
        console.error('Error submitting sitemap:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to submit sitemap' },
            { status: 500 }
        );
    }
}
