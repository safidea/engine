import type { Spi } from '@domain/services/Logger'

export interface Driver {
  init: () => Promise<void>
  child: (metadata: object) => Spi
  error: (message: string, metadata: object) => void
  warn: (message: string, metadata: object) => void
  info: (message: string, metadata: object) => void
  http: (message: string, metadata: object) => void
  verbose: (message: string, metadata: object) => void
  debug: (message: string, metadata: object) => void
  silly: (message: string, metadata: object) => void
}

export class LoggerSpi implements Spi {
  constructor(private _driver: Driver) {}

  init = async () => {
    await this._driver.init()
  }

  child = (metadata: object) => {
    return new LoggerSpi(this._driver.child(metadata))
  }

  error = (message: string, metadata: object = {}) => {
    this._driver.error(message, metadata)
  }

  warn = (message: string, metadata: object = {}) => {
    this._driver.warn(message, metadata)
  }

  info = (message: string, metadata: object = {}) => {
    this._driver.info(message, metadata)
  }

  http = (message: string, metadata: object = {}) => {
    this._driver.http(message, metadata)
  }

  verbose = (message: string, metadata: object = {}) => {
    this._driver.verbose(message, metadata)
  }

  debug = (message: string, metadata: object = {}) => {
    this._driver.debug(message, metadata)
  }

  silly = (message: string, metadata: object = {}) => {
    this._driver.silly(message, metadata)
  }
}
