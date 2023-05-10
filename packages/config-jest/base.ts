import type { Config } from 'jest'

const baseConfig: Config = {
  collectCoverage: true,
  verbose: true,
  preset: 'ts-jest',
  rootDir: '../../',
  maxWorkers: 4,
}

export default baseConfig
