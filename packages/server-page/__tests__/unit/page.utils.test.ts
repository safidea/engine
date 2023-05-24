import './setup'
import PageUtils from '../../src/utils/page.utils'

describe('getPathFromParams', () => {
  it('should return path', () => {
    const params = { path: ['test'] }
    const path = PageUtils.getPathFromParams(params)
    expect(path).toEqual('/test')
  })

  it('should return empty path', () => {
    const params = {}
    const path = PageUtils.getPathFromParams(params)
    expect(path).toEqual('/')
  })
})
