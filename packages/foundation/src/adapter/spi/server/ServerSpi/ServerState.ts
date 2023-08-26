import { IServerSpi } from '@domain/spi/IServerSpi'
import { IFetcherAdapter } from '../../fetcher/IFetcherAdapter'
import { ILoggerSpi } from '@domain/spi/ILoggerSpi'
import { IOrmAdapter } from '../../orm/IOrmAdapter'
import { IUISpi } from '@domain/spi/IUISpi'
import { IServerAdapter } from '../IServerAdapter'
import { IStorageSpi } from '@domain/spi/IStorageSpi'
import { IConverterSpi } from '@domain/spi/IConverterSpi'
import { ITemplatingSpi } from '@domain/spi/ITemplatingSpi'

export interface ServerStateAdapters {
  server: IServerAdapter
  orm: IOrmAdapter
  fetcher: IFetcherAdapter
  ui: IUISpi
  logger: ILoggerSpi
  storage: IStorageSpi
  converter: IConverterSpi
  templating: ITemplatingSpi
}

export abstract class ServerState implements IServerSpi {
  constructor(public adapters: ServerStateAdapters) {}

  get port(): number {
    return this.adapters.server.port
  }

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
