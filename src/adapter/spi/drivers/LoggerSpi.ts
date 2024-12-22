import type { ILoggerSpi } from '@domain/services/Logger'

export interface ILoggerDriver {
  init: () => Promise<void>
  error: (message: string, metadata: object) => void
  warn: (message: string, metadata: object) => void
  info: (message: string, metadata: object) => void
  http: (message: string, metadata: object) => void
  verbose: (message: string, metadata: object) => void
  debug: (message: string, metadata: object) => void
  silly: (message: string, metadata: object) => void
}

export class LoggerSpi implements ILoggerSpi {
  constructor(private _driver: ILoggerDriver) {}

  init = async () => {
    await this._driver.init()
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
