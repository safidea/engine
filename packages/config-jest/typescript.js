const base = require('./base.js')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...base,
  preset: 'ts-jest',
  testEnvironment: 'node',
}
