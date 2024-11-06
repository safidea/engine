import type { Config } from '@domain/services/Storage'
import type { Driver } from '@adapter/spi/drivers/StorageSpi'
import { SqliteBucketDriver } from './SqliteBucketDriver'

export class SqliteDriver implements Driver {
  constructor(
    private _query: Config['query'],
    private _exec: Config['exec']
  ) {}

  connect = async () => {}

  bucket = (name: string) => {
    return new SqliteBucketDriver(name, this._query, this._exec)
  }
}
