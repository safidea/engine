import { IServerSpi } from '@domain/spi/IServerSpi'
import { IFetcherAdapter } from '../../fetcher/IFetcherAdapter'
import { ILogAdapter } from '../../log/ILogAdapter'
import { IOrmAdapter } from '../../orm/IOrmAdapter'
import { IUIAdapter } from '../../ui/IUIAdapter'
import { IServerAdapter } from '../IServerAdapter'
import { IStorageAdapter } from '@adapter/spi/storage/IStorageAdapter'

export interface ServerStateAdapters {
  server: IServerAdapter
  orm: IOrmAdapter
  fetcher: IFetcherAdapter
  ui: IUIAdapter
  log: ILogAdapter
  storage: IStorageAdapter
  converter: any
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
