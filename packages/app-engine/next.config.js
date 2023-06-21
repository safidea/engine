const { PORT } = process.env

module.exports = async () => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    distDir: '.next/' + (PORT ?? 3000),
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
  }

  return nextConfig
}
