import type { ServerResponse } from './response'

export type IServerHandler = () => Promise<ServerResponse>

export interface IServerInstance {
  get: (path: string, handler: IServerHandler) => void
  post: (path: string, handler: IServerHandler) => void
  notFound: (handler: IServerHandler) => void
  start(): Promise<string>
  stop(): Promise<void>
  isListening(): boolean
}

export interface IServer {
  create(port?: number): IServerInstance
}
