import type { NotionTableSpi } from '@adapter/spi/integrations/NotionTableSpi'
import { NotionTable, type NotionTableServices } from './NotionTable'
import { Bucket } from '@domain/entities/Bucket'
import type { Storage } from '@domain/services/Storage'
import type { Server } from '@domain/services/Server'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

export interface NotionConfig {
  token: string
  pollingInterval?: number
}

export interface NotionServices extends NotionTableServices {
  storage: Storage
  server: Server
  templateCompiler: TemplateCompiler
}

export interface INotionSpi {
  getConfig: () => NotionConfig
  getTable: (id: string) => Promise<NotionTableSpi>
}

export class Notion {
  private _bucket?: Bucket
  private _tables: NotionTable[] = []

  constructor(
    private _spi: INotionSpi,
    private _services: NotionServices
  ) {}

  getConfig = (): NotionConfig => {
    return this._spi.getConfig()
  }

  init = async () => {
    const name = '_notion_table_page_files'
    this._bucket = new Bucket({ name }, this._services)
    await this._bucket.init()
  }

  startPolling = async () => {
    for (const table of this._tables) {
      table.startPolling()
    }
  }

  stopPolling = async () => {
    for (const table of this._tables) {
      table.stopPolling()
    }
  }

  getTable = async (id: string): Promise<NotionTable> => {
    let table = this._tables.find((table) => table.id === id)
    if (table) return table
    const spiTable = await this._spi.getTable(id)
    if (!this._bucket) throw new Error('bucket not initialized')
    table = new NotionTable(spiTable, this._services, this.getConfig(), this._bucket)
    this._tables.push(table)
    return table
  }
}
