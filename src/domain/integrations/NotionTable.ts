import type { Filter } from '@domain/entities/Filter'
import { IsAfterNumberOfSecondsSinceNowDateFilter } from '@domain/entities/Filter/date/IsAfterNumberOfSecondsSinceNow'
import { OrFilter } from '@domain/entities/Filter/Or'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Logger } from '@domain/services/Logger'
import type { NotionConfig } from './Notion'
import type { NotionTablePage, NotionTablePageProperties } from './NotionTablePage'

export type NotionTableAction = 'CREATE'

interface Listener {
  id: string
  action: NotionTableAction
  callback: (page: NotionTablePage) => Promise<void>
}

export interface NotionTableServices {
  logger: Logger
  idGenerator: IdGenerator
}

export interface INotionTableSpi {
  id: string
  name: string
  create: (page: NotionTablePageProperties) => Promise<NotionTablePage>
  update: (id: string, page: NotionTablePageProperties) => Promise<NotionTablePage>
  retrieve: (id: string) => Promise<NotionTablePage>
  archive: (id: string) => Promise<void>
  list: (filter?: Filter) => Promise<NotionTablePage[]>
}

export class NotionTable {
  private _pollingTimer?: Timer
  private _listeners: Listener[] = []

  constructor(
    private _spi: INotionTableSpi,
    private _services: NotionTableServices,
    private _config: NotionConfig
  ) {}

  get id() {
    return this._spi.id
  }

  startPolling = () => {
    const { logger } = this._services
    const { pollingInterval } = this._config
    logger.debug(
      `starting polling on Notion table "${this._spi.name}" with interval ${pollingInterval}s`
    )
    let pagesIdsPolled: string[] = []
    const startDate = new Date()
    this._pollingTimer = setInterval(async () => {
      const seconds = Math.min(
        (new Date().getTime() - startDate.getTime()) / 1000,
        pollingInterval * 2
      )
      const filter = new OrFilter([
        new IsAfterNumberOfSecondsSinceNowDateFilter('created_time', seconds),
      ])
      const pages = await this.list(filter)
      const pagesNotPolled = pages.filter((page) => !pagesIdsPolled.includes(page.id))
      pagesIdsPolled = pages.map((page) => page.id)
      logger.debug(`polled ${pagesNotPolled.length} new pages on Notion table "${this._spi.name}"`)
      for (const page of pagesNotPolled) {
        for (const listener of this._listeners) {
          if (listener.action === 'CREATE') {
            await listener.callback(page)
          }
        }
      }
    }, pollingInterval * 1000)
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

  create = async (page: NotionTablePageProperties): Promise<NotionTablePage> => {
    return this._spi.create(page)
  }

  update = async (id: string, page: NotionTablePageProperties): Promise<NotionTablePage> => {
    return this._spi.update(id, page)
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
