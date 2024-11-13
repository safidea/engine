import type { Filter } from '@domain/entities/Filter'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Logger } from '@domain/services/Logger'

export interface NotionTablePage {
  id: string
  properties: NotionTablePageProperties
}

export interface NotionTablePageProperties {
  [key: string]: string | number | boolean
}

export type Action = 'CREATE' | 'UPDATE' | 'DELETE'

interface Listener {
  id: string
  action: Action
  callback: (table: NotionTablePage) => Promise<void>
}

export interface Services {
  logger: Logger
  idGenerator: IdGenerator
}

export interface Spi {
  name: string
  list: (filters: Filter[]) => Promise<NotionTablePage[]>
  create: (page: NotionTablePageProperties) => Promise<string>
  retrieve: (id: string) => Promise<NotionTablePage>
  archive: (id: string) => Promise<void>
}

export class NotionTable {
  private _pollingTimer?: Timer
  private _listeners: Listener[] = []
  private _POLLING_INTERVAL = 10000

  constructor(
    private _spi: Spi,
    private _services: Services
  ) {}

  startPolling = () => {
    this._pollingTimer = setInterval(async () => {
      const rows = await this.list([
        // TODO: implement this filters
        /*{
          or: [
            {
              field: 'created_time',
              operator: 'is_after_number_of_seconds_since_now',
              value: this._POLLING_INTERVAL / 1000,
            },
            {
              field: 'last_edited_time',
              operator: 'is_after_number_of_seconds_since_now',
              value: this._POLLING_INTERVAL / 1000,
            },
          ],
        },*/
      ])
      for (const row of rows) {
        for (const listener of this._listeners) {
          if (listener.action === 'CREATE') {
            await listener.callback(row)
          }
        }
      }
    }, this._POLLING_INTERVAL)
  }

  stopPolling = () => {
    clearInterval(this._pollingTimer)
  }

  onPageCreated = async (callback: (page: NotionTablePage) => Promise<void>) => {
    const { idGenerator, logger } = this._services
    const id = idGenerator.forListener()
    this._listeners.push({ id, action: 'CREATE', callback })
    logger.debug(`subscribed to create events on Notion table "${this._spi.name}"`)
    return id
  }

  create = async (page: NotionTablePageProperties) => {
    return this._spi.create(page)
  }

  retrieve = async (id: string) => {
    return this._spi.retrieve(id)
  }

  archive = async (id: string) => {
    return this._spi.archive(id)
  }

  list = async (filters: Filter[] = []) => {
    return this._spi.list(filters)
  }
}
