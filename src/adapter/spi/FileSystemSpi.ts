import type { Spi } from '@domain/services/FileSystem'

export interface Driver {
  getSystemFilePath: (path: string) => string
  write: (path: string, data: Buffer) => void
  read: (path: string) => Buffer
  remove: (path: string) => void
}

export class FileSystemSpi implements Spi {
  constructor(private _driver: Driver) {}

  getSystemFilePath = (path: string) => {
    return this._driver.getSystemFilePath(path)
  }

  write = (path: string, data: Buffer) => {
    this._driver.write(path, data)
  }

  read = (path: string) => {
    return this._driver.read(path)
  }

  remove = (path: string) => {
    this._driver.remove(path)
  }
}
