module.exports = (dir) => {
  /** @type {import('jest').Config} */
  const config = {
    collectCoverage: true,
    verbose: true,
    preset: 'ts-jest',
    maxWorkers: 4,
    testMatch: [`${dir}/__tests__/**/*.test.ts?(x)`],
    coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
  }

  const isClient = dir.includes('/client/')
  const isServer = dir.includes('/server/')

  if (isClient) {
    config.testEnvironment = 'jest-environment-jsdom'
    config.coverageDirectory = `${dir}/coverage/jsdom`
  }

  if (isServer) {
    config.testEnvironment = 'node'
    config.coverageDirectory = `${dir}/coverage/node`
  }

  return config
}
