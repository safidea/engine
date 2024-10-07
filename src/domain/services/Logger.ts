interface BaseConfig {
  level?: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly'
}

export interface ElasticSearchConfig extends BaseConfig {
  driver: 'ElasticSearch'
  url: string
  username: string
  password: string
  index: string
}

export interface ConsoleConfig extends BaseConfig {
  driver: 'Console'
}

export interface FileConfig extends BaseConfig {
  driver: 'File'
  filename: string
}

export type Config = ConsoleConfig | FileConfig | ElasticSearchConfig

export interface Spi {
  child: (metadata: object) => Spi
  error: (message: string, metadata: object) => void
  warn: (message: string, metadata: object) => void
  info: (message: string, metadata: object) => void
  http: (message: string, metadata: object) => void
  verbose: (message: string, metadata: object) => void
  debug: (message: string, metadata: object) => void
  silly: (message: string, metadata: object) => void
}

export class Logger {
  constructor(private _spi: Spi) {}

  child = (metadata: object) => {
    return new Logger(this._spi.child(metadata))
  }

  info = (message: string, metadata: object = {}) => {
    this._spi.info(message, metadata)
  }

  error = (message: string, metadata: object = {}) => {
    this._spi.error(message, metadata)
  }

  warn = (message: string, metadata: object = {}) => {
    this._spi.warn(message, metadata)
  }

  http = (message: string, metadata: object = {}) => {
    this._spi.http(message, metadata)
  }

  verbose = (message: string, metadata: object = {}) => {
    this._spi.verbose(message, metadata)
  }

  debug = (message: string, metadata: object = {}) => {
    this._spi.debug(message, metadata)
  }

  silly = (message: string, metadata: object = {}) => {
    this._spi.silly(message, metadata)
  }
}
