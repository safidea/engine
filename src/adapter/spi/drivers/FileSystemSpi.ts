import type { IFileSystemSpi } from '@domain/services/FileSystem'

export interface IFileSystemDriver {
  exists: (path: string) => boolean
}

export class FileSystemSpi implements IFileSystemSpi {
  constructor(private _driver: IFileSystemDriver) {}

  exists = (path: string) => {
    return this._driver.exists(path)
  }
}
