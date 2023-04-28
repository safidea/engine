import { TestSettings } from '@test/server'
import { PathUtils } from '@common/server'

describe('get root path', () => {
  it('should return root path by default', () => {
    delete process.env.ROOT_PATH
    expect(PathUtils.getRoot()).toBeDefined()
  })

  it('should return root path from env', () => {
    TestSettings.loadEnvFile('base')
    expect(PathUtils.getRoot()).toBeDefined()
  })
})

describe('get data folder path', () => {
  it('should return data folder path', () => {
    TestSettings.loadEnvFile('base')
    expect(PathUtils.getDataFolder()).toBeDefined()
  })
})

describe('get js folder path', () => {
  it('should return js folder path', () => {
    expect(PathUtils.getJsFolder('common')).toBeDefined()
  })
})

describe('get config file path', () => {
  it('should throw an error if there is no config file', () => {
    TestSettings.loadEnvFile('no-config-file')
    expect(() => PathUtils.getConfigFile()).toThrowError()
  })

  it('should return config file path', () => {
    TestSettings.loadEnvFile('base')
    expect(PathUtils.getConfigFile()).toBeDefined()
  })
})

describe('get config cache path', () => {
  it('should return config cache path', () => {
    expect(PathUtils.getConfigCache()).toBeDefined()
  })
})
