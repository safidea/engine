import { type PersistedDto, type ToSaveDto } from '@adapter/spi/dtos/FileDto'
import type { Config } from '@domain/services/Storage'
import type { Driver } from '@adapter/spi/StorageBucketSpi'

export class PostgresBucketDriver implements Driver {
  private _nameWithSchema: string

  constructor(
    private _name: string,
    private _query: Config['query'],
    private _exec: Config['exec']
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
        file_data BYTEA,
        created_at TIMESTAMP
      )
    `
    await this._exec(createTableQuery)
  }

  save = async (data: ToSaveDto) => {
    const { id, name, file_data, created_at } = data
    await this._query(
      `INSERT INTO ${this._nameWithSchema} (id, name, file_data, created_at) VALUES ($1, $2, $3, $4)`,
      [id, name, file_data, created_at]
    )
  }

  readById = async (id: string) => {
    const result = await this._query<PersistedDto>(
      `SELECT * FROM ${this._nameWithSchema} WHERE id = $1`,
      [id]
    )
    return result.rows[0]
  }
}
