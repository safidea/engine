export interface IServerSpi {
  port: number
  config(config: unknown): IServerSpi
  start(): Promise<IServerSpi>
  stop(): Promise<IServerSpi>
}
