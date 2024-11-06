import type {
  NotionTablePage,
  NotionTablePageProperties,
  Spi,
} from '@domain/integrations/NotionTable'

export interface Integration {
  create: (page: NotionTablePageProperties) => Promise<string>
  retrieve: (id: string) => Promise<NotionTablePage>
  archive: (id: string) => Promise<void>
}

export class NotionTableSpi implements Spi {
  constructor(private _integration: Integration) {}

  create = async (page: NotionTablePageProperties) => {
    return this._integration.create(page)
  }

  retrieve = async (id: string) => {
    return this._integration.retrieve(id)
  }

  archive = async (id: string) => {
    return this._integration.archive(id)
  }
}
