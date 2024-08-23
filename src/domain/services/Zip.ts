export interface Spi {
  readDocx: (path: string) => string
  updateDocx: (path: string, content: string) => Buffer
}

export class Zip {
  constructor(private _spi: Spi) {}

  readDocx = (path: string): string => {
    return this._spi.readDocx(path)
  }

  updateDocx = (path: string, content: string): Buffer => {
    return this._spi.updateDocx(path, content)
  }
}
