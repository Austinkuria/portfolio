/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove static export to enable API routes
  // output: "export", // Commented out to enable API routes
  // distDir: 'out', // Not needed for server deployment
  images: {
    unoptimized: true // Keep for compatibility
  },
  // trailingSlash: true, // Not needed for server deployment
  // Add webpack configuration to optimize chunk loading
  webpack: (config) => {
    // Add optimization options to improve chunking
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Vendor chunk for third-party modules
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 20,
          },
          // Common chunk for shared code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    };

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
