import { type PersistedDto, type ToSaveDto } from '@adapter/spi/dtos/FileDto'
import type { Config } from '@domain/services/Storage'
import type { Driver } from '@adapter/spi/StorageSpi'

export class PostgresDriver implements Driver {
  constructor(
    private _query: Config['query'],
    private _exec: Config['exec']
  ) {}

  start = async (): Promise<void> => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS _files (
        id TEXT PRIMARY KEY,
        name TEXT,
        file_data BYTEA,
        created_at TIMESTAMP
      )
    `
    await this._exec(createTableQuery)
  }

  save = async (data: ToSaveDto) => {
    const { id, name, file_data, created_at } = data
    await this._query(
      'INSERT INTO _files (id, name, file_data, created_at) VALUES ($1, $2, $3, $4)',
      [id, name, file_data, created_at]
    )
  }

  readById = async (id: string) => {
    const result = await this._query<PersistedDto>('SELECT * FROM _files WHERE id = $1', [id])
    return result.rows[0]
  }
}
