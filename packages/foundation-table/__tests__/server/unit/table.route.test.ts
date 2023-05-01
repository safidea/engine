import TableRoute from '@table/server/routes/table.route'

import type { ApiRequestInterface } from '@common'

describe('all', () => {
  it('should return array of middleware', () => {
    expect(TableRoute.all()).toHaveLength(2)
  })
})

describe('get', () => {
  it('should return array of middleware with id param', () => {
    const req = {
      query: {
        id: 1,
      },
    } as unknown as ApiRequestInterface
    expect(TableRoute.get(req)).toHaveLength(2)
  })
  it('should return array of middleware', () => {
    const req = {
      query: {},
    } as unknown as ApiRequestInterface
    expect(TableRoute.get(req)).toHaveLength(1)
  })
})

describe('post', () => {
  it('should return array of middleware', () => {
    expect(TableRoute.post()).toHaveLength(3)
  })
})

describe('patch', () => {
  it('should return array of middleware', () => {
    expect(TableRoute.patch()).toHaveLength(4)
  })
})

describe('put', () => {
  it('should return array of middleware', () => {
    expect(TableRoute.put()).toHaveLength(4)
  })
})

describe('delete', () => {
  it('should return array of middleware', () => {
    expect(TableRoute.delete()).toHaveLength(2)
  })
})
