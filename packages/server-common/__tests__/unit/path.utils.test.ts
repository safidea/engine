import './setup'
import fs from 'fs-extra'
import { PathUtils } from '../../src'

describe('getAppRoot', () => {
  it('should return root path with FDT_ROOT_PATH env', () => {
    process.env.FDT_ROOT_PATH = './test'
    const result = PathUtils.getAppRoot()
    expect(result.endsWith('/foundation/test')).toBe(true)
  })

  it('should return root path without FDT_ROOT_PATH env', () => {
    delete process.env.FDT_ROOT_PATH
    const result = PathUtils.getAppRoot()
    expect(result.endsWith('/foundation/')).toBe(true)
  })
})

describe('getAppDataFolder', () => {
  it('should return data folder path', () => {
    const result = PathUtils.getAppDataFolder()
    expect(result.endsWith('foundation/data')).toBe(true)
  })
})

describe('getAppJsFolder', () => {
  it('should return js folder path', () => {
    const result = PathUtils.getAppJsFolder()
    expect(result.endsWith('foundation/js')).toBe(true)
    expect(fs.ensureDirSync).toHaveBeenCalledWith(expect.any(String))
  })
})

describe('getPackageConfigsFolder', () => {
  it('should return configs folder path', () => {
    const result = PathUtils.getPackageConfigsFolder('server-common')
    expect(result.endsWith('server-common/src/configs')).toBe(true)
  })
})

describe('getAppConfigFile', () => {
  it('should return config file path', () => {
    const result = PathUtils.getAppConfigFile()
    expect(result.endsWith('foundation/config.json')).toBe(true)
  })

  it('should throw error if config file not found', () => {
    const pathExistsSync = fs.pathExistsSync as jest.MockedFunction<typeof fs.pathExistsSync>
    pathExistsSync.mockReturnValueOnce(false)
    expect(() => PathUtils.getAppConfigFile()).toThrowError('Config file not found')
  })
})

describe('getAppConfigCache', () => {
  it('should return config cache path', () => {
    const result = PathUtils.getAppConfigCache()
    expect(result.endsWith('foundation/data/config.cache.json')).toBe(true)
  })
})

describe('getPackageAppsFolder', () => {
  it('should return common apps folder path', () => {
    const result = PathUtils.getPackageAppsFolder('server-common')
    expect(result.endsWith('server-common/src/apps')).toBe(true)
  })
})
