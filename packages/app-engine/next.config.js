const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

if (!process.env.FDT_APP_NAME) {
  throw new Error('FDT_APP_NAME is not defined')
}

module.exports = async () => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
      staticFolder: 'custom-public',
    },
    distDir: `.next/${process.env.FDT_APP_NAME}`,
    transpilePackages: [
      'server-table',
      'server-database',
      'server-common',
      'server-page',
      'client-page',
    ],
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.plugins = [...config.plugins, new PrismaPlugin()]
      }
      return config
    },
  }

  return nextConfig
}
