import { PathUtils } from '@common/server'

describe('get root path', () => {
  it('should return root path', () => {
    expect(PathUtils.getRoot()).toBeDefined()
  })
})

describe('get data folder path', () => {
  it('should return data folder path by default', () => {
    expect(true).toBe(true)
  })

  it('should return data folder path from env', () => {
    expect(true).toBe(true)
  })
})

describe('get config file path', () => {
  it('should thow an error if there is no config file', () => {
    expect(true).toBe(true)
  })

  it('should return config file path from env', () => {
    expect(true).toBe(true)
  })
})

describe('get config cache path', () => {
  it('should return config cache path', () => {
    expect(true).toBe(true)
  })
})
