import base from '../base'

import type { Config } from 'jest'

const clientConfig: Config = {
  ...base,
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/client/**/*.test.ts',
    '**/shared/**/*.test.ts',
    '**/client/**/*.test.tsx',
    '**/shared/**/*.test.tsx',
  ],
  coverageDirectory: 'coverage/jsdom',
}

export default clientConfig
