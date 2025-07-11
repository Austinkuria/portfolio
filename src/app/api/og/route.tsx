import { ImageResponse } from 'next/og';
import { personalInfo } from '@/config';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get parameters
    const title = searchParams.get('title') || personalInfo.name.full;
    const description = searchParams.get('description') || personalInfo.tagline;
    
    // Use a font that's available in the edge runtime
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              margin: '40px',
              padding: '60px',
              borderRadius: '20px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '90%',
              maxWidth: '1000px',
            }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '60px',
                backgroundColor: '#667eea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '30px',
                color: 'white',
                fontSize: '48px',
                fontWeight: 'bold',
              }}
            >
              {personalInfo.initials}
            </div>
            <div
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '20px',
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '32px',
                color: '#666',
                marginBottom: '20px',
                lineHeight: 1.3,
              }}
            >
              {description}
            </div>
            <div
              style={{
                fontSize: '24px',
                color: '#667eea',
                fontWeight: '500',
              }}
            >
              {personalInfo.title} • {personalInfo.location}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: unknown) {
    console.log(`${e instanceof Error ? e.message : 'Unknown error'}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
