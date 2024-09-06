export interface Spi {
  exists: (path: string) => boolean
  read: (path: string) => Buffer
}

export class FileSystem {
  constructor(private _spi: Spi) {}

  exists = (path: string): boolean => {
    return this._spi.exists(path)
  }

  readText = (path: string): string => {
    return this.read(path).toString('utf8')
  }

  read = (path: string): Buffer => {
    return this._spi.read(path)
  }
}
