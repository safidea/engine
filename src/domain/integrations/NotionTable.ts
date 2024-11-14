import type { Filter } from '@domain/entities/Filter'
import { IsAfterNumberOfSecondsSinceNow } from '@domain/entities/Filter/date/IsAfterNumberOfSecondsSinceNow'
import { Or } from '@domain/entities/Filter/Or'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Logger } from '@domain/services/Logger'

export interface NotionTablePage {
  id: string
  properties: NotionTablePageProperties
  createdTime: string
}

export interface NotionTablePageProperties {
  [key: string]: string | number | boolean
}

export type Action = 'CREATE'

interface Listener {
  id: string
  action: Action
  callback: (page: NotionTablePage) => Promise<void>
}

export interface Services {
  logger: Logger
  idGenerator: IdGenerator
}

export interface Spi {
  name: string
  create: (page: NotionTablePageProperties) => Promise<string>
  retrieve: (id: string) => Promise<NotionTablePage>
  archive: (id: string) => Promise<void>
  list: (filter?: Filter) => Promise<NotionTablePage[]>
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
    this._services.logger.debug(`starting polling on Notion table "${this._spi.name}"`)
    let pagesIdsPolled: string[] = []
    const startDate = new Date()
    this._pollingTimer = setInterval(async () => {
      const seconds = Math.min(
        (new Date().getTime() - startDate.getTime()) / 1000,
        (this._POLLING_INTERVAL * 12) / 1000
      )
      const filter = new Or([new IsAfterNumberOfSecondsSinceNow('created_time', seconds)])
      const pages = await this.list(filter)
      const pagesNotPolled = pages.filter((page) => !pagesIdsPolled.includes(page.id))
      pagesIdsPolled = pages.map((page) => page.id)
      for (const page of pagesNotPolled) {
        for (const listener of this._listeners) {
          if (listener.action === 'CREATE') {
            await listener.callback(page)
          }
        }
      }
    }, this._POLLING_INTERVAL)
  }

  stopPolling = () => {
    this._services.logger.debug(`stopping polling on Notion table "${this._spi.name}"`)
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

  list = async (filter?: Filter) => {
    return this._spi.list(filter)
  }
}
