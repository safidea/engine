export interface IServerInstance {
  start(): Promise<string>
  stop(): Promise<void>
}

export interface IServer {
  create(): IServerInstance
}
