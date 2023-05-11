import fs from 'fs-extra'
import PathUtils from '@common/server/utils/path.utils'

jest.mock('fs-extra')

beforeAll(() => {
  jest.clearAllMocks()
})

describe('getRoot', () => {
  it('should return root path with ROOT_PATH env', () => {
    process.env.ROOT_PATH = './test'
    const result = PathUtils.getRoot()
    expect(result.endsWith('/foundation/test')).toBe(true)
  })

  it('should return root path without ROOT_PATH env', () => {
    delete process.env.ROOT_PATH
    const result = PathUtils.getRoot()
    expect(result.endsWith('/foundation/')).toBe(true)
  })
})

describe('getDataFolder', () => {
  it('should return data folder path with DATA_FOLDER_PATH env', () => {
    process.env.DATA_FOLDER_PATH = './test'
    const result = PathUtils.getDataFolder()
    expect(result.endsWith('foundation/test')).toBe(true)
    expect(fs.ensureDirSync).toHaveBeenCalledWith(expect.any(String))
  })

  it('should return data folder path without DATA_FOLDER_PATH env', () => {
    delete process.env.DATA_FOLDER_PATH
    const result = PathUtils.getDataFolder()
    expect(result.endsWith('foundation/data')).toBe(true)
  })
})

describe('getJsFolder', () => {
  it('should return js folder path', () => {
    const result = PathUtils.getJsFolder()
    expect(result.endsWith('foundation/js')).toBe(true)
    expect(fs.ensureDirSync).toHaveBeenCalledWith(expect.any(String))
  })
})

describe('getConfigsFolder', () => {
  it('should return configs folder path', () => {
    const result = PathUtils.getConfigsFolder('common')
    expect(result.endsWith('foundation-common/src/server/configs')).toBe(true)
  })
})

describe('getConfigFile', () => {
  it('should return config file path with CONFIG_FILE_PATH env', () => {
    process.env.CONFIG_FILE_PATH = './test/config.json'
    const result = PathUtils.getConfigFile()
    expect(result.endsWith('foundation/test/config.json')).toBe(true)
    expect(fs.pathExistsSync).toHaveBeenCalledWith(expect.any(String))
  })

  it('should return config file path without CONFIG_FILE_PATH env', () => {
    delete process.env.CONFIG_FILE_PATH
    const result = PathUtils.getConfigFile()
    expect(result.endsWith('foundation/config.json')).toBe(true)
  })

  it('should throw error if config file not found', () => {
    const pathExistsSync = fs.pathExistsSync as jest.MockedFunction<typeof fs.pathExistsSync>
    pathExistsSync.mockReturnValueOnce(false)
    expect(() => PathUtils.getConfigFile()).toThrowError('Config file not found')
  })
})

describe('getConfigCache', () => {
  it('should return config cache path', () => {
    const result = PathUtils.getConfigCache()
    expect(result.endsWith('foundation/data/config.cache.json')).toBe(true)
    expect(fs.ensureFileSync).toHaveBeenCalledWith(expect.any(String))
  })
})

describe('getCommonAppsFolder', () => {
  it('should return common apps folder path', () => {
    const result = PathUtils.getCommonAppsFolder()
    expect(result.endsWith('foundation-common/src/server/apps')).toBe(true)
  })
})
