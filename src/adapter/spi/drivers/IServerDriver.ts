export interface IServerDriver {
  start(): Promise<string>
  stop(): Promise<void>
}
