const config = require('config-jest')

module.exports = config(__dirname, {
  collectCoverage: false,
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/(__tests__|spec)/'],
})
