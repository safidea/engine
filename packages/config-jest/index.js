module.exports = (dir, custom) => {
  /** @type {import('jest').Config} */
  const config = {
    collectCoverage: true,
    verbose: true,
    preset: 'ts-jest',
    maxWorkers: 4,
    testMatch: ['<rootDir>/(__tests__|spec)/**/*.(test|spec).ts?(x)'],
    coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/(__tests__|spec)/'],
    watchPathIgnorePatterns: ['<rootDir>/(__tests__|spec)/'],
    coverageDirectory: `${dir}/coverage`,
  }

  const isClient = /packages\/[a-z\-]*client[a-z\-]*/.test(dir)
  const isServer = /packages\/[a-z\-]*server[a-z\-]*/.test(dir)

  if (isClient) {
    config.testEnvironment = 'jest-environment-jsdom'
    config.setupFilesAfterEnv = ['@testing-library/jest-dom/extend-expect']
  }

  if (isServer) {
    config.testEnvironment = 'node'
  }

  return { ...config, ...custom }
}
