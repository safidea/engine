import { NextApiRequest } from './next-api-request.type'
import { NextApiResponse } from './next-api-response.type'
import { MiddlewareFunction } from './middleware-function.type'

export type Route = (req: NextApiRequest, res: NextApiResponse) => MiddlewareFunction[]

export type Routes = {
  all?: Route
  get?: Route
  post?: Route
  patch?: Route
  put?: Route
  delete?: Route
}
