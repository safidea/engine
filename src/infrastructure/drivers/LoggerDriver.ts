import type { Driver } from '@adapter/spi/LoggerSpi'
import type { Config } from '@domain/services/Logger'
import winston from 'winston'

export class LoggerDriver implements Driver {
  private _logger: winston.Logger

  constructor(
    private _config: Config,
    childLogger?: winston.Logger
  ) {
    const { driver, level = 'info', ...options } = _config
    if (childLogger) {
      this._logger = childLogger
      return
    }
    if (driver === 'Console') {
      this._logger = winston.createLogger({
        level,
        silent: process.env.TESTING === 'true' && level === 'info',
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message, ...res }) => {
            return `${timestamp} [${level}]: ${message} ${Object.keys(res).length ? JSON.stringify(res, null, 2) : ''}`
          })
        ),
        transports: [new winston.transports.Console()],
      })
    } else if (driver === 'File') {
      this._logger = winston.createLogger({
        level,
        format: winston.format.json(),
        transports: [new winston.transports.File(options)],
      })
    } else throw new Error(`Logger driver "${driver}" not supported`)
  }

  child: (metadata: object) => Driver = (metadata) => {
    const childLogger = this._logger.child(metadata)
    return new LoggerDriver(this._config, childLogger)
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
