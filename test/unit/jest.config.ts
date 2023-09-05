import initConfig from '../../jest.config'

import type { Config } from 'jest'

const config: Config = {
  ...initConfig,
  globalTeardown: '<rootDir>/../utils/teardown.ts',
  testMatch: ['**/test/unit/**/*.test.ts?(x)'],
}

export default config
