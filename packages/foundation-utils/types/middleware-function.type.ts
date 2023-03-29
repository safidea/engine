import { NextApiRequest } from './next-api-request.type'
import { NextApiResponse } from './next-api-response.type'
import { NextMiddleware } from './next-middleware.type'

export type MiddlewareFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextMiddleware
) => Promise<void | NextApiResponse>
