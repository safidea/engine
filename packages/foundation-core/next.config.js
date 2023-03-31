const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

module.exports = (phase, { defaultConfig }) => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    transpilePackages: [
      'foundation-table',
      'foundation-auth',
      'foundation-database',
      'foundation-common',
      'foundation-common',
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
