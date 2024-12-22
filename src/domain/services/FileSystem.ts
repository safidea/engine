export interface IFileSystemSpi {
  exists: (path: string) => boolean
}

export class FileSystem {
  constructor(private _spi: IFileSystemSpi) {}

  exists = (path: string): boolean => {
    return this._spi.exists(path)
  }
}
