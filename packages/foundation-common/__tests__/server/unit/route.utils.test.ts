import NextLib from '@common/server/lib/next.lib'
import RouteUtils from '@common/server/utils/route.utils'

import type { RequestType } from '@common/server/types/request.type'

jest.mock('@common/server/lib/next.lib')

beforeAll(() => {
  jest.clearAllMocks()
})

describe('handler', () => {
  it('should return a function', () => {
    const middleware = RouteUtils.handler(() => [])
    expect(middleware).toBeInstanceOf(Function)
  })

  it('should return a function that calls all middlewares', async () => {
    const middleware1 = jest.fn(async () => undefined)
    const middleware2 = jest.fn(async () => ({ json: {} }))
    const handler = RouteUtils.handler(() => [middleware1, middleware2])
    await handler({ json: () => ({}) } as any, { params: {} } as any)
    const request: RequestType = {
      body: {},
      query: {},
      locals: {},
    }
    expect(middleware1).toBeCalledWith(request)
    expect(middleware2).toBeCalledWith(request)
    expect(NextLib.Response.json).toBeCalledWith({}, { status: 200 })
  })

  it('should return a function that calls all middlewares until one returns a status code', async () => {
    const middleware1 = jest.fn(async () => ({ json: {} }))
    const middleware2 = jest.fn(async () => ({ status: 400, json: {} }))
    const middleware3 = jest.fn(async () => ({ json: {} }))
    const handler = RouteUtils.handler(() => [middleware1, middleware2, middleware3])
    await handler({ json: () => ({}) } as any, { params: {} } as any)
    const request: RequestType = {
      body: {},
      query: {},
      locals: {},
    }
    expect(middleware1).toBeCalledWith(request)
    expect(middleware2).toBeCalledWith(request)
    expect(middleware3).not.toBeCalled()
    expect(NextLib.Response.json).toBeCalledWith({}, { status: 400 })
  })

  it('should return a function that calls no middleware', async () => {
    const handler = RouteUtils.handler(() => [])
    await handler({ json: () => ({}) } as any, { params: {} } as any)
    expect(NextLib.Response.json).toBeCalledWith({}, { status: 200 })
  })
})
