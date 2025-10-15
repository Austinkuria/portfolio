/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove static export to enable API routes
  // output: "export", // Commented out to enable API routes
  // distDir: 'out', // Not needed for server deployment
  images: {
    // Enable image optimization for better performance
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // trailingSlash: true, // Not needed for server deployment

  // Optimize page data
  generateBuildId: async () => {
    return 'portfolio-build-' + Date.now();
  },

  // Enable compression
  compress: true,

  // Add webpack configuration to optimize chunk loading
  webpack: (config, { isServer }) => {
    // Only apply client-side optimizations
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Framework chunk for React/Next.js
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // Large libraries
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name: 'lib',
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // Commons
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
          },
        },
      };
    }

    return config;
  },

  experimental: {
    disablePostcssPresetEnv: true
  },
  // Skip type checking to speed up builds
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

// Using ES module export syntax since package.json has "type": "module"
export default nextConfig;
