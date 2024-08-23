import type { Spi } from '@domain/services/Zip'

export interface Driver {
  readDocx: (path: string) => string
  updateDocx: (path: string, content: string) => Buffer
}

export class ZipSpi implements Spi {
  constructor(private _driver: Driver) {}

  readDocx = (path: string): string => {
    return this._driver.readDocx(path)
  }

  updateDocx = (path: string, content: string): Buffer => {
    return this._driver.updateDocx(path, content)
  }
}
