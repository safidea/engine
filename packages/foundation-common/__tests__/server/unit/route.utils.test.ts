import RouteUtils from '@common/server/utils/route.utils'

import type { RouteHandlerContextType } from '@common/server/types/route.type'

let request: Request
const url = 'http://localhost:3000'
const context: RouteHandlerContextType = { params: {} }

describe('handler', () => {
  it('should return a function', () => {
    const middleware = RouteUtils.handler(() => [])
    expect(middleware).toBeInstanceOf(Function)
  })

  it('should return a function that calls all middlewares', async () => {
    const middleware1 = jest.fn(async () => undefined)
    const middleware2 = jest.fn(async () => ({
      json: {
        id: 1,
      },
    }))
    const handler = RouteUtils.handler(() => [middleware1, middleware2])
    request = new Request(url)
    const response = await handler(request, context)
    expect(middleware1).toHaveBeenCalled()
    expect(middleware2).toHaveBeenCalled()
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ id: 1 })
  })

  it('should return a function that calls all middlewares until one returns a status code', async () => {
    const middleware1 = jest.fn(async () => ({ json: {} }))
    const middleware2 = jest.fn(async () => ({ status: 400, json: { error: 'message' } }))
    const middleware3 = jest.fn(async () => ({ json: {} }))
    const handler = RouteUtils.handler(() => [middleware1, middleware2, middleware3])
    request = new Request(url, {
      method: 'POST',
      body: JSON.stringify({}),
    })
    const response = await handler(request, context)
    expect(middleware1).toHaveBeenCalled()
    expect(middleware2).toHaveBeenCalled()
    expect(middleware3).not.toHaveBeenCalled()
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'message' })
  })

  it('should return a function that calls no middleware', async () => {
    const handler = RouteUtils.handler(() => [])
    request = new Request(url)
    const response = await handler(request, context)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({})
  })
})
