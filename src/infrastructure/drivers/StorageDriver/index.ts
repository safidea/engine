import { PostgresDriver } from './PostgresDriver'
import { SqliteDriver } from './SqliteDriver'
import type { Config } from '@domain/services/Storage'
import type { Driver } from '@adapter/spi/StorageSpi'

export class StorageDriver implements Driver {
  private _storage: PostgresDriver | SqliteDriver

  constructor({ driver, query, exec }: Config) {
    if (driver === 'SQLite') {
      this._storage = new SqliteDriver(query, exec)
    } else if (driver === 'PostgreSQL') {
      this._storage = new PostgresDriver(query, exec)
    } else {
      throw new Error(`Storage ${driver} not supported`)
    }
  }

  connect = async () => {
    await this._storage.connect()
  }

  bucket = (name: string) => {
    return this._storage.bucket(name)
  }
}
