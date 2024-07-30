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
    const tableColumns = fields
      .map(this._buildColumnQuery)
      .filter((q) => !!q)
      .join(', ')
    const tableQuery = `CREATE TABLE ${this._name} (${tableColumns})`
    this._db.exec(tableQuery)
    await this._createView(fields)
  }

  migrate = async (fields: FieldDto[]) => {
    const existingColumns = await this._getExistingColumns()
    const staticFields = fields.filter((field) => !field.formula)
    const fieldsToAdd = staticFields.filter((field) => !existingColumns.includes(field.name))
    const fieldsToAlter = staticFields.filter((field) => existingColumns.includes(field.name))
    const dropViewQuery = `DROP VIEW IF EXISTS ${this._name}_view`
    this._db.exec(dropViewQuery)
    for (const field of fieldsToAdd) {
      const query = `ALTER TABLE ${this._name} ADD COLUMN ${this._buildColumnQuery(field)}`
      this._db.exec(query)
    }
    if (fieldsToAlter.length > 0) {
      const tempTableName = `${this._name}_temp`
      const newSchema = staticFields.map((field) => this._buildColumnQuery(field)).join(', ')
      this._db.exec(`CREATE TABLE ${tempTableName} (${newSchema})`)
      const columnsToCopy = staticFields.map((field) => field.name).join(', ')
      this._db.exec(
        `INSERT INTO ${tempTableName} (${columnsToCopy}) SELECT ${columnsToCopy} FROM ${this._name}`
      )
      this._db.exec(`DROP TABLE ${this._name}`)
      this._db.exec(`ALTER TABLE ${tempTableName} RENAME TO ${this._name}`)
    }
    await this._createView(fields)
  }

  insert = async (record: ToCreateDto) => {
    const keys = Object.keys(record)
    const values = this._preprocess(Object.values(record))
    const placeholders = keys.map(() => `?`).join(', ')
    const query = `INSERT INTO ${this._name} (${keys.join(', ')}) VALUES (${placeholders})`
    this._db.prepare(query).run(values)
  }

  insertMany = async (records: ToCreateDto[]) => {
    const keys = Object.keys(records[0])
    const values = this._preprocess(records.map(Object.values).flat())
    const placeholders = records.map(() => `(${keys.map(() => `?`).join(', ')})`).join(', ')
    const query = `INSERT INTO ${this._name} (${keys.join(', ')}) VALUES ${placeholders}`
    this._db.prepare(query).run(values)
  }

  update = async (record: ToUpdateDto) => {
    const keys = Object.keys(record)
    const values = this._preprocess(Object.values(record))
    const setString = keys.map((key) => `${key} = ?`).join(', ')
    const query = `UPDATE ${this._name} SET ${setString} WHERE id = ${record.id}`
    this._db.prepare(query).run(values)
  }

  delete = async (filters: FilterDto[]) => {
    const conditions = filters.map((filter) => `${filter.field} ${filter.operator} ?`).join(' AND ')
    const values = filters.map((filter) => filter.value)
    const query = `DELETE FROM ${this._name} ${conditions.length > 0 ? `WHERE ${conditions}` : ''}`
    this._db.prepare(query).run(values)
  }

  read = async (filters: FilterDto[]) => {
    const conditions = filters.map((filter) => `${filter.field} ${filter.operator} ?`).join(' AND ')
    const values = filters.map((filter) => filter.value)
    const query = `SELECT * FROM ${this._name}_view ${conditions.length > 0 ? `WHERE ${conditions}` : ''} LIMIT 1`
    const record = this._db.prepare(query).get(values) as PersistedDto | undefined
    return record ? this._postprocess(record) : undefined
  }

  readById = async (id: string) => {
    const query = `SELECT * FROM ${this._name}_view WHERE id = ?`
    const record = this._db.prepare(query).get([id]) as PersistedDto | undefined
    return record ? this._postprocess(record) : undefined
  }

  list = async (filters: FilterDto[]) => {
    const conditions = filters.map((filter) => `${filter.field} ${filter.operator} ?`).join(' AND ')
    const values = filters.map((filter) => filter.value)
    const query = `SELECT * FROM ${this._name}_view ${conditions.length > 0 ? `WHERE ${conditions}` : ''}`
    const records = this._db.prepare(query).all(values) as PersistedDto[]
    return records.map(this._postprocess)
  }

  private _buildColumnQuery = (field: FieldDto): string | undefined => {
    if (field.formula) return
    let query = `"${field.name}" ${field.type}`
    if (field.options) {
      query += ` CHECK ("${field.name}" IN ('${field.options.join("', '")}'))`
    }
    if (field.required) {
      query += ' NOT NULL'
    }
    return query
  }

  private _getExistingColumns = async (): Promise<string[]> => {
    const fields = this._db.prepare(`PRAGMA table_info(${this._name})`).all() as ColumnInfo[]
    return fields.map((field) => field.name)
  }

  private _createView = async (fields: FieldDto[]) => {
    const columns = fields
      .map((field) => {
        if (field.formula) {
          const expandedFormula = fields.reduce((acc, f) => {
            const regex = new RegExp(`\\b${f.name}\\b`, 'g')
            return acc.replace(regex, f.formula ? `(${f.formula})` : `"${f.name}"`)
          }, field.formula)
          return `${expandedFormula} AS "${field.name}"`
        } else {
          return `"${field.name}"`
        }
      })
      .join(', ')
    const query = `CREATE VIEW ${this._name}_view AS SELECT ${columns} FROM ${this._name}`
    this._db.exec(query)
  }

  private _preprocess = (values: (string | number | Date | boolean | undefined)[]) => {
    return values.map((value) => {
      if (value instanceof Date) {
        return value.getTime()
      }
      return value
    })
  }

  private _postprocess = (persistedRecord: PersistedDto): PersistedDto => {
    return Object.keys(persistedRecord).reduce((acc: PersistedDto, key) => {
      const value = persistedRecord[key]
      if (value instanceof Date) {
        acc[key] = new Date(value)
      }
      return acc
    }, persistedRecord)
  }
}
