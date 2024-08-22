import { type PersistedDto, type ToSaveDto } from '@adapter/spi/dtos/FileDto'
import type { Config } from '@domain/services/Storage'
import type { Driver } from '@adapter/spi/StorageSpi'

export class SqliteDriver implements Driver {
  constructor(
    private _query: Config['query'],
    private _exec: Config['exec']
  ) {}

  start = async (): Promise<void> => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS _files (
        id TEXT PRIMARY KEY,
        name TEXT,
        binary_data BLOB,
        created_at TIMESTAMP
      )
    `
    await this._exec(createTableQuery)
  }

  save = async (data: ToSaveDto) => {
    const { id, name, file_data, created_at } = data
    const createAt = created_at.getTime()
    await this._query(
      `INSERT INTO _files (id, name, binary_data, created_at) VALUES (?, ?, ?, ?)`,
      [id, name, file_data, createAt]
    )
  }

  readById = async (id: string) => {
    const result = await this._query<PersistedDto>('SELECT * FROM _files WHERE id = ?', [id])
    const file = result.rows[0]
    if (!file) return
    const created_at = new Date(file.created_at)
    return { ...file, created_at }
  }
}
