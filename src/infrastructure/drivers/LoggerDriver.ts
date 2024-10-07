import type { Driver } from '@adapter/spi/LoggerSpi'
import type { Config } from '@domain/services/Logger'
import { createLogger, format, transports, type Logger } from 'winston'
import { ElasticsearchTransport } from 'winston-elasticsearch'
import { Client } from '@elastic/elasticsearch'

export class LoggerDriver implements Driver {
  private _logger: Logger

  constructor(
    private _config: Config,
    childLogger?: Logger
  ) {
    if (childLogger) {
      this._logger = childLogger
      return
    }
    const { driver } = _config
    const silent = process.env.TESTING === 'true' && _config.level === 'info'
    if (driver === 'Console') {
      const { level } = _config
      this._logger = createLogger({
        level,
        silent,
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
      const { level, url, username, password, index } = _config
      const client = new Client({
        node: url,
        auth: {
          username,
          password,
        },
        ssl: { rejectUnauthorized: false },
      })
      /*client.indices
        .create({ index })
        .then(() => {
          console.log(`Index "${index}" created`)
        })
        .catch((error) => {
          console.error(`Failed to create index "${index}": ${error}`)
        })*/

      const esTransportOpts = {
        level,
        client,
        index,
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const esTransport = new ElasticsearchTransport(esTransportOpts)
      const esTransports = []
      esTransports.push(esTransport)
      if (!silent) esTransports.push(new transports.Console())
      this._logger = createLogger({
        format: format.combine(format.timestamp(), format.json()),
        transports: esTransports,
      })
      this._logger.on('error', (error) => {
        console.error('Error in logger caught', error)
      })
      esTransport.on('error', (error) => {
        console.error('Error in logger caught', error)
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
