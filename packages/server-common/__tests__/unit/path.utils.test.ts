import './setup'
import { PathUtils } from '../../src'

describe('getAppEnvFile', () => {
  it('should return env file path', () => {
    const result = PathUtils.getAppEnvFile()
    expect(result.endsWith('foundation/app/.env')).toBe(true)
  })
})

describe('getAppConfigFile', () => {
  it('should return config file path', () => {
    const result = PathUtils.getAppConfigFile()
    expect(result.endsWith('foundation/app/config.json')).toBe(true)
  })
})

describe('getCompiledAppConfig', () => {
  it('should return config cache path', () => {
    const result = PathUtils.getCompiledAppConfig()
    expect(result.endsWith('foundation/app/build/server-common/config.cache.json')).toBe(true)
  })
})
