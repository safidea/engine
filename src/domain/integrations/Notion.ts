import type { NotionTableSpi } from '@adapter/spi/integrations/NotionTableSpi'
import { NotionTable } from './NotionTable'

export interface Config {
  token: string
}

export interface Spi {
  table: (id: string) => Promise<NotionTableSpi>
}

export class Notion {
  constructor(private _spi: Spi) {}

  table = async (id: string) => {
    const page = await this._spi.table(id)
    return new NotionTable(page)
  }
}
