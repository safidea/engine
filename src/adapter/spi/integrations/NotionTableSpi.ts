import type { NotionTablePage, Spi } from '@domain/integrations/NotionTable'

export interface Integration {
  create: (page: NotionTablePage) => Promise<string>
}

export class NotionTableSpi implements Spi {
  constructor(private _integration: Integration) {}

  create = async (page: NotionTablePage) => {
    return this._integration.create(page)
  }
}
