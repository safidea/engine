import { IncomingMessage, ServerResponse } from 'http'

export interface NextApiResponse extends ServerResponse {
  status: (statusCode: number) => NextApiResponse
  json: (data: unknown) => NextApiResponse
  send: (body: unknown) => NextApiResponse
}

export interface NextApiRequest extends IncomingMessage {
  method: string
  cookies: { [key: string]: string }
  query: { [key: string]: string }
  body?: unknown
  isPreview?: boolean
}

export type NextMiddleware = (err?: Error) => void

export type MiddlewareFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextMiddleware
) => Promise<void | NextApiResponse>

export type Route = (req: NextApiRequest, res: NextApiResponse) => MiddlewareFunction[]

export type Routes = {
  all?: Route
  get?: Route
  post?: Route
  patch?: Route
  put?: Route
  delete?: Route
}
