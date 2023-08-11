export interface IServerSpi {
  config(config: unknown): IServerSpi
  start(): Promise<IServerSpi>
  stop(): Promise<IServerSpi>
}
