import { IdGenerator } from './IdGenerator'

export interface Spi {
  getSystemFilePath: (path: string) => string
  write: (path: string, data: Buffer) => void
  read: (path: string) => Buffer
  remove: (path: string) => void
}

export interface Services {
  idGenerator: IdGenerator
}

export class FileSystem {
  constructor(
    private _spi: Spi,
    private _services: Services
  ) {}

  getSystemFilePath = (path: string) => {
    return this._spi.getSystemFilePath(path)
  }

  getTmpFilePath = (ext = '') => {
    const { idGenerator } = this._services
    return this.getSystemFilePath('/tmp/' + idGenerator.forFile() + ext)
  }

  write = (path: string, data: Buffer) => {
    this._spi.write(path, data)
  }

  readText = (path: string): string => {
    return this.read(path).toString('utf8')
  }

  read = (path: string): Buffer => {
    return this._spi.read(path)
  }

  remove = (path: string) => {
    this._spi.remove(path)
  }
}
