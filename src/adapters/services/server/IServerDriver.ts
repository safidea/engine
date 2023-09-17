export interface ServerRequestQuery {
  [key: string]: string
}

export interface ServerRequest {
  method: string
  path: string
  body?: unknown
  params?: {
    [key: string]: string
  }
  query?: ServerRequestQuery
}

export type ServerHandler = (
  options: ServerRequest
) => Promise<{ status?: number; json?: unknown; html?: string }>

export interface IServerDriver {
  get: (path: string, handler: ServerHandler) => void
  post: (path: string, handler: ServerHandler) => void
  patch: (path: string, handler: ServerHandler) => void
  delete: (path: string, handler: ServerHandler) => void
  start(): Promise<void>
  stop(): Promise<void>
}
