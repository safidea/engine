import type { Driver } from '@adapter/spi/LoggerSpi'
import { type Logger } from 'winston'

export class BaseDriver implements Driver {
  constructor(private _logger: Logger) {
    _logger.on('error', (error) => {
      console.error('Error in logger caught', error)
    })
  }

  init = async () => {}

  child: (metadata: object) => Driver = (metadata) => {
    const childLogger = this._logger.child(metadata)
    return new BaseDriver(childLogger)
  }

  error: (message: string, metadata: object) => void = (message, metadata) => {
    this._logger.error(message, metadata)
  }

  warn: (message: string, metadata: object) => void = (message, metadata) => {
    this._logger.warn(message, metadata)
  }

  info: (message: string, metadata: object) => void = (message, metadata) => {
    this._logger.info(message, metadata)
  }

  http: (message: string, metadata: object) => void = (message, metadata) => {
    this._logger.http(message, metadata)
  }

  verbose: (message: string, metadata: object) => void = (message, metadata) => {
    this._logger.verbose(message, metadata)
  }

  debug: (message: string, metadata: object) => void = (message, metadata) => {
    this._logger.debug(message, metadata)
  }

  silly: (message: string, metadata: object) => void = (message, metadata) => {
    this._logger.silly(message, metadata)
  }
}
