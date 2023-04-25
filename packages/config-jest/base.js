/** @type {import('jest').Config} */
/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  collectCoverage: true,
  verbose: true,
  preset: 'ts-jest',
  rootDir: '../../',
  maxWorkers: 4
}

module.exports = jestConfig
