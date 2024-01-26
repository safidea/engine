export type IServerHtmlResponse = {
  html: string
}

export type IServerHandler = () => Promise<IServerHtmlResponse>

export interface IServerInstance {
  get: (path: string, handler: IServerHandler) => void
  notFound: (handler: IServerHandler) => void
  start(): Promise<string>
  stop(): Promise<void>
  isListening(): boolean
}

export interface IServer {
  create(port?: number): IServerInstance
}
