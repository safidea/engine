import SQLite, { SqliteError } from 'better-sqlite3'
import type { Driver } from '@adapter/spi/DatabaseTableSpi'
import type { FilterDto } from '@adapter/spi/dtos/FilterDto'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'
import type { PersistedDto, ToCreateDto, ToUpdateDto } from '@adapter/spi/dtos/RecordDto'
import type { DataType } from '@domain/entities/Record/ToCreate'

interface ColumnInfo {
  name: string
  type: string
  required: number
}

export class SqliteTableDriver implements Driver {
  constructor(
    private _name: string,
    private _fields: FieldDto[],
    private _db: SQLite.Database
  ) {}

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
              joins += ` JOIN ${manyToManyTableName} ON ${this._name}.id = ${manyToManyTableName}.${this._name}_id`
              joins += ` JOIN ${field.table}_view ON ${manyToManyTableName}.${field.table}_id = ${field.table}_view.id`
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

  insert = async (record: ToCreateDto) => {
    try {
      const { staticFields, manyToManyFields } = this._splitFields(record)
      const keys = Object.keys(staticFields)
      const values = this._preprocess(Object.values(staticFields))
      const placeholders = keys.map(() => `?`).join(', ')
      const query = `INSERT INTO ${this._name} (${keys.join(', ')}) VALUES (${placeholders})`
      this._db.prepare(query).run(values)
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
      const values = this._preprocess(Object.values(staticFields))
      const setString = keys.map((key) => `${key} = ?`).join(', ')
      const query = `UPDATE ${this._name} SET ${setString} WHERE id = ${record.id}`
      this._db.prepare(query).run(values)
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
        .map((filter) => `${filter.field} ${filter.operator} ?`)
        .join(' AND ')
      const values = filters.map((filter) => filter.value)
      const query = `DELETE FROM ${this._name} ${conditions.length > 0 ? `WHERE ${conditions}` : ''}`
      this._db.prepare(query).run(values)
    } catch (e) {
      this._throwError(e)
    }
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
    const conditions = filters
      .map((filter) => {
        if (filter.operator === 'in') {
          const placeholders = filter.value.map(() => '?').join(',')
          return `${filter.field} ${filter.operator} (${placeholders})`
        } else {
          return `${filter.field} ${filter.operator} ?`
        }
      })
      .join(' AND ')
    const values = filters.reduce((acc: (string | number)[], filter) => {
      if (filter.operator === 'in') acc.push(...filter.value)
      else acc.push(filter.value)
      return acc
    }, [])
    const query = `SELECT * FROM ${this._name}_view ${conditions.length > 0 ? `WHERE ${conditions}` : ''}`
    const records = this._db.prepare(query).all(values) as PersistedDto[]
    return records.map(this._postprocess)
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
        const query = `INSERT INTO ${manyToManyTableName} ("${this._name}_id", "${tableName}_id") VALUES (?, ?)`
        this._db.prepare(query).run([recordId, id])
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
      this._db.prepare(deleteQuery).run([recordId])
      for (const id of ids) {
        const query = `INSERT INTO ${manyToManyTableName} ("${this._name}_id", "${tableName}_id") VALUES (?, ?)`
        this._db.prepare(query).run([recordId, id])
      }
    }
  }

  private _getExistingColumns = (): ColumnInfo[] => {
    return this._db.prepare(`PRAGMA table_info(${this._name})`).all() as ColumnInfo[]
  }

  private _convertFormula = (formula: string, values: string) => {
    return formula.replace(/\bCONCAT\b/g, 'GROUP_CONCAT').replace(/\bvalues\b/g, values)
  }

  private _preprocess = (values: DataType[]) => {
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
      const field = this._fields.find((f) => f.name === key)
      if (!field) throw new Error('Field not found.')
      if (!value) return acc
      if (field.type === 'TIMESTAMP') {
        acc[key] = new Date(Number(value))
      } else if (field.type === 'TEXT[]' && typeof value === 'string') {
        acc[key] = value.split(',')
      }
      return acc
    }, persistedRecord)
  }

  private _throwError = (error: unknown) => {
    if (error instanceof SqliteError) {
      if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        throw new Error('Key is not present in table.')
      }
    }
    console.error(error)
    throw error
  }
}
