/** @type {import('jest').Config} */
const jestConfig = {
  collectCoverage: true,
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts'],
}

module.exports = jestConfig
