import type { Monitor } from '@domain/services/Monitor'
import type { Context } from '../Automation/Context'
import type { Bucket } from '../Bucket'
import { ConfigError } from '../Error/Config'
import type { Table } from '../Table'
import { Logger } from '@domain/services/Logger'

export interface BaseConfig {
  name: string
}

export interface BaseServices {
  logger: Logger
  monitor: Monitor
}

export class Base<Input extends object, Output extends object> {
  public name: string

  constructor(
    private _baseConfig: BaseConfig,
    private _baseServices: BaseServices
  ) {
    this.name = _baseConfig.name
  }

  init = async () => {}

  protected _prepare = async (_context: Context): Promise<Input> => {
    throw new Error('Method not implemented.')
  }

  protected _process = async (_input: Input): Promise<Output> => {
    throw new Error('Method not implemented.')
  }

  execute = async (context: Context): Promise<void> => {
    const { logger, monitor } = this._baseServices
    try {
      logger.info(`executing action "${this.name}"`, this._baseConfig)
      const input = await this._prepare(context)
      logger.info(`input data of action "${this.name}"`, input)
      const output = await this._process(input)
      logger.info(`output data of action "${this.name}"`, output)
      context.set(this.name, output)
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`when executing action "${this.name}"`, error)
        monitor.captureException(error)
        context.set(this.name, {})
      } else throw error
    }
  }

  protected _findTableByName = (tableName: string, tables: Table[]): Table => {
    const table = tables.find((table) => table.name === tableName)
    if (!table) return this._throwConfigError(`Table ${tableName} not found`)
    return table
  }

  protected _findBucketByName = (bucketName: string, buckets: Bucket[]): Bucket => {
    const bucket = buckets.find((bucket) => bucket.name === bucketName)
    if (!bucket) return this._throwConfigError(`Bucket ${bucketName} not found`)
    return bucket
  }

  protected _throwConfigError = (message: string) => {
    throw new ConfigError({
      entity: 'Action',
      name: this.name,
      message,
    })
  }
}
