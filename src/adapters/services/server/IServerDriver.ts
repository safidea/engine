export interface IServerDriver {
  port: number
  configure(config: unknown): Promise<void>
  start(): Promise<void>
  stop(): Promise<void>
}
