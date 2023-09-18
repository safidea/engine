import { ServerHandler } from './ServerHandler'

export interface IServerDriver {
  get: (path: string, handler: ServerHandler) => void
  post: (path: string, handler: ServerHandler) => void
  patch: (path: string, handler: ServerHandler) => void
  delete: (path: string, handler: ServerHandler) => void
  start(): Promise<void>
  stop(): Promise<void>
}
