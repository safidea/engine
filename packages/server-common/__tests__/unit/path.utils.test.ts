import './setup'
import { PathUtils } from '../../src'

describe('getAppRoot', () => {
  it('should return root path with FDT_ROOT_PATH env', () => {
    process.env.APP_PATH = './test'
    const result = PathUtils.getAppRoot()
    expect(result.endsWith('/foundation/test')).toBe(true)
  })

  it('should return root path without FDT_ROOT_PATH env', () => {
    delete process.env.APP_PATH
    const result = PathUtils.getAppRoot()
    expect(result.endsWith('/foundation/app')).toBe(true)
  })
})

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

describe('getAppConfigCache', () => {
  it('should return config cache path', () => {
    const result = PathUtils.getAppConfigCache()
    expect(result.endsWith('foundation/app/build/server-common/config.cache.json')).toBe(true)
  })
})
