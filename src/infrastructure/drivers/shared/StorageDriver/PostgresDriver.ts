import type { StorageConfig } from '@domain/services/Storage'
import type { IStorageDriver } from '@adapter/spi/drivers/StorageSpi'
import { PostgresBucketDriver } from './PostgresBucketDriver'

export class PostgresDriver implements IStorageDriver {
  constructor(
    private _query: StorageConfig['query'],
    private _exec: StorageConfig['exec']
  ) {}

  connect = async () => {
    await this._exec('CREATE SCHEMA IF NOT EXISTS storage;')
  }

  bucket = (name: string) => {
    return new PostgresBucketDriver(name, this._query, this._exec)
  }
}
