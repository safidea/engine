import pg from 'pg'
import type { Driver } from '@adapter/spi/DatabaseTableSpi'
import type { FilterDto } from '@adapter/spi/dtos/FilterDto'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'
import type { PersistedDto, ToCreateDto, ToUpdateDto } from '@adapter/spi/dtos/RecordDto'

export class PostgresTableDriver implements Driver {
  constructor(
    private _name: string,
    private _db: pg.Pool
  ) {}

  exists = async () => {
    const result = await this._db.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1`,
      [this._name]
    )
    return result.rows.length > 0
  }

  create = async (fields: FieldDto[]) => {
    const tableColumns = this._buildColumnsQuery(fields)
    const tableQuery = `CREATE TABLE ${this._name} (${tableColumns})`
    await this._db.query(tableQuery)
    await this._createView(fields)
  }

  migrate = async (fields: FieldDto[]) => {
    const existingColumns = await this._getExistingColumns()
    const staticFields = fields.filter((field) => !field.formula)
    const fieldsToAdd = staticFields.filter((field) => !existingColumns.includes(field.name))
    const fieldsToAlter = staticFields.filter((field) => existingColumns.includes(field.name))
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
    await this._createView(fields)
  }

  insert = async (recordtoCreateDto: ToCreateDto) => {
    try {
      const keys = Object.keys(recordtoCreateDto)
      const values = Object.values(recordtoCreateDto)
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
      const query = `INSERT INTO ${this._name} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`
      await this._db.query(query, values)
    } catch (e) {
      this._throwError(e)
    }
  }

  insertMany = async (recordtoCreateDtos: ToCreateDto[]) => {
    try {
      const keys = Object.keys(recordtoCreateDtos[0])
      const values = recordtoCreateDtos.map(Object.values).flat()
      const placeholders = recordtoCreateDtos
        .map((_, i) => `(${keys.map((_, j) => `$${i * keys.length + j + 1}`).join(', ')})`)
        .join(', ')
      const query = `INSERT INTO ${this._name} (${keys.join(', ')}) VALUES ${placeholders} RETURNING *`
      await this._db.query(query, values)
    } catch (e) {
      this._throwError(e)
    }
  }

  update = async (record: ToUpdateDto) => {
    try {
      const keys = Object.keys(record)
      const values = Object.values(record)
      const setString = keys.map((key, i) => `${key} = $${i + 1}`).join(', ')
      const query = `UPDATE ${this._name} SET ${setString} WHERE id = $${keys.length + 1} RETURNING *`
      values.push(record.id)
      await this._db.query(query, values)
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
      if (field.formula) continue
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

  private _createView = async (fields: FieldDto[]) => {
    const columns = fields
      .map((field) => {
        if (field.formula) {
          const expandedFormula = fields.reduce((acc, f) => {
            const regex = new RegExp(`\\b${f.name}\\b`, 'g')
            return acc.replace(regex, f.formula ? `(${f.formula})` : `"${f.name}"`)
          }, field.formula)
          return `CAST(${expandedFormula} AS ${field.type.toUpperCase()}) AS "${field.name}"`
        } else {
          return `"${field.name}"`
        }
      })
      .join(', ')
    const query = `CREATE VIEW ${this._name}_view AS SELECT ${columns} FROM ${this._name}`
    await this._db.query(query)
  }

  private _getExistingColumns = async (): Promise<string[]> => {
    const result = await this._db.query(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
      [this._name]
    )
    return result.rows.map((row) => row.column_name)
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
