import pg from 'pg'
import type { Driver } from '@adapter/spi/drivers/DatabaseTableSpi'
import type { FilterDto } from '@adapter/spi/dtos/FilterDto'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'
import type {
  CreatedRecordDto,
  PersistedRecordDto,
  UpdatedRecordDto,
} from '@adapter/spi/dtos/RecordDto'
import type { BaseRecordFields, RecordFieldType } from '@domain/entities/Record/base'

interface ColumnInfo {
  name: string
  type: string
  notnull: number
}

export class PostgreSQLTableDriver implements Driver {
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
  }

  migrate = async () => {
    const existingColumns = await this._getExistingColumns()
    const staticFields = this._fields.filter((field) => !this._isViewField(field))
    const fieldsToAdd = staticFields.filter(
      (field) =>
        !existingColumns.some(
          (column) =>
            column.name === field.name ||
            (field.onMigration && field.onMigration.replace === column.name)
        )
    )
    const fieldsToAlter = staticFields.filter((field) => {
      const existingColumn = existingColumns.find(
        (column) =>
          column.name === field.name ||
          (field.onMigration && field.onMigration.replace === column.name)
      )
      if (!existingColumn) return false
      return (
        existingColumn.type !== field.type ||
        existingColumn.notnull !== (field.required ? 1 : 0) ||
        (field.onMigration && field.onMigration.replace)
      )
    })
    for (const field of fieldsToAdd) {
      const [column, reference] = this._buildColumnsQuery([field]).split(',')
      const query = `ALTER TABLE ${this._name} ADD COLUMN ${column}`
      this._db.query(query)
      if (reference) {
        this._db.query(`ALTER TABLE ${this._name} ADD CONSTRAINT fk_${field.name} ${reference}`)
      }
    }
    for (const field of fieldsToAlter) {
      if (field.onMigration && field.onMigration.replace) {
        const existingColumnWithNewName = existingColumns.find(
          (column) => column.name === field.name
        )
        if (!existingColumnWithNewName) {
          const renameQuery = `ALTER TABLE ${this._name} RENAME COLUMN ${field.onMigration.replace} TO ${field.name}`
          await this._db.query(renameQuery)
        }
      }
      const query = `ALTER TABLE ${this._name} ALTER COLUMN ${field.name} TYPE ${field.type}`
      await this._db.query(query)
    }
    await this._createManyToManyTables()
  }

  dropView = async () => {
    const query = `DROP VIEW IF EXISTS ${this._name}_view`
    await this._db.query(query)
  }

  createView = async () => {
    let joins = ''
    const columns = this._fields
      .map((field) => {
        if (field.formula) {
          if (field.table && field.tableField) {
            const values = `${field.table}_view.${field.tableField}`
            const formula = this._convertFormula(field.formula, values)
            const manyToManyTableName = this._getManyToManyTableName(field.table)
            if (!joins.includes(manyToManyTableName)) {
              joins += ` JOIN ${manyToManyTableName} ON ${this._name}.id = ${manyToManyTableName}.${this._name}_id`
              joins += ` JOIN ${field.table}_view ON ${manyToManyTableName}.${field.table}_id = ${field.table}_view.id`
            }
            return `CAST(${formula} AS ${field.type}) AS "${field.name}"`
          } else {
            const expandedFormula = this._fields.reduce((acc, f) => {
              const regex = new RegExp(`\\b${f.name}\\b`, 'g')
              return acc.replace(regex, f.formula ? `(${f.formula})` : `"${f.name}"`)
            }, field.formula)
            return `CAST(${expandedFormula} AS ${field.type.toUpperCase()}) AS "${field.name}"`
          }
        } else if (field.type === 'TEXT[]' && field.table) {
          return `(SELECT ARRAY_AGG("${field.table}_id") FROM ${this._getManyToManyTableName(field.table)} WHERE "${this._name}_id" = ${this._name}.id) AS "${field.name}"`
        } else {
          return `${this._name}.${field.name} AS "${field.name}"`
        }
      })
      .join(', ')
    let query = `CREATE VIEW ${this._name}_view AS SELECT ${columns} FROM ${this._name}`
    if (joins) query += joins + ` GROUP BY ${this._name}.id`
    await this._db.query(query)
  }

  insert = async (record: CreatedRecordDto) => {
    try {
      const { created_at, ...rest } = record
      const preprocessedFields = this._preprocess(rest)
      const { staticFields, manyToManyFields } = this._splitFields({
        created_at,
        ...preprocessedFields,
      })
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

  insertMany = async (records: CreatedRecordDto[]) => {
    try {
      for (const record of records) await this.insert(record)
    } catch (e) {
      this._throwError(e)
    }
  }

  update = async (record: UpdatedRecordDto) => {
    try {
      const { updated_at, ...rest } = record
      const preprocessedFields = this._preprocess(rest)
      const { staticFields, manyToManyFields } = this._splitFields({
        updated_at,
        ...preprocessedFields,
      })
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

  updateMany = async (records: UpdatedRecordDto[]) => {
    try {
      for (const record of records) await this.update(record)
    } catch (e) {
      this._throwError(e)
    }
  }

  delete = async (id: string) => {
    try {
      const values = [id]
      const query = `DELETE FROM ${this._name} WHERE id = $1`
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
    const result = await this._db.query<PersistedRecordDto>(query, values)
    return result.rows[0]
  }

  readById = async (id: string) => {
    const query = `SELECT * FROM ${this._name}_view WHERE id = $1`
    const result = await this._db.query<PersistedRecordDto>(query, [id])
    return result.rows[0]
  }

  list = async (filters: FilterDto[]) => {
    let index = 1
    const conditions = filters
      .map((filter) => {
        if (filter.operator === 'in') {
          const placeholders = filter.value.map(() => `$${index++}`).join(',')
          return `${filter.field} ${filter.operator} (${placeholders})`
        } else {
          return `${filter.field} ${filter.operator} $${index++}`
        }
      })
      .join(' AND ')
    const values = filters.reduce((acc: (string | number)[], filter) => {
      if (filter.operator === 'in') acc.push(...filter.value)
      else acc.push(filter.value)
      return acc
    }, [])
    const query = `SELECT * FROM ${this._name}_view ${conditions.length > 0 ? `WHERE ${conditions}` : ''}`
    const result = await this._db.query<PersistedRecordDto>(query, values)
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

  private _splitFields = (record: CreatedRecordDto | UpdatedRecordDto) => {
    const staticFields: { [key: string]: RecordFieldType } = {}
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

  private _convertFormula(formula: string, values: string) {
    const patterns = [
      { pattern: /CONCAT\(values\)/g, replacement: "STRING_AGG(values, ',')" },
      { pattern: /CONCAT\(values, '([^']*)'\)/g, replacement: "STRING_AGG(values, '$1')" },
    ]
    patterns.forEach(({ pattern, replacement }) => {
      formula = formula.replace(pattern, replacement)
    })
    return formula.replace(/\bvalues\b/g, values)
  }

  private _getExistingColumns = async (): Promise<ColumnInfo[]> => {
    const result = await this._db.query(
      `SELECT column_name as name, data_type as type, is_nullable as notnull FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
      [this._name]
    )
    return result.rows
  }

  private _preprocess = (record: BaseRecordFields): BaseRecordFields => {
    return Object.keys(record).reduce((acc: BaseRecordFields, key) => {
      const value = record[key]
      const field = this._fields.find((f) => f.name === key)
      if (!field) throw new Error('Field not found.')
      if (!value) return acc
      if (field.type === 'TIMESTAMP') {
        if (value instanceof Date) acc[key] = value
        else acc[key] = new Date(String(value))
      }
      return acc
    }, record)
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
