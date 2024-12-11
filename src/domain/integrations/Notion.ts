import type { NotionTableSpi } from '@adapter/spi/integrations/NotionTableSpi'
import { NotionTable, type NotionTableServices } from './NotionTable'

export interface NotionConfig {
  token: string
  pollingInterval: number
}

export type NotionServices = NotionTableServices

export interface INotionSpi {
  getConfig: () => NotionConfig
  getTable: (id: string) => Promise<NotionTableSpi>
}

export class Notion {
  private _tables: NotionTable[] = []

  constructor(
    private _spi: INotionSpi,
    private _services: NotionServices
  ) {}

  getConfig = (): NotionConfig => {
    return this._spi.getConfig()
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
    table = new NotionTable(spiTable, this._services, this.getConfig())
    this._tables.push(table)
    return table
  }
}
