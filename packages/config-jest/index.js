module.exports = (dir) => {
  /** @type {import('jest').Config} */
  const config = {
    collectCoverage: true,
    verbose: true,
    preset: 'ts-jest',
    maxWorkers: 4,
    testMatch: ['<rootDir>/__tests__/**/*.test.ts?(x)'],
    coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/__tests__/', '<rootDir>/src/app.ts'],
    watchPathIgnorePatterns: ['<rootDir>/__tests__/', '<rootDir>/src/app.ts'],
    coverageDirectory: `${dir}/coverage`,
  }

  const isClient = dir.includes('packages/client')
  const isServer = dir.includes('packages/server')

  if (isClient) {
    config.testEnvironment = 'jest-environment-jsdom'
    config.setupFilesAfterEnv = ['@testing-library/jest-dom/extend-expect']
  }

  if (isServer) {
    config.testEnvironment = 'node'
  }

  return config
}
