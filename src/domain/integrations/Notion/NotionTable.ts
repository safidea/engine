import type { Filter } from '@domain/entities/Filter'
import { OnOrAfterDateFilter } from '@domain/entities/Filter/date/OnOrAfter'
import { OrFilter } from '@domain/entities/Filter/Or'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Logger } from '@domain/services/Logger'
import type { NotionConfig } from '.'
import { NotionTablePage, type NotionTablePageProperties } from './NotionTablePage'
import type { Bucket } from '@domain/entities/Bucket'

export type NotionTableAction = 'CREATE'

interface Listener {
  id: string
  action: NotionTableAction
  callback: <T extends NotionTablePageProperties>(page: NotionTablePage<T>) => Promise<void>
}

export interface NotionTableServices {
  logger: Logger
  idGenerator: IdGenerator
}

export interface INotionTableSpi {
  id: string
  name: string
  create: <T extends NotionTablePageProperties>(page: T) => Promise<NotionTablePage<T>>
  update: <T extends NotionTablePageProperties>(id: string, page: T) => Promise<NotionTablePage<T>>
  retrieve: <T extends NotionTablePageProperties>(id: string) => Promise<NotionTablePage<T>>
  archive: (id: string) => Promise<void>
  list: <T extends NotionTablePageProperties>(filter?: Filter) => Promise<NotionTablePage<T>[]>
}

export class NotionTable {
  private _pollingTimer?: Timer
  private _listeners: Listener[] = []

  constructor(
    private _spi: INotionTableSpi,
    private _services: NotionTableServices,
    private _config: NotionConfig,
    private _bucket: Bucket
  ) {}

  get id() {
    return this._spi.id
  }

  startPolling = () => {
    const { logger } = this._services
    const { pollingInterval = 60 } = this._config
    logger.debug(
      `starting polling on Notion table "${this._spi.name}" with interval ${pollingInterval}s`
    )
    let pagesIdsPolled: string[] = []
    const startDate = new Date()
    this._pollingTimer = setInterval(async () => {
      const now = new Date()
      const seconds = Math.min((now.getTime() - startDate.getTime()) / 1000, pollingInterval * 2)
      now.setSeconds(now.getSeconds() - seconds)
      const filter = new OrFilter([new OnOrAfterDateFilter('created_time', now.toISOString())])
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

  create = async <T extends NotionTablePageProperties>(page: T): Promise<NotionTablePage<T>> => {
    const preprocessPage = await this._preprocessPage(page)
    return this._spi.create<T>(preprocessPage)
  }

  update = async <T extends NotionTablePageProperties>(
    id: string,
    page: T
  ): Promise<NotionTablePage<T>> => {
    const preprocessPage = await this._preprocessPage(page)
    return this._spi.update<T>(id, preprocessPage)
  }

  retrieve = async <T extends NotionTablePageProperties>(id: string) => {
    return this._spi.retrieve<T>(id)
  }

  archive = async (id: string) => {
    return this._spi.archive(id)
  }

  list = async <T extends NotionTablePageProperties>(filter?: Filter) => {
    return this._spi.list<T>(filter)
  }

  private _preprocessPage = async <T>(page: T): Promise<T> => {
    for (const key in page) {
      const value = page[key]
      if (NotionTablePage.isFilesProperty(value)) {
        for (let i = 0; i < value.length; i++) {
          const item = value[i]
          const parsedUrl = new URL(item.url)
          const allowedHosts = ['prod-files-secure.s3.us-west-2.amazonaws.com']
          if (allowedHosts.includes(parsedUrl.host)) {
            const data = await this._getFileBuffer(item.url)
            const { url } = await this._bucket.save({ name: item.name, data })
            value[i] = { name: item.name, url }
          }
        }
      }
    }
    return page
  }

  private _getFileBuffer = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch the file: ${response.statusText}`)
    }
    const buffer = await response.arrayBuffer()
    return Buffer.from(buffer)
  }
}
