import SQLite from 'better-sqlite3'
import type { Driver } from '@adapter/spi/DatabaseTableSpi'
import type { FilterDto } from '@adapter/spi/dtos/FilterDto'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'
import type { PersistedDto, ToCreateDto, ToUpdateDto } from '@adapter/spi/dtos/RecordDto'

interface ColumnInfo {
  name: string
  type: string
  notnull: number
}

export class SqliteTableDriver implements Driver {
  constructor(
    private _name: string,
    private _db: SQLite.Database
  ) {}

  exists = async () => {
    const result = this._db
      .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name = ?`)
      .all(this._name)
    return result.length > 0
  }

  create = async (fields: FieldDto[]) => {
    const columns = fields.map(this._buildColumnQuery).join(', ')
    const query = `CREATE TABLE ${this._name} (${columns})`
    this._db.exec(query)
  }

  fieldExists = async (name: string) => {
    const fields = this._db.prepare(`PRAGMA table_info(${this._name})`).all() as ColumnInfo[]
    return fields.some((field: ColumnInfo) => field.name === name)
  }

  addField = async (field: FieldDto) => {
    const query = `ALTER TABLE ${this._name} ADD COLUMN ${this._buildColumnQuery(field)}`
    this._db.exec(query)
  }

  alterField = async (field: FieldDto) => {
    this._alterTable((fields) => {
      return fields.map((f) => (f.name === field.name ? field : f))
    })
  }

  dropField = async (name: string) => {
    this._alterTable((fields) => {
      return fields.filter((f) => f.name !== name)
    })
  }

  drop = async () => {
    const query = `DROP TABLE ${this._name}`
    this._db.exec(query)
  }

  insert = async (recordtoCreateDto: ToCreateDto): Promise<PersistedDto> => {
    const keys = Object.keys(recordtoCreateDto)
    const values = this._preprocess(Object.values(recordtoCreateDto))
    const placeholders = keys.map(() => `?`).join(', ')
    const query = `INSERT INTO ${this._name} (${keys.join(', ')}) VALUES (${placeholders})`
    this._db.prepare(query).run(values)
    const persistedRecord = this._db
      .prepare(`SELECT * FROM ${this._name} WHERE id = ?`)
      .get(recordtoCreateDto.id) as PersistedDto
    return this._postprocess(persistedRecord)
  }

  insertMany = async (recordtoCreateDtos: ToCreateDto[]): Promise<PersistedDto[]> => {
    if (recordtoCreateDtos.length === 0) return []
    const keys = Object.keys(recordtoCreateDtos[0])
    const values = this._preprocess(recordtoCreateDtos.map(Object.values).flat())
    const placeholders = recordtoCreateDtos
      .map(() => `(${keys.map(() => `?`).join(', ')})`)
      .join(', ')
    const query = `INSERT INTO ${this._name} (${keys.join(', ')}) VALUES ${placeholders}`
    this._db.prepare(query).run(values)
    const persistedRecords = recordtoCreateDtos.map((record) =>
      this._db.prepare(`SELECT * FROM ${this._name} WHERE id = ?`).get(record.id)
    ) as PersistedDto[]
    return persistedRecords.map(this._postprocess)
  }

  update = async (record: ToUpdateDto): Promise<PersistedDto> => {
    const keys = Object.keys(record)
    const values = this._preprocess(Object.values(record))
    const setString = keys.map((key) => `${key} = ?`).join(', ')
    const query = `UPDATE ${this._name} SET ${setString} WHERE id = ${record.id}`
    this._db.prepare(query).run(values)
    const persistedRecord = this._db
      .prepare(`SELECT * FROM ${this._name} WHERE id = ?`)
      .get(record.id) as PersistedDto
    return this._postprocess(persistedRecord)
  }

  delete = async (filters: FilterDto[]): Promise<void> => {
    const conditions = filters.map((filter) => `${filter.field} ${filter.operator} ?`).join(' AND ')
    const values = filters.map((filter) => filter.value)
    const query = `DELETE FROM ${this._name} ${conditions.length > 0 ? `WHERE ${conditions}` : ''}`
    this._db.prepare(query).run(values)
  }

  read = async (filters: FilterDto[]): Promise<PersistedDto | undefined> => {
    const conditions = filters.map((filter) => `${filter.field} ${filter.operator} ?`).join(' AND ')
    const values = filters.map((filter) => filter.value)
    const query = `SELECT * FROM ${this._name} ${conditions.length > 0 ? `WHERE ${conditions}` : ''} LIMIT 1`
    const record = this._db.prepare(query).get(values) as PersistedDto | undefined
    return record ? this._postprocess(record) : undefined
  }

  readById = async (id: string): Promise<PersistedDto | undefined> => {
    const query = `SELECT * FROM ${this._name} WHERE id = ?`
    const record = this._db.prepare(query).get([id]) as PersistedDto | undefined
    return record ? this._postprocess(record) : undefined
  }

  list = async (filters: FilterDto[]): Promise<PersistedDto[]> => {
    const conditions = filters.map((filter) => `${filter.field} ${filter.operator} ?`).join(' AND ')
    const values = filters.map((filter) => filter.value)
    const query = `SELECT * FROM ${this._name} ${conditions.length > 0 ? `WHERE ${conditions}` : ''}`
    const records = this._db.prepare(query).all(values) as PersistedDto[]
    return records.map(this._postprocess)
  }

  private _buildColumnQuery = (field: FieldDto) => {
    let query = `"${field.name}" ${field.type}`
    if (field.formula) {
      query += ` GENERATED ALWAYS AS (${field.formula}) STORED`
    }
    if (field.options) {
      query += ` CHECK ("${field.name}" IN ('${field.options.join("', '")}'))`
    }
    if (field.required) {
      query += ' NOT NULL'
    }
    return query
  }

  private _preprocess = (values: (string | number | Date | boolean | undefined)[]) => {
    return values.map((value) => {
      if (value instanceof Date) {
        return value.getTime()
      }
      return value
    })
  }

  private _postprocess = (persistedRecord: PersistedDto) => {
    return Object.keys(persistedRecord).reduce((acc: PersistedDto, key) => {
      const value = persistedRecord[key]
      if (value instanceof Date) {
        acc[key] = new Date(value)
      }
      return acc
    }, persistedRecord)
  }

  private _alterTable = (transformFields: (fields: FieldDto[]) => FieldDto[]) => {
    const oldFields = this._db.prepare(`PRAGMA table_info(${this._name})`).all() as ColumnInfo[]
    const oldFieldNames = oldFields.map((f) => f.name)
    const newFields = transformFields(oldFields as unknown as FieldDto[])
    const newColumns = newFields.map(this._buildColumnQuery).join(', ')
    const newTableName = `${this._name}_new`
    this._db.exec(`CREATE TABLE ${newTableName} (${newColumns})`)
    const oldColumnList = oldFieldNames.join(', ')
    const newColumnList = newFields.map((f) => f.name).join(', ')
    this._db.exec(
      `INSERT INTO ${newTableName} (${newColumnList}) SELECT ${oldColumnList} FROM ${this._name}`
    )
    this._db.exec(`DROP TABLE ${this._name}`)
    this._db.exec(`ALTER TABLE ${newTableName} RENAME TO ${this._name}`)
  }
}
