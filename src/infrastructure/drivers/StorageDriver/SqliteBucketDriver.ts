import { type PersistedDto, type ToSaveDto } from '@adapter/spi/dtos/FileDto'
import type { Config } from '@domain/services/Storage'
import type { Driver } from '@adapter/spi/StorageBucketSpi'

export class SqliteBucketDriver implements Driver {
  private _nameWithSchema: string

  constructor(
    name: string,
    private _query: Config['query'],
    private _exec: Config['exec']
  ) {
    this._nameWithSchema = `_storage_${name}`
  }

  exists = async () => {
    const result = await this._query(
      `SELECT name FROM sqlite_master WHERE type='table' AND name = ?`,
      [this._nameWithSchema]
    )
    return result.rows.length > 0
  }

  create = async (): Promise<void> => {
    const createTableQuery = `
      CREATE TABLE ${this._nameWithSchema} (
        id TEXT PRIMARY KEY,
        name TEXT,
        file_data BLOB,
        created_at TIMESTAMP
      )
    `
    await this._exec(createTableQuery)
  }

  save = async (data: ToSaveDto) => {
    const { id, name, file_data, created_at } = data
    const createAt = created_at.getTime()
    await this._query(
      `INSERT INTO ${this._nameWithSchema} (id, name, file_data, created_at) VALUES (?, ?, ?, ?)`,
      [id, name, file_data, createAt]
    )
  }

  readById = async (id: string) => {
    const result = await this._query<PersistedDto>(
      `SELECT * FROM ${this._nameWithSchema} WHERE id = ?`,
      [id]
    )
    const file = result.rows[0]
    if (!file) return
    const created_at = new Date(file.created_at)
    return { ...file, created_at }
  }
}
