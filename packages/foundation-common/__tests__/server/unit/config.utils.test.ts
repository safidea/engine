import fs from 'fs-extra'
import ConfigUtils from '@common/server/utils/config.utils'

jest.mock('fs-extra')

beforeAll(() => {
  jest.clearAllMocks()
})

describe('init', () => {
  it('should throw error if config file is not a valid JSON', () => {
    const readJsonSync = fs.readJsonSync as jest.MockedFunction<typeof fs.readJsonSync>
    readJsonSync.mockReturnValueOnce(null)
    expect(() => ConfigUtils.init()).toThrowError('Config file is not a valid JSON')
  })

  it('should init config', () => {
    const result = ConfigUtils.init()
    expect(result).toEqual({ test: true })
  })
})

describe('get', () => {
  it('should return config', () => {
    const result = ConfigUtils.get()
    expect(result).toEqual({ test: true })
  })

  it('should return config by path', () => {
    const result = ConfigUtils.get('test')
    expect(result).toBe(true)
  })
})

describe('set', () => {
  it('should set config', () => {
    const result = ConfigUtils.set('test', false)
    expect(result).toEqual({ test: false })
  })
})

describe('cache', () => {
  it('should cache config', () => {
    ConfigUtils.init()
    ConfigUtils.cache()
    expect(fs.writeJsonSync).toHaveBeenCalledWith(expect.any(String), { test: true }, { spaces: 2 })
  })
})

describe('getAppName', () => {
  it('should throw error if app name is not set', () => {
    expect(() => ConfigUtils.getAppName()).toThrowError('APP_NAME is not set')
  })

  it('should return app name', () => {
    process.env.APP_NAME = 'test'
    const result = ConfigUtils.getAppName()
    expect(result).toBe('test')
  })
})
