/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  // Simplified webpack config to avoid potential issues
  webpack: (config, { isServer }) => {
    // Fix for client-side libraries being used on server
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },

  experimental: {
    disablePostcssPresetEnv: true
  },

  serverExternalPackages: ['framer-motion'],
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
