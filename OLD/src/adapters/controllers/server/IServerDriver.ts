import { IServerHandler } from './IServerHandler'

export interface IServerDriver {
  get: (path: string, handler: IServerHandler) => void
  post: (path: string, handler: IServerHandler) => void
  patch: (path: string, handler: IServerHandler) => void
  delete: (path: string, handler: IServerHandler) => void
  start(): Promise<void>
  stop(): Promise<void>
}
