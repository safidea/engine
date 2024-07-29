import SQLite from 'better-sqlite3'
import type { Driver } from '@adapter/spi/DatabaseTableSpi'
import type { FilterDto } from '@adapter/spi/dtos/FilterDto'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'
import type { PersistedDto, ToCreateDto, ToUpdateDto } from '@adapter/spi/dtos/RecordDto'

export class SqliteTableDriver implements Driver {
  constructor(
    private name: string,
    private db: SQLite.Database
  ) {}

  exists = async () => {
    const result = this.db
      .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name = ?`)
      .all(this.name)
    return result.length > 0
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
    this.db.exec(query)
  }

  fieldExists = async (name: string) => {
    const fields = this.db.prepare(`PRAGMA table_info(${this.name})`).all() as { name: string }[]
    return fields.some((field: { name: string }) => field.name === name)
  }

  addField = async (field: FieldDto) => {
    const query = `ALTER TABLE ${this.name} ADD COLUMN ${this.buildColumnQuery(field)}`
    this.db.exec(query)
  }

  alterField = async (field: FieldDto) => {
    const tempTableName = `${this.name}_temp`
    const fields = this.db.prepare(`PRAGMA table_info(${this.name})`).all() as {
      name: string
      type: string
    }[]

    const updatedFields = fields.map((f) =>
      f.name === field.name ? { ...f, type: field.type } : f
    )
    const columns = updatedFields.map(({ name, type }) => `"${name}" ${type}`).join(', ')

    this.db.exec(`CREATE TABLE ${tempTableName} (${columns})`)
    const fieldNames = fields.map((f) => f.name).join(', ')
    this.db.exec(
      `INSERT INTO ${tempTableName} (${fieldNames}) SELECT ${fieldNames} FROM ${this.name}`
    )
    this.db.exec(`DROP TABLE ${this.name}`)
    this.db.exec(`ALTER TABLE ${tempTableName} RENAME TO ${this.name}`)
  }

  dropField = async (name: string) => {
    const tempTableName = `${this.name}_temp`
    const fields = this.db.prepare(`PRAGMA table_info(${this.name})`).all() as {
      name: string
      type: string
    }[]

    const updatedFields = fields.filter((f) => f.name !== name)
    const columns = updatedFields.map(({ name, type }) => `"${name}" ${type}`).join(', ')

    this.db.exec(`CREATE TABLE ${tempTableName} (${columns})`)
    const fieldNames = updatedFields.map((f) => f.name).join(', ')
    this.db.exec(
      `INSERT INTO ${tempTableName} (${fieldNames}) SELECT ${fieldNames} FROM ${this.name}`
    )
    this.db.exec(`DROP TABLE ${this.name}`)
    this.db.exec(`ALTER TABLE ${tempTableName} RENAME TO ${this.name}`)
  }

  drop = async () => {
    const query = `DROP TABLE ${this.name}`
    this.db.exec(query)
  }

  private preprocess = (values: (string | number | Date | boolean | undefined)[]) => {
    return values.map((value) => {
      if (value instanceof Date) {
        return value.getTime()
      }
      return value
    })
  }

  private postprocess = (persistedRecord: PersistedDto) => {
    return Object.keys(persistedRecord).reduce((acc: PersistedDto, key) => {
      const value = persistedRecord[key]
      if (value instanceof Date) {
        acc[key] = new Date(value)
      }
      return acc
    }, persistedRecord)
  }

  insert = async (recordtoCreateDto: ToCreateDto): Promise<PersistedDto> => {
    const keys = Object.keys(recordtoCreateDto)
    const values = this.preprocess(Object.values(recordtoCreateDto))
    const placeholders = keys.map(() => `?`).join(', ')
    const query = `INSERT INTO ${this.name} (${keys.join(', ')}) VALUES (${placeholders})`
    this.db.prepare(query).run(values)
    const persistedRecord = this.db
      .prepare(`SELECT * FROM ${this.name} WHERE id = ?`)
      .get(recordtoCreateDto.id) as PersistedDto
    return this.postprocess(persistedRecord)
  }

  insertMany = async (recordtoCreateDtos: ToCreateDto[]): Promise<PersistedDto[]> => {
    if (recordtoCreateDtos.length === 0) return []
    const keys = Object.keys(recordtoCreateDtos[0])
    const values = this.preprocess(recordtoCreateDtos.map(Object.values).flat())
    const placeholders = recordtoCreateDtos
      .map(() => `(${keys.map(() => `?`).join(', ')})`)
      .join(', ')
    const query = `INSERT INTO ${this.name} (${keys.join(', ')}) VALUES ${placeholders}`
    this.db.prepare(query).run(values)
    const persistedRecords = recordtoCreateDtos.map((record) =>
      this.db.prepare(`SELECT * FROM ${this.name} WHERE id = ?`).get(record.id)
    ) as PersistedDto[]
    return persistedRecords.map(this.postprocess)
  }

  update = async (record: ToUpdateDto): Promise<PersistedDto> => {
    const keys = Object.keys(record)
    const values = this.preprocess(Object.values(record))
    const setString = keys.map((key) => `${key} = ?`).join(', ')
    const query = `UPDATE ${this.name} SET ${setString} WHERE id = ${record.id}`
    this.db.prepare(query).run(values)
    const persistedRecord = this.db
      .prepare(`SELECT * FROM ${this.name} WHERE id = ?`)
      .get(record.id) as PersistedDto
    return this.postprocess(persistedRecord)
  }

  delete = async (filters: FilterDto[]): Promise<void> => {
    const conditions = filters.map((filter) => `${filter.field} ${filter.operator} ?`).join(' AND ')
    const values = filters.map((filter) => filter.value)
    const query = `DELETE FROM ${this.name} ${conditions.length > 0 ? `WHERE ${conditions}` : ''}`
    this.db.prepare(query).run(values)
  }

  read = async (filters: FilterDto[]): Promise<PersistedDto | undefined> => {
    const conditions = filters.map((filter) => `${filter.field} ${filter.operator} ?`).join(' AND ')
    const values = filters.map((filter) => filter.value)
    const query = `SELECT * FROM ${this.name} ${conditions.length > 0 ? `WHERE ${conditions}` : ''} LIMIT 1`
    const record = this.db.prepare(query).get(values) as PersistedDto | undefined
    return record ? this.postprocess(record) : undefined
  }

  readById = async (id: string): Promise<PersistedDto | undefined> => {
    const query = `SELECT * FROM ${this.name} WHERE id = ?`
    const record = this.db.prepare(query).get([id]) as PersistedDto | undefined
    return record ? this.postprocess(record) : undefined
  }

  list = async (filters: FilterDto[]): Promise<PersistedDto[]> => {
    const conditions = filters.map((filter) => `${filter.field} ${filter.operator} ?`).join(' AND ')
    const values = filters.map((filter) => filter.value)
    const query = `SELECT * FROM ${this.name} ${conditions.length > 0 ? `WHERE ${conditions}` : ''}`
    const records = this.db.prepare(query).all(values) as PersistedDto[]
    return records.map(this.postprocess)
  }
}
