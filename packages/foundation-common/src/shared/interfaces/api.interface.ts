import { IncomingMessage, ServerResponse } from 'http'

export interface ApiResponseInterface extends ServerResponse {
  status: (statusCode: number) => ApiResponseInterface
  json: (data: unknown) => ApiResponseInterface
  send: (body: unknown) => ApiResponseInterface
}

export interface ApiRequestInterface extends IncomingMessage {
  method: string
  cookies: { [key: string]: string }
  query: { [key: string]: string }
  body?: unknown
  isPreview?: boolean
  locals: {
    [key: string]: unknown
  }
}
