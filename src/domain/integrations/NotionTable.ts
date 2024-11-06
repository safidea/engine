export interface NotionTablePage {
  [key: string]: string | number | boolean
}

export interface Spi {
  create: (page: NotionTablePage) => Promise<string>
}

export class NotionTable {
  constructor(private _spi: Spi) {}

  create = (page: NotionTablePage) => {
    return this._spi.create(page)
  }
}
