const base = require('./base.js')

module.exports = {
  ...base,
  testEnvironment: 'node',
  testMatch: ['**/server/**/*.test.ts', '**/shared/**/*.test.ts'],
  coverageDirectory: 'coverage/node',
}
