const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

module.exports = async () => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
      staticFolder: 'custom-public',
    },
    distDir: `.next/${process.env.FDT_APP_NAME ?? 'default'}`,
    transpilePackages: [
      'server-table',
      'server-database',
      'server-common',
      'server-page',
      'server-component',
      'client-page',
      'client-component',
    ],
    images: {
      dangerouslyAllowSVG: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'tailwindui.com',
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
      ],
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.plugins = [...config.plugins, new PrismaPlugin()]
      }
      return config
    },
  }

  return nextConfig
}
