import pg from 'pg'
import type { Driver } from '@adapter/spi/DatabaseTableSpi'
import type { FilterDto } from '@adapter/spi/dtos/FilterDto'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'
import type { PersistedDto, ToCreateDto, ToUpdateDto } from '@adapter/spi/dtos/RecordDto'
import type { DataType } from '@domain/entities/Record/ToCreate'

interface ColumnInfo {
  name: string
  type: string
  notnull: number
}

export class PostgresTableDriver implements Driver {
  constructor(
    private _name: string,
    private _fields: FieldDto[],
    private _db: pg.Pool
  ) {}

  exists = async () => {
    const result = await this._db.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1`,
      [this._name]
    )
    return result.rows.length > 0
  }

  create = async () => {
    const tableColumns = this._buildColumnsQuery(this._fields)
    const tableQuery = `CREATE TABLE ${this._name} (${tableColumns})`
    await this._db.query(tableQuery)
    await this._createManyToManyTables()
    await this._createView()
  }

  migrate = async () => {
    const existingColumns = await this._getExistingColumns()
    const staticFields = this._fields.filter((field) => !this._isViewField(field))
    const fieldsToAdd = staticFields.filter(
      (field) => !existingColumns.some((column) => column.name === field.name)
    )
    const fieldsToAlter = staticFields.filter((field) => {
      const existingColumn = existingColumns.find((column) => column.name === field.name)
      if (!existingColumn) return false
      return (
        existingColumn.type !== field.type || existingColumn.notnull !== (field.required ? 1 : 0)
      )
    })
    const dropViewQuery = `DROP VIEW IF EXISTS ${this._name}_view`
    await this._db.query(dropViewQuery)
    for (const field of fieldsToAdd) {
      const [column, reference] = this._buildColumnsQuery([field]).split(',')
      const query = `ALTER TABLE ${this._name} ADD COLUMN ${column}`
      this._db.query(query)
      if (reference) {
        this._db.query(`ALTER TABLE ${this._name} ADD CONSTRAINT fk_${field.name} ${reference}`)
      }
    }
    for (const field of fieldsToAlter) {
      const query = `ALTER TABLE ${this._name} ALTER COLUMN ${field.name} TYPE ${field.type}`
      await this._db.query(query)
    }
    await this._createManyToManyTables()
    await this._createView()
  }

  insert = async (record: ToCreateDto) => {
    try {
      const { staticFields, manyToManyFields } = this._splitFields(record)
      const keys = Object.keys(staticFields)
      const values = Object.values(staticFields)
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
      const query = `INSERT INTO ${this._name} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`
      await this._db.query(query, values)
      if (manyToManyFields) {
        await this._insertManyToManyFields(record.id, manyToManyFields)
      }
    } catch (e) {
      this._throwError(e)
    }
  }

  insertMany = async (records: ToCreateDto[]) => {
    try {
      for (const record of records) await this.insert(record)
    } catch (e) {
      this._throwError(e)
    }
  }

  update = async (record: ToUpdateDto) => {
    try {
      const { staticFields, manyToManyFields } = this._splitFields(record)
      const keys = Object.keys(staticFields)
      const values = Object.values(staticFields)
      const setString = keys.map((key, i) => `${key} = $${i + 1}`).join(', ')
      const query = `UPDATE ${this._name} SET ${setString} WHERE id = $${keys.length + 1} RETURNING *`
      values.push(record.id)
      await this._db.query(query, values)
      if (manyToManyFields) {
        await this._updateManyToManyFields(record.id, manyToManyFields)
      }
    } catch (e) {
      this._throwError(e)
    }
  }

  updateMany = async (records: ToUpdateDto[]) => {
    try {
      for (const record of records) await this.update(record)
    } catch (e) {
      this._throwError(e)
    }
  }

  delete = async (filters: FilterDto[]) => {
    try {
      const conditions = filters
        .map((filter, i) => `${filter.field} ${filter.operator} $${i + 1}`)
        .join(' AND ')
      const values = filters.map((filter) => filter.value)
      const query = `DELETE FROM ${this._name} ${conditions.length > 0 ? `WHERE ${conditions}` : ''}`
      await this._db.query(query, values)
    } catch (e) {
      this._throwError(e)
    }
  }

  read = async (filters: FilterDto[]) => {
    const conditions = filters
      .map((filter, i) => `${filter.field} ${filter.operator} $${i + 1}`)
      .join(' AND ')
    const values = filters.map((filter) => filter.value)
    const query = `SELECT * FROM ${this._name}_view ${conditions.length > 0 ? `WHERE ${conditions}` : ''} LIMIT 1`
    const result = await this._db.query<PersistedDto>(query, values)
    return result.rows[0]
  }

  readById = async (id: string) => {
    const query = `SELECT * FROM ${this._name}_view WHERE id = $1`
    const result = await this._db.query<PersistedDto>(query, [id])
    return result.rows[0]
  }

  list = async (filters: FilterDto[]) => {
    const conditions = filters
      .map((filter, i) => `${filter.field} ${filter.operator} $${i + 1}`)
      .join(' AND ')
    const values = filters.map((filter) => filter.value)
    const query = `SELECT * FROM ${this._name}_view ${conditions.length > 0 ? `WHERE ${conditions}` : ''}`
    const result = await this._db.query<PersistedDto>(query, values)
    return result.rows
  }

  private _buildColumnsQuery = (fields: FieldDto[]) => {
    const columns = []
    const references = []
    for (const field of fields) {
      if (this._isViewField(field)) continue
      let query = `"${field.name}" ${field.type}`
      if (field.name === 'id') {
        query += ' PRIMARY KEY'
      } else if (field.options) {
        query += ` CHECK ("${field.name}" IN ('${field.options.join("', '")}'))`
      } else if (field.table) {
        references.push(`FOREIGN KEY ("${field.name}") REFERENCES ${field.table}(id)`)
      }
      if (field.required) {
        query += ' NOT NULL'
      }
      columns.push(query)
    }
    columns.push(...references)
    return columns.join(', ')
  }

  private _getManyToManyTableName = (tableName: string) => {
    return [this._name, tableName].sort().join('_')
  }

  private _createManyToManyTables = async () => {
    for (const field of this._fields) {
      if (field.type === 'TEXT[]' && field.table) {
        const manyToManyTableName = this._getManyToManyTableName(field.table)
        const query = `
          CREATE TABLE IF NOT EXISTS ${manyToManyTableName} (
            "${this._name}_id" TEXT NOT NULL,
            "${field.table}_id" TEXT NOT NULL,
            FOREIGN KEY ("${this._name}_id") REFERENCES ${this._name}(id),
            FOREIGN KEY ("${field.table}_id") REFERENCES ${field.table}(id)
          )
        `
        await this._db.query(query)
      }
    }
  }

  private _splitFields = (record: ToCreateDto | ToUpdateDto) => {
    const staticFields: { [key: string]: DataType } = {}
    const manyToManyFields: { [key: string]: string[] } = {}
    for (const [key, value] of Object.entries(record)) {
      const field = this._fields.find((f) => f.name === key)
      if (field?.type === 'TEXT[]' && field.table && Array.isArray(value)) {
        manyToManyFields[key] = value
      } else {
        staticFields[key] = value
      }
    }
    return { staticFields, manyToManyFields }
  }

  private _insertManyToManyFields = async (
    recordId: string,
    manyToManyFields: { [key: string]: string[] }
  ) => {
    for (const [fieldName, ids] of Object.entries(manyToManyFields)) {
      const field = this._fields.find((f) => f.name === fieldName)
      const tableName = field?.table
      if (!tableName) throw new Error('Table name not found.')
      const manyToManyTableName = this._getManyToManyTableName(tableName)
      for (const id of ids) {
        const query = `INSERT INTO ${manyToManyTableName} ("${this._name}_id", "${tableName}_id") VALUES ($1, $2)`
        await this._db.query(query, [recordId, id])
      }
    }
  }

  private _updateManyToManyFields = async (
    recordId: string,
    manyToManyFields: { [key: string]: string[] }
  ) => {
    for (const [fieldName, ids] of Object.entries(manyToManyFields)) {
      const field = this._fields.find((f) => f.name === fieldName)
      const tableName = field?.table
      if (!tableName) throw new Error('Table name not found.')
      const manyToManyTableName = this._getManyToManyTableName(tableName)
      const deleteQuery = `DELETE FROM ${manyToManyTableName} WHERE "${this._name}_id" = $1`
      await this._db.query(deleteQuery, [recordId])
      for (const id of ids) {
        const query = `INSERT INTO ${manyToManyTableName} ("${this._name}_id", "${tableName}_id") VALUES ($1, $2)`
        await this._db.query(query, [recordId, id])
      }
    }
  }

  private _isViewField = (field: FieldDto) => {
    return field.formula || (field.type === 'TEXT[]' && field.table)
  }

  private _createView = async () => {
    const columns = this._fields
      .map((field) => {
        if (field.formula) {
          const expandedFormula = this._fields.reduce((acc, f) => {
            const regex = new RegExp(`\\b${f.name}\\b`, 'g')
            return acc.replace(regex, f.formula ? `(${f.formula})` : `"${f.name}"`)
          }, field.formula)
          return `CAST(${expandedFormula} AS ${field.type.toUpperCase()}) AS "${field.name}"`
        } else if (field.type === 'TEXT[]' && field.table) {
          return `(SELECT ARRAY_AGG("${field.table}_id") FROM ${this._getManyToManyTableName(field.table)} WHERE "${this._name}_id" = ${this._name}.id) AS "${field.name}"`
        } else {
          return `"${field.name}"`
        }
      })
      .join(', ')
    const query = `CREATE VIEW ${this._name}_view AS SELECT ${columns} FROM ${this._name}`
    await this._db.query(query)
  }

  private _getExistingColumns = async (): Promise<ColumnInfo[]> => {
    const result = await this._db.query(
      `SELECT column_name as name, data_type as type, is_nullable as notnull FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
      [this._name]
    )
    return result.rows
  }

  private _throwError = (error: unknown) => {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      'detail' in error &&
      typeof error.code === 'string' &&
      typeof error.detail === 'string'
    ) {
      if (error.code === '23503') {
        throw new Error(error.detail)
      }
    }
    console.error(error)
    throw error
  }
}
