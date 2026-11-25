/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
    outputFileTracingIncludes: {
      '/api/**/*': ['./prisma/**/*', './node_modules/.prisma/client/**/*'],
      '/**/*': ['./prisma/**/*', './node_modules/.prisma/client/**/*']
    }
  }
};

export default nextConfig;
