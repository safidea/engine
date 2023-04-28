import { RouterUtils } from '@common/server'

describe('return handler', () => {
  it('should return a function', () => {
    const middleware = RouterUtils.handler({})
    expect(middleware).toBeInstanceOf(Function)
  })

  it('should return a function that calls the get function with middlewares', async () => {
    const middleware1 = jest.fn((req, res, next) => next())
    const middleware2 = jest.fn((req, res, next) => next())
    const middleware3 = jest.fn((req, res, next) => next())
    const handler = RouterUtils.handler({ get: () => [middleware1, middleware2, middleware3] })
    const req = { method: 'GET' }
    const res = {}
    await handler(req as any, res as any)
    expect(middleware1).toBeCalledWith(req, res, expect.any(Function))
    expect(middleware2).toBeCalledWith(req, res, expect.any(Function))
    expect(middleware3).toBeCalledWith(req, res, expect.any(Function))
  })

  it('should return a function that calls the all function', async () => {
    const middleware1 = jest.fn((req, res, next) => next())
    const middleware2 = jest.fn((req, res, next) => next())
    const handler = RouterUtils.handler({ all: () => [middleware1], get: () => [middleware2] })
    const req = { method: 'GET' }
    const res = {}
    await handler(req as any, res as any)
    expect(middleware1).toBeCalledWith(req, res, expect.any(Function))
    expect(middleware2).toBeCalledWith(req, res, expect.any(Function))
  })

  it('shoudl return a function that throw an error if method not allowed', async () => {
    const handler = RouterUtils.handler({ get: () => [] })
    const req = { method: 'POST' }
    const res: any = { status: jest.fn(() => res), json: jest.fn(() => res) }
    await handler(req as any, res as any)
    expect(res.status).toBeCalledWith(405)
    expect(res.json).toBeCalledWith({ error: 'Method POST not supported' })
  })
})
