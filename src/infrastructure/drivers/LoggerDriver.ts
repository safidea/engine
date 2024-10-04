import type { Driver } from '@adapter/spi/LoggerSpi'
import type { Config } from '@domain/services/Logger'
import { createLogger, format, transports, type Logger } from 'winston'
import { ElasticsearchTransport } from 'winston-elasticsearch'
import { Client as ESClient } from '@elastic/elasticsearch'

export class LoggerDriver implements Driver {
  private _logger: Logger

  constructor(
    private _config: Config,
    childLogger?: Logger
  ) {
    const { driver } = _config
    if (childLogger) {
      this._logger = childLogger
      return
    }
    if (driver === 'Console') {
      const { level } = _config
      this._logger = createLogger({
        level,
        silent: process.env.TESTING === 'true' && level === 'info',
        format: format.combine(
          format.colorize(),
          format.timestamp(),
          format.printf(({ timestamp, level, message, ...res }) => {
            return `${timestamp} [${level}]: ${message} ${Object.keys(res).length ? JSON.stringify(res, null, 2) : ''}`
          })
        ),
        transports: [new transports.Console()],
      })
    } else if (driver === 'File') {
      const { level, ...options } = _config
      this._logger = createLogger({
        level,
        format: format.combine(format.timestamp(), format.json()),
        transports: [new transports.Console(), new transports.File(options)],
      })
    } else if (driver === 'ElasticSearch') {
      const { level, url } = _config
      const esClient = new ESClient({
        node: url,
      })
      const esTransportOpts = {
        level,
        client: esClient,
        indexPrefix: 'safidea-engine',
      }
      const esTransport = new ElasticsearchTransport(esTransportOpts)
      this._logger = createLogger({
        format: format.combine(format.timestamp(), format.json()),
        transports: [new transports.Console(), esTransport],
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
