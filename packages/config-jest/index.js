module.exports = (dir) => {
  /** @type {import('jest').Config} */
  const config = {
    collectCoverage: true,
    verbose: true,
    preset: 'ts-jest',
    maxWorkers: 4,
    testMatch: ['<rootDir>/__tests__/**/*.test.ts?(x)'],
    coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
  }

  const isClient = dir.includes('packages/client')
  const isServer = dir.includes('packages/server')

  if (isClient) {
    config.testEnvironment = 'jest-environment-jsdom'
    config.coverageDirectory = `${dir}/coverage/jsdom`
    config.setupFilesAfterEnv = ['@testing-library/jest-dom/extend-expect']
  }

  if (isServer) {
    config.testEnvironment = 'node'
    config.coverageDirectory = `${dir}/coverage/node`
  }

  return config
}
