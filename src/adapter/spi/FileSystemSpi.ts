import type { Spi } from '@domain/services/FileSystem'

export interface Driver {
  exists: (path: string) => boolean
  read: (path: string) => Buffer
}

export class FileSystemSpi implements Spi {
  constructor(private _driver: Driver) {}

  exists = (path: string) => {
    return this._driver.exists(path)
  }

  read = (path: string) => {
    return this._driver.read(path)
  }
}
