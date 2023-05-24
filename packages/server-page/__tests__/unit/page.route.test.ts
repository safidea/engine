import './setup'
import PageRoute from '../../src/routes/page.route'

describe('generateStaticPaths', () => {
  it('should return paths', () => {
    const paths = PageRoute.generateStaticPaths()
    expect(paths).toEqual([{ path: ['products'] }, { path: ['customers'] }])
  })
})

describe('generateMetadata', () => {
  it('should return metadata', () => {
    const params = {}
    const metadata = PageRoute.generateMetadata(params)
    expect(metadata).toEqual({
      title: 'Home',
      description: 'Home page',
    })
  })

  it('should return empty metadata', () => {
    const params = { path: ['test'] }
    const metadata = PageRoute.generateMetadata(params)
    expect(metadata).toEqual({})
  })

  it('should return metadata with params', () => {
    const params = { path: ['products'] }
    const metadata = PageRoute.generateMetadata(params)
    expect(metadata).toEqual({
      title: 'Products',
      description: 'Products page',
    })
  })
})

describe('generateComponents', () => {
  it('should return components', () => {
    const params = {}
    const components = PageRoute.generateComponents(params)
    expect(components).toEqual({
      header: {},
    })
  })

  it('should return empty body', () => {
    const params = { path: ['test'] }
    const components = PageRoute.generateComponents(params)
    expect(components).toEqual(undefined)
  })

  it('should return body with params', () => {
    const params = { path: ['products'] }
    const components = PageRoute.generateComponents(params)
    expect(components).toEqual({
      header: {},
    })
  })
})
