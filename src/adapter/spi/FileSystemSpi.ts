import type { Spi } from '@domain/services/FileSystem'

export interface Driver {
  read: (path: string) => Buffer
}

export class FileSystemSpi implements Spi {
  constructor(private _driver: Driver) {}

  read = (path: string) => {
    return this._driver.read(path)
  }
}
