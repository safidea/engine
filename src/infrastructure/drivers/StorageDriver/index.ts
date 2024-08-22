import type { PersistedDto, ToSaveDto } from '@adapter/spi/dtos/FileDto'
import { PostgresDriver } from './PostgresDriver'
import { SqliteDriver } from './SqliteDriver'
import type { Config } from '@domain/services/Storage'
import type { Driver } from '@adapter/spi/StorageSpi'

export class StorageDriver implements Driver {
  private _storage: PostgresDriver | SqliteDriver

  constructor({ type, query, exec }: Config) {
    if (type === 'sqlite') {
      this._storage = new SqliteDriver(query, exec)
    } else if (type === 'postgres') {
      this._storage = new PostgresDriver(query, exec)
    } else {
      throw new Error(`Storage ${type} not supported`)
    }
  }

  start = async (): Promise<void> => {
    return this._storage.start()
  }

  save = async (data: ToSaveDto): Promise<void> => {
    return this._storage.save(data)
  }

  readById = async (id: string): Promise<PersistedDto | undefined> => {
    return this._storage.readById(id)
  }
}
