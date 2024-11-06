export interface NotionTablePage {
  id: string
  properties: NotionTablePageProperties
}

export interface NotionTablePageProperties {
  [key: string]: string | number | boolean
}

export interface Spi {
  create: (page: NotionTablePageProperties) => Promise<string>
  retrieve: (id: string) => Promise<NotionTablePage>
  archive: (id: string) => Promise<void>
}

export class NotionTable {
  constructor(private _spi: Spi) {}

  create = async (page: NotionTablePageProperties) => {
    return this._spi.create(page)
  }

  retrieve = async (id: string) => {
    return this._spi.retrieve(id)
  }

  archive = async (id: string) => {
    return this._spi.archive(id)
  }
}
