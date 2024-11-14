import type { NotionTableSpi } from '@adapter/spi/integrations/NotionTableSpi'
import { NotionTable, type Services as NotionTableServices } from './NotionTable'

export interface Config {
  token: string
}

export type Services = NotionTableServices

export interface Spi {
  config: () => void
  table: (id: string) => Promise<NotionTableSpi>
}

export class Notion {
  private _tables: NotionTable[] = []

  constructor(
    private _spi: Spi,
    private _services: Services
  ) {}

  config = () => {
    this._spi.config()
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

  table = async (id: string): Promise<NotionTable> => {
    const page = await this._spi.table(id)
    const table = new NotionTable(page, this._services)
    this._tables.push(table)
    return table
  }
}
