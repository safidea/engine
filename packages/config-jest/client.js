const base = require('./base.js')

module.exports = {
  ...base,
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/client/**/*.test.ts',
    '**/shared/**/*.test.ts',
    '**/client/**/*.test.tsx',
    '**/shared/**/*.test.tsx',
  ],
  coverageDirectory: 'coverage/jsdom',
}
