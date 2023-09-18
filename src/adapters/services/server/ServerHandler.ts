import { ServerRequest } from './ServerRequest'

export type ServerHandler = (
  request: ServerRequest
) => Promise<{ status?: number; json?: unknown; html?: string }>
