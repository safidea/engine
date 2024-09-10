export interface Spi {
  exists: (path: string) => boolean
}

export class FileSystem {
  constructor(private _spi: Spi) {}

  exists = (path: string): boolean => {
    return this._spi.exists(path)
  }
}
