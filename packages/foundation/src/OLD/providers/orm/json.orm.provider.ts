import debug from 'debug'
import fs from 'fs-extra'
import { join } from 'path'
import { StringUtils } from 'shared-common'
import { PathUtils } from 'server-common'

import type { DatabaseInterface } from 'shared-database'
import type {
  OrmProviderInterface,
  OrmProviderTableInterface,
  OrmProviderTablesInterface,
} from 'server-database'
import type { TableInterface } from 'server-table'
import type { ProviderProps } from '../../interfaces/provider'

const log = debug('spec:database-provider')

class JsonOrmProvider implements OrmProviderInterface {
  private tables: { [key: string]: TableInterface } = {}
  private pathUtils: PathUtils

  constructor({ pathUtils }: ProviderProps) {
    this.pathUtils = pathUtils
  }

  public setConnectionSchema(database: DatabaseInterface): void {
    log('setConnectionSchema', database)
  }

  public addTableSchema(tableName: string, tableConfig: TableInterface): void {
    this.tables[tableName] = tableConfig
  }

  public getTableEnumName(table: string, field: string): string {
    return `${table}_${field}`
  }

  public getTable(name: string, orm: OrmProviderTablesInterface): OrmProviderTableInterface {
    return orm[StringUtils.singular(name).toLowerCase()]
  }

  public async generateClient(): Promise<void> {
    log('testConnection')
  }

  public async prepareMigration(): Promise<void> {
    log('prepareMigration')
  }

  public async applyMigration(): Promise<void> {
    log('applyMigration')
  }

  // TODO: typer les fonctions avec JSDoc pour ne plus avoir de auvaise surprise dans les tests
  public async buildOrmFile(): Promise<void> {
    const ormFile = join(this.pathUtils.getAppPath(), 'orm.js')
    const ormFileContent = `
    import { v4 as uuidv4 } from 'uuid'

    class JsonOrm {
      _db = {
        ${Object.keys(this.tables)
          .map((tableName) => {
            return `${tableName}: []`
          })
          .join(',\n')}
      }
      _tables = ${JSON.stringify(this.tables, null, 2)}

      deleteAll = async () => {
        this._db = {
          ${Object.keys(this.tables)
            .map((tableName) => {
              return `${tableName}: []`
            })
            .join(',\n')}
        }
      }
      
      ${Object.keys(this.tables)
        .map((tableName) => {
          return `${StringUtils.singular(tableName)} = {
            findUnique: async ({ where: { id } }) => {
              const row = this._db.${tableName}.find((row) => row.id === id)
              if (row) {
                const { quantity, unit_price } = row
                row.total_amount = quantity * unit_price
              }
              return row
            },
            findMany: async () => {
              const rows = this._db.${tableName}
              if (rows?.length > 0) {
                for (const row of rows) {
                  const { quantity, unit_price } = row
                  row.total_amount = quantity * unit_price
                }
              }
              return rows
            },
            create: async ({ data }) => {
              delete data.total_amount
              if (!data.status) data.status = 'draft'
              const row = {
                ...data,
                id: uuidv4(),
                created_at: new Date().toISOString(),
              }
              // TODO: make this generic for all generated tables
              if (row.items?.create) {
                const rows = await this.invoices_item.createMany({ data: row.items.create })
                row.items = rows.map((r) => r.id)
              }
              this._db.${tableName}.push(row)
              return row
            },
            createMany: async ({ data }) => {
              return Promise.all(data.map((row) => this.${StringUtils.singular(
                tableName
              )}.create({ data: row })))
            },
            update: async ({ where: { id }, data }) => {
              delete data.total_amount
              const index = this._db.${tableName}.findIndex((row) => row.id === id)
              const row = { ...this._db.${tableName}[index], ...data }
              if (row.items?.update) {
                const rows = await this.invoices_item.updateMany({ data: row.items.update })
                row.items = rows.map((r) => r.id)
              }
              this._db.${tableName}[index] = row
              return row
            },
            updateMany: async ({ data }) => {
              return Promise.all(data.map((row) => this.${StringUtils.singular(
                tableName
              )}.update({ data: row, where: { id: row.id } })))
            },
            upsert: async ({ where: { id }, create, update }) => {
              const index = this._db.${tableName}.findIndex((row) => row.id === id)
              if (index === -1) {
                return this.${StringUtils.singular(tableName)}.create({ data: create })
              }
              return this.${StringUtils.singular(tableName)}.update({ where: { id }, data: update })
            },
            delete: async ({ where: { id } }) => {
              const row = this._db.${tableName}.find((row) => row.id === id)
              this._db.${tableName} = this._db.${tableName}.filter((row) => row.id !== id)
              return row
            }
          }`
        })
        .join('\n\n')}
    }

    const orm = new JsonOrm()

    export default orm`
    fs.ensureFileSync(ormFile)
    fs.writeFileSync(ormFile, ormFileContent)
  }
}

export default JsonOrmProvider
