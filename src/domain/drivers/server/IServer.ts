import type { IServerHandler } from './request'
import type { IServerGetHandler } from './request/get'
import type { IServerPostHandler } from './request/post'

export interface IServerInstance {
  get: (path: string, handler: IServerGetHandler) => void
  post: (path: string, handler: IServerPostHandler) => void
  notFound: (handler: IServerHandler) => void
  start(): Promise<string>
  stop(callback?: () => Promise<void>): Promise<void>
  isListening(): boolean
}

export interface IServer {
  create(port?: number): IServerInstance
}
