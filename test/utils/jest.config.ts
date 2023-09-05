import initConfig from '../../jest.config'

import type { Config } from 'jest'

const config: Config = {
  ...initConfig,
  testMatch: ['**/test/utils/test/**/*.test.ts?(x)'],
}

export default config
