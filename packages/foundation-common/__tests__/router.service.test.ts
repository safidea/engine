import { RouterService, TestUtils } from '../src'

import type { NextApiRequest, NextApiResponse, NextMiddleware } from '../types'

const middleware = async (req: NextApiRequest, res: NextApiResponse, next: NextMiddleware) => next()
const controller = async (req: NextApiRequest, res: NextApiResponse) => res.status(200).end()
const { response } = TestUtils

test('should handle routes', async () => {
  const res = response() as unknown as NextApiResponse
  const req = { method: 'GET' } as NextApiRequest
  await RouterService.handler({
    all: () => [middleware],
    get: () => [middleware, controller],
  })(req, res)
  expect(res.status).toHaveBeenCalledWith(200)
})

test('should handle not supported method', async () => {
  const res = response() as unknown as NextApiResponse
  const req = { method: 'PATCH' } as NextApiRequest
  await RouterService.handler({
    all: () => [middleware],
    post: () => [middleware, controller],
  })(req, res)
  expect(res.status).toHaveBeenCalledWith(405)
})
