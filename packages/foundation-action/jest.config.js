const base = require('config-jest/typescript.js')

module.exports = {
  ...base,
  coveragePathIgnorePatterns: ['/generated/'],
}
