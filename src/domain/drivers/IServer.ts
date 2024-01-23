export type IServerHtmlResponse = {
  html: string
}

export type IServerHandler = () => Promise<IServerHtmlResponse>

export interface IServerInstance {
  get: (path: string, handler: IServerHandler) => void
  start(): Promise<string>
  stop(): Promise<void>
}

export interface IServer {
  create(): IServerInstance
}
