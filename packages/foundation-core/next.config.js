const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

module.exports = async () => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['foundation-table', 'foundation-database', 'foundation-common'],
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.plugins.push(new PrismaPlugin())
      }
      return config
    },
  }

  return nextConfig
}
