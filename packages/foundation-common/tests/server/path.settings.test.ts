import { PathSettings } from '@server'

describe('get root path', () => {
  it('should return root path on dev env', () => {
    delete process.env.NEXT_BUILD
    expect(PathSettings.getRoot()).toBeDefined()
  })

  it('should return root path on prod env', () => {
    process.env.NEXT_BUILD = 'true'
    expect(PathSettings.getRoot()).toBeDefined()
  })
})

describe('get data folder path', () => {
  it('should return data folder path by default', () => {
    delete process.env.DATA_FOLDER_PATH
    expect(PathSettings.getDataFolder()).toBeDefined()
  })

  it('should return data folder path from env', () => {
    process.env.DATA_FOLDER_PATH = 'true'
    expect(PathSettings.getDataFolder()).toBeDefined()
  })
})

describe('get config file path', () => {
  it('should return config file path by default', () => {
    delete process.env.CONFIG_FILE_PATH
    expect(PathSettings.getConfigFile()).toBeDefined()
  })

  it('should return config file path from env', () => {
    process.env.CONFIG_FILE_PATH = 'true'
    expect(PathSettings.getConfigFile()).toBeDefined()
  })
})

describe('get config cache path', () => {
  it('should return config cache path', () => {
    expect(PathSettings.getConfigCache()).toBeDefined()
  })
})
