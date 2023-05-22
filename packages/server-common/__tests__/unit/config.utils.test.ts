import './setup'
import fs from 'fs-extra'
import { ConfigUtils } from '../../src'

import type { ConfigInterface } from '../../src'

describe('init', () => {
  it('should throw error if config file is not a valid JSON', () => {
    const readJsonSync = fs.readJsonSync as jest.MockedFunction<typeof fs.readJsonSync>
    readJsonSync.mockReturnValueOnce(null)
    expect(() => ConfigUtils.init()).toThrowError('Config file is not a valid JSON')
  })

  it('should init config with env vars', () => {
    process.env.FDT_APP_VERSION = '1.0.0'
    const readJsonSync = fs.readJsonSync as jest.MockedFunction<typeof fs.readJsonSync>
    readJsonSync.mockReturnValueOnce({ version: '${FDT_APP_VERSION}' })
    const result = ConfigUtils.init()
    expect(result).toEqual({ version: '1.0.0' })
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
    expect(fs.ensureFileSync).toHaveBeenCalledWith(expect.any(String))
    expect(fs.writeJsonSync).toHaveBeenCalledWith(expect.any(String), { test: true }, { spaces: 2 })
  })
})

describe('exec', () => {
  it('should exec config', () => {
    jest.spyOn(ConfigUtils, 'init')
    jest.spyOn(ConfigUtils, 'cache')
    const config: ConfigInterface = {
      enrich: jest.fn(),
      validate: jest.fn(),
      lib: jest.fn(),
      js: jest.fn(),
    }
    ConfigUtils.exec([config])
    expect(ConfigUtils.init).toHaveBeenCalled()
    expect(config.enrich).toHaveBeenCalled()
    expect(config.validate).toHaveBeenCalled()
    expect(config.lib).toHaveBeenCalled()
    expect(config.js).toHaveBeenCalled()
    expect(ConfigUtils.cache).toHaveBeenCalled()
  })
})
