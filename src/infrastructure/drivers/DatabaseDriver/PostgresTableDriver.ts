import pg from 'pg'
import type { Driver } from '@adapter/spi/DatabaseTableSpi'
import type { FilterDto } from '@adapter/spi/dtos/FilterDto'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'
import type { PersistedDto, ToCreateDto, ToUpdateDto } from '@adapter/spi/dtos/RecordDto'

export class PostgresTableDriver implements Driver {
  constructor(
    private name: string,
    private db: pg.Pool
  ) {}

  exists = async () => {
    const result = await this.db.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1`,
      [this.name]
    )
    return result.rows.length > 0
  }

  private buildColumnQuery = (field: FieldDto) => {
    let query = `"${field.name}" ${field.type}`
    if (field.formula) {
      query += ` GENERATED ALWAYS AS (${field.formula}) STORED`
    }
    return query
  }

  create = async (fields: FieldDto[]) => {
    const columns = fields.map(this.buildColumnQuery).join(', ')
    const query = `CREATE TABLE ${this.name} (${columns})`
    await this.db.query(query)
  }

  fieldExists = async (name: string) => {
    const result = await this.db.query(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
      [this.name, name]
    )
    return result.rows.length > 0
  }

  addField = async (field: FieldDto) => {
    const query = `ALTER TABLE ${this.name} ADD COLUMN ${this.buildColumnQuery(field)}`
    await this.db.query(query)
  }

  alterField = async (field: FieldDto) => {
    const query = `ALTER TABLE ${this.name} ALTER COLUMN ${field.name} TYPE ${field.type}`
    await this.db.query(query)
  }

  dropField = async (name: string) => {
    const query = `ALTER TABLE ${this.name} DROP COLUMN ${name}`
    await this.db.query(query)
  }

  drop = async () => {
    const query = `DROP TABLE ${this.name}`
    await this.db.query(query)
  }

  insert = async (recordtoCreateDto: ToCreateDto): Promise<PersistedDto> => {
    const keys = Object.keys(recordtoCreateDto)
    const values = Object.values(recordtoCreateDto)
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
    const query = `INSERT INTO ${this.name} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`
    const result = await this.db.query<PersistedDto>(query, values)
    return result.rows[0]
  }

  insertMany = async (recordtoCreateDtos: ToCreateDto[]): Promise<PersistedDto[]> => {
    if (recordtoCreateDtos.length === 0) return []
    const keys = Object.keys(recordtoCreateDtos[0])
    const values = recordtoCreateDtos.map(Object.values).flat()
    const placeholders = recordtoCreateDtos
      .map((_, i) => `(${keys.map((_, j) => `$${i * keys.length + j + 1}`).join(', ')})`)
      .join(', ')
    const query = `INSERT INTO ${this.name} (${keys.join(', ')}) VALUES ${placeholders} RETURNING *`
    const result = await this.db.query<PersistedDto>(query, values)
    return result.rows
  }

  update = async (record: ToUpdateDto): Promise<PersistedDto> => {
    const keys = Object.keys(record)
    const values = Object.values(record)
    const setString = keys.map((key, i) => `${key} = $${i + 1}`).join(', ')
    const query = `UPDATE ${this.name} SET ${setString} WHERE id = $${keys.length + 1} RETURNING *`
    values.push(record.id)
    const result = await this.db.query<PersistedDto>(query, values)
    return result.rows[0]
  }

  delete = async (filters: FilterDto[]): Promise<void> => {
    const conditions = filters
      .map((filter, i) => `${filter.field} ${filter.operator} $${i + 1}`)
      .join(' AND ')
    const values = filters.map((filter) => filter.value)
    const query = `DELETE FROM ${this.name} ${conditions.length > 0 ? `WHERE ${conditions}` : ''}`
    await this.db.query(query, values)
  }

  read = async (filters: FilterDto[]): Promise<PersistedDto | undefined> => {
    const conditions = filters
      .map((filter, i) => `${filter.field} ${filter.operator} $${i + 1}`)
      .join(' AND ')
    const values = filters.map((filter) => filter.value)
    const query = `SELECT * FROM ${this.name} ${conditions.length > 0 ? `WHERE ${conditions}` : ''} LIMIT 1`
    const result = await this.db.query<PersistedDto>(query, values)
    return result.rows[0]
  }

  readById = async (id: string): Promise<PersistedDto | undefined> => {
    const query = `SELECT * FROM ${this.name} WHERE id = $1`
    const result = await this.db.query<PersistedDto>(query, [id])
    return result.rows[0]
  }

  list = async (filters: FilterDto[]): Promise<PersistedDto[]> => {
    const conditions = filters
      .map((filter, i) => `${filter.field} ${filter.operator} $${i + 1}`)
      .join(' AND ')
    const values = filters.map((filter) => filter.value)
    const query = `SELECT * FROM ${this.name} ${conditions.length > 0 ? `WHERE ${conditions}` : ''}`
    const result = await this.db.query<PersistedDto>(query, values)
    return result.rows
  }
}
