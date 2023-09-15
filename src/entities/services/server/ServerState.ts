import { IServerSpi } from '@entities/services/server/IServerSpi'
import { IFetcherAdapter } from '../../../adapters/spi/fetcher/IFetcherAdapter'
import { ILoggerSpi } from '@adapters/services/logger/ILoggerDriver'
import { IOrmAdapter } from '../../../adapters/spi/orm/IOrmAdapter'
import { IUISpi } from '@entities/services/ui/IUISpi'
import { IServerAdapter } from './IServerAdapter'
import { IStorageSpi } from '@adapters/services/storage/IStorageDriver'
import { IConverterSpi } from '@adapters/services/converter/IConverterDrivers'
import { ITemplatingSpi } from '@entities/services/templater/ITemplatingSpi'

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
