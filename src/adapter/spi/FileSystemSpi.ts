import type { Spi } from '@domain/services/FileSystem'

export interface Driver {
  exists: (path: string) => boolean
}

export class FileSystemSpi implements Spi {
  constructor(private _driver: Driver) {}

  exists = (path: string) => {
    return this._driver.exists(path)
  }
}
