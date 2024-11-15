import type { StorageConfig } from '@domain/services/Storage'
import type { IStorageDriver } from '@adapter/spi/drivers/StorageSpi'
import { SqliteBucketDriver } from './SqliteBucketDriver'

export class SqliteDriver implements IStorageDriver {
  constructor(
    private _query: StorageConfig['query'],
    private _exec: StorageConfig['exec']
  ) {}

  connect = async () => {}

  bucket = (name: string) => {
    return new SqliteBucketDriver(name, this._query, this._exec)
  }
}
