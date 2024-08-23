export interface Spi {
  read: (path: string) => Buffer
}

export class FileSystem {
  constructor(private _spi: Spi) {}

  readText = (path: string): string => {
    return this.read(path).toString('utf8')
  }

  read = (path: string): Buffer => {
    return this._spi.read(path)
  }
}
