import { IServerSpi } from '@domain/spi/IServerSpi'
import { IFetcherAdapter } from '../../fetcher/IFetcherAdapter'
import { ILogAdapter } from '../../log/ILogAdapter'
import { IOrmAdapter } from '../../orm/IOrmAdapter'
import { IUIAdapter } from '../../ui/IUIAdapter'
import { IServerAdapter } from '../IServerAdapter'
import { IStorageSpi } from '@domain/spi/IStorageSpi'
import { IConverterSpi } from '@domain/spi/IConverterSpi'

export interface ServerStateAdapters {
  server: IServerAdapter
  orm: IOrmAdapter
  fetcher: IFetcherAdapter
  ui: IUIAdapter
  log: ILogAdapter
  storage: IStorageSpi
  converter: IConverterSpi
}

export abstract class ServerState implements IServerSpi {
  constructor(public adapters: ServerStateAdapters) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config(config: unknown): ServerState {
    throw new Error('Invalid Operation: Cannot perform task in current state')
  }

  async start(): Promise<ServerState> {
    throw new Error('Invalid Operation: Cannot perform task in current state')
  }

  async stop(): Promise<ServerState> {
    throw new Error('Invalid Operation: Cannot perform task in current state')
  }
}
