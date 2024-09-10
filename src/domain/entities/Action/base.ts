import type { Context } from '../Automation/Context'
import type { Bucket } from '../Bucket'
import { ConfigError } from '../Error/Config'
import type { Table } from '../Table'

export interface BaseConfig {
  name: string
}

export class Base {
  public name: string

  constructor(config: BaseConfig) {
    this.name = config.name
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

  init = async () => {}

  execute = async (_context: Context): Promise<void> => {
    throw new Error('Method not implemented.')
  }
}
