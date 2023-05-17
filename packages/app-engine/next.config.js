const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

module.exports = async () => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
      staticFolder: 'custom-public',
    },
    distDir: `.next/${process.env.APP_NAME || 'app'}`,
    transpilePackages: [
      'server-table',
      'server-database',
      'server-common',
      'server-page',
      'client-page',
    ],
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.plugins.push(new PrismaPlugin())
      }
      return config
    },
  }

  return nextConfig
}
