import { IServerSpi } from '@entities/spi/IServerSpi'
import { IFetcherAdapter } from '../../fetcher/IFetcherAdapter'
import { ILoggerSpi } from '@entities/spi/ILoggerSpi'
import { IOrmAdapter } from '../../orm/IOrmAdapter'
import { IUISpi } from '@entities/spi/IUISpi'
import { IServerAdapter } from '../IServerAdapter'
import { IStorageSpi } from '@entities/spi/IStorageSpi'
import { IConverterSpi } from '@entities/spi/IConverterSpi'
import { ITemplatingSpi } from '@entities/spi/ITemplatingSpi'

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
