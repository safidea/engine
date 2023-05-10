import base from '../base'

import type { Config } from 'jest'

const serverConfig: Config = {
  ...base,
  testEnvironment: 'node',
  testMatch: ['**/server/**/*.test.ts', '**/shared/**/*.test.ts'],
  coverageDirectory: 'coverage/node',
}

export default serverConfig
