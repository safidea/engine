const base = require('config-jest/typescript.js')

module.exports = {
  ...base,
  globalSetup: './src/scripts/table.setup.ts',
  testMatch: ['**/*.test.ts'],
}
