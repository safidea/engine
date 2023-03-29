const base = require('config-jest/typescript.js')

module.exports = {
  ...base,
  globalSetup: './__tests__/setup-test.ts',
  testMatch: ['**/*.test.ts'],
}
