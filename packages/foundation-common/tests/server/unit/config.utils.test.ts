import { TestSettings } from '@test/server'
import { ConfigUtils } from '@common/server'

describe('init config', () => {
  beforeAll(() => {
    TestSettings.clearEnv()
    ConfigUtils.clear()
  })

  it('file should not be found', () => {
    try {
      ConfigUtils.init()
    } catch (e: any) {
      expect(e.message).toContain('Config file not found')
    }
  })

  it('file should be invalid', () => {
    try {
      TestSettings.loadEnvFile('not-valid-json')
      ConfigUtils.init()
    } catch (e: any) {
      expect(e.message).toContain('Config file is not a valid JSON')
    }
  })

  it('file should be found', () => {
    TestSettings.loadEnvFile('base')
    const config = ConfigUtils.init()
    expect(config).toBeDefined()
  })
})

describe('get config', () => {
  beforeAll(() => {
    TestSettings.loadEnvFile('base')
    ConfigUtils.clear()
  })

  it('should return the whole config if not init', () => {
    const config = ConfigUtils.get()
    expect(config).toBeDefined()
  })

  it('should return a value', () => {
    const value = ConfigUtils.get('name')
    expect(value).toBe('test')
  })
})

describe('set config', () => {
  beforeAll(() => {
    TestSettings.loadEnvFile('base')
    ConfigUtils.clear()
  })

  it('should set a value', () => {
    ConfigUtils.set('name', 'test2')
    const value = ConfigUtils.get('name')
    expect(value).toBe('test2')
  })
})

describe('cache config', () => {
  beforeAll(() => {
    TestSettings.loadEnvFile('base')
    ConfigUtils.clear()
  })

  it('should cache the config', () => {
    ConfigUtils.cache()
    const config = ConfigUtils.get()
    expect(config).toBeDefined()
  })
})
