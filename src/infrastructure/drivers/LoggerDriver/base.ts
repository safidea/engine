import type { ILoggerDriver } from '@adapter/spi/drivers/LoggerSpi'
import { type Logger } from 'winston'

export class BaseLoggerDriver implements ILoggerDriver {
  constructor(private _logger: Logger) {
    _logger.on('error', (error) => {
      console.error('Error in logger caught', error)
    })
  }

  init = async () => {}

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
