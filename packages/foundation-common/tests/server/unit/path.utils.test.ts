import { PathUtils } from '@common/server'

describe('get root path', () => {
  it('should return root path on dev env', () => {
    delete process.env.NEXT_BUILD
    expect(PathUtils.getRoot()).toBeDefined()
  })

  it('should return root path on prod env', () => {
    process.env.NEXT_BUILD = 'true'
    expect(PathUtils.getRoot()).toBeDefined()
  })
})

describe('get data folder path', () => {
  it('should return data folder path by default', () => {
    delete process.env.DATA_FOLDER_PATH
    expect(PathUtils.getDataFolder()).toBeDefined()
  })

  it('should return data folder path from env', () => {
    process.env.DATA_FOLDER_PATH = 'true'
    expect(PathUtils.getDataFolder()).toBeDefined()
  })
})

describe('get config file path', () => {
  it('should thow an error if there is no config file', () => {
    delete process.env.CONFIG_FILE_PATH
    expect(() => PathUtils.getConfigFile()).toThrow('Config file not found')
  })

  it('should return config file path from env', () => {
    process.env.CONFIG_FILE_PATH = 'true'
    expect(PathUtils.getConfigFile()).toBeDefined()
  })
})

describe('get config cache path', () => {
  it('should return config cache path', () => {
    expect(PathUtils.getConfigCache()).toBeDefined()
  })
})
