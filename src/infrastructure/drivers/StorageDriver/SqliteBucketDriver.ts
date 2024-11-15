import type { StorageConfig } from '@domain/services/Storage'
import type { IStorageBucketDriver } from '@adapter/spi/drivers/StorageBucketSpi'
import type { FileDto } from '@adapter/spi/dtos/FileDto'

export class SqliteBucketDriver implements IStorageBucketDriver {
  private _nameWithSchema: string

  constructor(
    name: string,
    private _query: StorageConfig['query'],
    private _exec: StorageConfig['exec']
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
        data BLOB,
        created_at TIMESTAMP
      )
    `
    await this._exec(createTableQuery)
  }

  save = async (fields: FileDto) => {
    const { id, name, data, created_at } = fields
    const createAt = created_at.getTime()
    await this._query(
      `INSERT INTO ${this._nameWithSchema} (id, name, data, created_at) VALUES (?, ?, ?, ?)`,
      [id, name, data, createAt]
    )
  }

  readById = async (id: string) => {
    const result = await this._query<FileDto>(
      `SELECT * FROM ${this._nameWithSchema} WHERE id = ?`,
      [id]
    )
    const file = result.rows[0]
    if (!file) return
    const created_at = new Date(file.created_at)
    return { ...file, created_at }
  }
}
