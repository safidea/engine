const base = require('config-jest/typescript.js')

module.exports = {
  ...base,
  globalSetup: './__tests__/setup.ts',
  testMatch: ['**/*.test.ts'],
}