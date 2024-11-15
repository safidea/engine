import type { StorageConfig } from '@domain/services/Storage'
import type { IStorageBucketDriver } from '@adapter/spi/drivers/StorageBucketSpi'
import type { FileDto } from '@adapter/spi/dtos/FileDto'

export class PostgresBucketDriver implements IStorageBucketDriver {
  private _nameWithSchema: string

  constructor(
    private _name: string,
    private _query: StorageConfig['query'],
    private _exec: StorageConfig['exec']
  ) {
    this._nameWithSchema = `storage.${_name}`
  }

  exists = async () => {
    const result = await this._query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = $1`,
      [this._name]
    )
    return result.rows.length > 0
  }

  create = async (): Promise<void> => {
    const createTableQuery = `
      CREATE TABLE ${this._nameWithSchema} (
        id TEXT PRIMARY KEY,
        name TEXT,
        data BYTEA,
        created_at TIMESTAMP
      )
    `
    await this._exec(createTableQuery)
  }

  save = async (fields: FileDto) => {
    const { id, name, data, created_at } = fields
    await this._query(
      `INSERT INTO ${this._nameWithSchema} (id, name, data, created_at) VALUES ($1, $2, $3, $4)`,
      [id, name, data, created_at]
    )
  }

  readById = async (id: string) => {
    const result = await this._query<FileDto>(
      `SELECT * FROM ${this._nameWithSchema} WHERE id = $1`,
      [id]
    )
    return result.rows[0]
  }
}
