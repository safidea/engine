const base = require('./base.js')

module.exports = {
  ...base,
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/client/**/*.test.ts', '**/shared/**/*.test.ts'],
  coverageDirectory: 'coverage/jsdom',
}
