import { TestSettings } from '@test/server'
import { DatabaseConfig } from '@database/config'
import { ConfigUtils } from '@common/server'

import type { DatabasesInterface } from '@database'

describe('config.validate', () => {
  it('should invalidate the config with not valid schema', () => {
    TestSettings.loadEnvFile('not-valid-schema')
    try {
      ConfigUtils.init()
      DatabaseConfig.validate()
    } catch (error: any) {
      expect(error.message).toContain("- master must have required property 'url'")
    }
  })

  it('should validate the config', () => {
    TestSettings.loadEnvFile('base')
    const config = ConfigUtils.init()
    DatabaseConfig.validate()
    const databases = ConfigUtils.get('databases') as DatabasesInterface
    expect(config.databases).toEqual(databases)
  })

  it('should load default config if no config', () => {
    TestSettings.loadEnvFile('no-config')
    ConfigUtils.init()
    DatabaseConfig.enrich()
    const databases = ConfigUtils.get('databases') as DatabasesInterface
    expect(databases.master).toBeDefined()
  })
})
