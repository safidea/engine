import { Database } from 'bun:sqlite'
import type { IDatabaseTableDriver } from '@adapter/spi/drivers/DatabaseTableSpi'
import type { FilterDto } from '@domain/entities/Filter'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'
import type { RecordFields, RecordFieldValue } from '@domain/entities/Record'
import type {
  PersistedRecordFieldsDto,
  RecordFieldsToCreateDto,
  RecordFieldsToUpdateDto,
} from '@adapter/spi/dtos/RecordDto'

interface ColumnInfo {
  name: string
  type: string
  required: number
}

type Row = {
  id: string
  created_at: number
  updated_at?: number
  [key: string]: RecordFieldValue
}

export class SQLiteDatabaseTableDriver implements IDatabaseTableDriver {
  constructor(
    private _name: string,
    private _fields: FieldDto[],
    private _db: Database
  ) {
    const [schema, table] = this._name.includes('.')
      ? this._name.split('.')
      : ['public', this._name]
    this._name = schema === 'public' ? table : `${schema}_${table}`
  }

  exists = async () => {
    const result = this._db
      .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name = ?`)
      .all(this._name)
    return result.length > 0
  }

  create = async () => {
    const tableColumns = this._buildColumnsQuery(this._fields)
    const tableQuery = `CREATE TABLE ${this._name} (${tableColumns})`
    this._db.exec(tableQuery)
    await this._createManyToManyTables()
  }

  migrate = async () => {
    const existingColumns = this._getExistingColumns()
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
        existingColumn.required !== (field.required ? 1 : 0) ||
        (field.onMigration && field.onMigration.replace)
      )
    })
    for (const field of fieldsToAdd) {
      const [column, reference] = this._buildColumnsQuery([field]).split(',')
      const query = `ALTER TABLE ${this._name} ADD COLUMN ${column}`
      this._db.exec(query)
      if (reference) {
        this._db.exec(`ALTER TABLE ${this._name} ADD CONSTRAINT fk_${field.name} ${reference}`)
      }
    }
    if (fieldsToAlter.length > 0) {
      const tempTableName = `${this._name}_temp`
      const newSchema = this._buildColumnsQuery(staticFields)
      this._db.exec(`DROP TABLE IF EXISTS ${tempTableName}`)
      this._db.exec(`CREATE TABLE ${tempTableName} (${newSchema})`)
      for (const field of fieldsToAlter) {
        if (field.onMigration && field.onMigration.replace) {
          const existingColumnWithNewName = existingColumns.find(
            (column) => column.name === field.name
          )
          if (!existingColumnWithNewName) {
            const renameQuery = `ALTER TABLE ${this._name} RENAME COLUMN ${field.onMigration.replace} TO ${field.name}`
            this._db.exec(renameQuery)
          }
        }
      }
      const columnsToCopy = staticFields.map((field) => field.name).join(', ')
      this._db.exec(`PRAGMA foreign_keys = OFF`)
      this._db.exec(
        `INSERT INTO ${tempTableName} (${columnsToCopy}) SELECT ${columnsToCopy} FROM ${this._name}`
      )
      this._db.exec(`DROP TABLE ${this._name}`)
      this._db.exec(`ALTER TABLE ${tempTableName} RENAME TO ${this._name}`)
      this._db.exec(`PRAGMA foreign_keys = ON`)
    }
    await this._createManyToManyTables()
  }

  dropView = async () => {
    const query = `DROP VIEW IF EXISTS ${this._name}_view`
    this._db.exec(query)
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
              joins += ` LEFT JOIN ${manyToManyTableName} ON ${this._name}.id = ${manyToManyTableName}.${this._name}_id`
              joins += ` LEFT JOIN ${field.table}_view ON ${manyToManyTableName}.${field.table}_id = ${field.table}_view.id`
            }
            return `CAST(${formula} AS ${field.type}) AS "${field.name}"`
          } else {
            const expandedFormula = this._fields.reduce((acc, f) => {
              const regex = new RegExp(`\\b${f.name}\\b`, 'g')
              return acc.replace(regex, f.formula ? `(${f.formula})` : `"${f.name}"`)
            }, field.formula)
            return `CAST(${expandedFormula} AS ${field.type}) AS "${field.name}"`
          }
        } else if (field.type === 'TEXT[]' && field.table) {
          return `(SELECT GROUP_CONCAT("${field.table}_id") FROM ${this._getManyToManyTableName(field.table)} WHERE "${this._name}_id" = ${this._name}.id) AS "${field.name}"`
        } else {
          return `${this._name}.${field.name} AS "${field.name}"`
        }
      })
      .join(', ')
    let query = `CREATE VIEW ${this._name}_view AS SELECT ${columns} FROM ${this._name}`
    if (joins) query += joins + ` GROUP BY ${this._name}.id`
    this._db.exec(query)
  }

  insert = async <T extends RecordFields>(record: RecordFieldsToCreateDto<T>) => {
    try {
      const { id, created_at, fields } = record
      const { staticFields, manyToManyFields } = this._splitFields({ id, created_at, ...fields })
      const preprocessedFields = this._preprocess(staticFields)
      const keys = Object.keys(preprocessedFields)
      const values = Object.values(preprocessedFields)
      const placeholders = keys.map(() => `?`).join(', ')
      const query = `INSERT INTO ${this._name} (${keys.join(', ')}) VALUES (${placeholders})`
      this._db.prepare(query).run(...values)
      if (manyToManyFields) {
        await this._insertManyToManyFields(record.id, manyToManyFields)
      }
    } catch (e) {
      this._throwError(e)
    }
  }

  insertMany = async <T extends RecordFields>(records: RecordFieldsToCreateDto<T>[]) => {
    try {
      for (const record of records) await this.insert<T>(record)
    } catch (e) {
      this._throwError(e)
    }
  }

  update = async <T extends RecordFields>(record: RecordFieldsToUpdateDto<T>) => {
    try {
      const { id, updated_at, fields } = record
      const { staticFields, manyToManyFields } = this._splitFields({ id, updated_at, ...fields })
      const preprocessedFields = this._preprocess(staticFields)
      const keys = Object.keys(preprocessedFields)
      const values = Object.values(preprocessedFields)
      const setString = keys.map((key) => `${key} = ?`).join(', ')
      const query = `UPDATE ${this._name} SET ${setString} WHERE id = ?`
      this._db.prepare(query).run(...values, record.id)
      if (manyToManyFields) {
        await this._updateManyToManyFields(record.id, manyToManyFields)
      }
    } catch (e) {
      this._throwError(e)
    }
  }

  updateMany = async <T extends RecordFields>(records: RecordFieldsToUpdateDto<T>[]) => {
    try {
      for (const record of records) await this.update<T>(record)
    } catch (e) {
      this._throwError(e)
    }
  }

  delete = async (id: string) => {
    try {
      const values = [id]
      const query = `DELETE FROM ${this._name} WHERE id = ?`
      this._db.prepare(query).run(...values)
    } catch (e) {
      this._throwError(e)
    }
  }

  read = async <T extends RecordFields>(filter: FilterDto) => {
    const { conditions, values } = this._convertFilterToConditions(filter)
    if (!conditions) return
    const query = `SELECT * FROM ${this._name}_view ${conditions.length > 0 ? `WHERE ${conditions}` : ''} LIMIT 1`
    const record = this._db.prepare(query).get(...values) as Row | undefined
    return record ? this._postprocess<T>(record) : undefined
  }

  readById = async <T extends RecordFields>(id: string) => {
    const query = `SELECT * FROM ${this._name}_view WHERE id = ?`
    const record = this._db.prepare(query).get(id) as Row | undefined
    return record ? this._postprocess<T>(record) : undefined
  }

  list = async <T extends RecordFields>(filter?: FilterDto) => {
    const { conditions, values } = filter
      ? this._convertFilterToConditions(filter)
      : { conditions: '', values: [] }
    if (!conditions) {
      const query = `SELECT * FROM ${this._name}_view`
      const records = this._db.prepare(query).all() as Row[]
      return records.map(this._postprocess<T>)
    }
    const query = `SELECT * FROM ${this._name}_view WHERE ${conditions}`
    const records = this._db.prepare(query).all(...values) as Row[]
    return records.map(this._postprocess<T>)
  }

  private _buildColumnsQuery = (fields: FieldDto[]) => {
    const columns = []
    const references = []
    for (const field of fields) {
      if (this._isViewField(field)) continue
      let query = `"${field.name}" ${field.type}`
      if (field.name === 'id') {
        query += ' PRIMARY KEY'
      } else if (field.type === 'TEXT' && field.options) {
        query += ` CHECK ("${field.name}" IN ('${field.options.join("', '")}'))`
      } else if (field.type === 'TEXT' && field.table) {
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
        this._db.exec(query)
      }
    }
  }

  private _isViewField = (field: FieldDto) => {
    return field.formula || (field.type === 'TEXT[]' && field.table)
  }

  private _splitFields = (row: Partial<Row>) => {
    const staticFields: { [key: string]: RecordFieldValue } = {}
    const manyToManyFields: { [key: string]: string[] } = {}
    for (const [key, value] of Object.entries(row)) {
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
        const query = `INSERT INTO ${manyToManyTableName} ("${this._name}_id", "${tableName}_id") VALUES (?, ?)`
        this._db.prepare(query).run(recordId, id)
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
      const deleteQuery = `DELETE FROM ${manyToManyTableName} WHERE "${this._name}_id" = ?`
      this._db.prepare(deleteQuery).run(recordId)
      for (const id of ids) {
        const query = `INSERT INTO ${manyToManyTableName} ("${this._name}_id", "${tableName}_id") VALUES (?, ?)`
        this._db.prepare(query).run(recordId, id)
      }
    }
  }

  private _getExistingColumns = (): ColumnInfo[] => {
    return this._db.prepare(`PRAGMA table_info(${this._name})`).all() as ColumnInfo[]
  }

  private _convertFormula = (formula: string, values: string) => {
    return formula.replace(/\bCONCAT\b/g, 'GROUP_CONCAT').replace(/\bvalues\b/g, values)
  }

  private _preprocess = (record: {
    [key: string]: RecordFieldValue
  }): {
    [key: string]: string | number | boolean | null
  } => {
    return Object.keys(record).reduce(
      (
        acc: {
          [key: string]: string | number | boolean | null
        },
        key
      ) => {
        const value = record[key]
        const field = this._fields.find((f) => f.name === key)
        if (value === undefined || value === null) {
          acc[key] = null
        } else if (field?.type === 'TIMESTAMP') {
          if (value instanceof Date) acc[key] = value.getTime()
          else acc[key] = new Date(String(value)).getTime()
        } else if (field?.type === 'BOOLEAN') {
          acc[key] = value ? 1 : 0
        } else {
          acc[key] = value as string | number | boolean
        }
        return acc
      },
      {}
    )
  }

  private _postprocess = <T extends RecordFields>(row: Row): PersistedRecordFieldsDto<T> => {
    const { id, created_at, updated_at, ...fieldsToProcess } = row
    const fields = Object.keys(fieldsToProcess).reduce((acc: RecordFields, key) => {
      const value = row[key]
      const field = this._fields.find((f) => f.name === key)
      if (value === undefined || value === null) return acc
      if (field?.type === 'TIMESTAMP') {
        acc[key] = new Date(Number(value))
      } else if (field?.type === 'TEXT[]' && typeof value === 'string') {
        acc[key] = value.split(',')
      } else if (field?.type === 'BOOLEAN') {
        acc[key] = value === 1
      }
      return acc
    }, fieldsToProcess) as T
    return {
      id,
      created_at: new Date(created_at),
      updated_at: updated_at ? new Date(updated_at) : undefined,
      fields,
    }
  }

  private _convertFilterToConditions = (
    filter: FilterDto
  ): { conditions: string; values: (string | number)[] } => {
    const values: (string | number)[] = []
    if ('and' in filter) {
      const conditions = filter.and.map((f) => {
        const { conditions, values: filterValues } = this._convertFilterToConditions(f)
        values.push(...filterValues)
        return `(${conditions})`
      })
      return { conditions: conditions.join(' AND '), values }
    } else if ('or' in filter) {
      const conditions = filter.or.map((f) => {
        const { conditions, values: filterValues } = this._convertFilterToConditions(f)
        values.push(...filterValues)
        return `(${conditions})`
      })
      return { conditions: conditions.join(' OR '), values }
    }
    const { operator, field } = filter
    const property = this._fields.find((f) => f.name === field)
    if (!property && field !== 'created_time' && field !== 'last_edited_time') {
      throw new Error(`Property "${field}" does not exist`)
    }
    switch (operator) {
      case 'Is':
        return {
          conditions: `"${filter.field}" = ?`,
          values: [filter.value],
        }
      case 'Contains':
        return {
          conditions: `"${filter.field}" LIKE ?`,
          values: [`%${filter.value}%`],
        }
      case 'Equals':
        return {
          conditions: `"${filter.field}" = ?`,
          values: [filter.value],
        }
      case 'IsAnyOf':
        return {
          conditions: `"${filter.field}" IN (${filter.value.map(() => '?').join(', ')})`,
          values: filter.value,
        }
      case 'OnOrAfter':
        return {
          conditions: `"${filter.field}" >= datetime(?)`,
          values: [filter.value],
        }
      case 'IsFalse':
        return {
          conditions: `"${filter.field}" = 0`,
          values: [],
        }
      case 'IsTrue':
        return {
          conditions: `"${filter.field}" = 1`,
          values: [],
        }
      default:
        throw new Error(`Unsupported operator: ${operator}`)
    }
  }

  private _throwError = (error: unknown) => {
    console.error(error)
    throw error
  }
}
