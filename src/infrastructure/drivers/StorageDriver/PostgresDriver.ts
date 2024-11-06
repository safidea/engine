import type { Config } from '@domain/services/Storage'
import type { Driver } from '@adapter/spi/drivers/StorageSpi'
import { PostgresBucketDriver } from './PostgresBucketDriver'

export class PostgresDriver implements Driver {
  constructor(
    private _query: Config['query'],
    private _exec: Config['exec']
  ) {}

  connect = async () => {
    await this._exec('CREATE SCHEMA IF NOT EXISTS storage;')
  }

  bucket = (name: string) => {
    return new PostgresBucketDriver(name, this._query, this._exec)
  }
}
