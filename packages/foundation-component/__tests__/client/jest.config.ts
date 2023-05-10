import client from 'config-jest/client'
import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from '../../tsconfig.json'

import type { Config } from 'jest'

const config: Config = {
  ...client,
  setupFilesAfterEnv: ['<rootDir>/__tests__/client/jest.setup.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
}

export default config
