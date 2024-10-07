import type { Driver } from '@adapter/spi/LoggerSpi'
import type { Config } from '@domain/services/Logger'
import { ConsoleDriver } from './ConsoleDriver'
import { FileDriver } from './FileDriver'
import { ElasticsSearchDriver } from './ElasticSearchDriver'

export class LoggerDriver implements Driver {
  private _logger: ConsoleDriver | FileDriver | ElasticsSearchDriver

  constructor(config: Config) {
    const { driver } = config
    if (driver === 'Console') {
      this._logger = new ConsoleDriver(config)
    } else if (driver === 'File') {
      this._logger = new FileDriver(config)
    } else if (driver === 'ElasticSearch') {
      this._logger = new ElasticsSearchDriver(config)
    } else throw new Error(`Logger driver "${driver}" not supported`)
  }

  init = async () => {
    await this._logger.init()
  }

  child: (metadata: object) => Driver = (metadata) => {
    return this._logger.child(metadata)
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
