import './setup'
import PageService from '../../src/services/page.service'

describe('getPaths', () => {
  it('should return paths', () => {
    const paths = PageService.getPaths()
    expect(paths).toEqual(['/', '/products', '/customers'])
  })
})

describe('pathExists', () => {
  it('should return true', () => {
    const path = '/'
    const exists = PageService.pathExists(path)
    expect(exists).toBeTruthy()
  })

  it('should return false', () => {
    const path = '/test'
    const exists = PageService.pathExists(path)
    expect(exists).toBeFalsy()
  })
})

describe('getMetadata', () => {
  it('should return metadata', () => {
    const path = '/'
    const metadata = PageService.getMetadata(path)
    expect(metadata).toEqual({
      title: 'Home',
      description: 'Home page',
    })
  })

  it('should return empty metadata', () => {
    const path = '/test'
    const metadata = PageService.getMetadata(path)
    expect(metadata).toBeUndefined()
  })

  it('should return metadata with only title', () => {
    const path = '/customers'
    const metadata = PageService.getMetadata(path)
    expect(metadata).toEqual({
      title: 'Customers',
    })
  })
})
