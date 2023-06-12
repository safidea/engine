import debug from 'debug'
import { v4 as uuidv4 } from 'uuid'
import type {
  DatabaseDataType,
  DatabaseInterface,
  DatabaseProviderInterface,
  DatabaseProviderTableInterface,
  DatabaseRowType,
} from 'server-database'

import type { TableInterface } from 'server-table'

const log = debug('spec:database-provider')

class DatabaseProvider implements DatabaseProviderInterface {
  private db: { [key: string]: any } = {}
  private tables: { [key: string]: TableInterface } = {}

  setConnectionSchema(database: DatabaseInterface): void {
    log('setConnectionSchema', database)
  }

  addTableSchema(tableName: string, tableConfig: TableInterface): void {
    this.db[tableName] = []
    this.tables[tableName] = tableConfig
  }

  async testMigration(): Promise<void> {
    log('testMigration')
  }

  async testConnection(): Promise<void> {
    log('testConnection')
  }

  async generateClient(): Promise<void> {
    log('testConnection')
  }

  getTableEnumName(table: string, field: string): string {
    return `${table}_${field}`
  }

  table(tableName: string): DatabaseProviderTableInterface | undefined {
    if (!this.db[tableName]) return undefined
    const createRow = async ({ data }: { data: DatabaseDataType }): Promise<DatabaseRowType> => {
      const row = {
        ...data,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      }
      this.db[tableName].push(row)
      return row
    }
    const updateRow = async ({
      where: { id },
      data,
    }: {
      where: { id: string }
      data: DatabaseDataType
    }): Promise<DatabaseRowType> => {
      const index = this.db[tableName].findIndex((row: any) => row.id === id)
      this.db[tableName][index] = { ...this.db[tableName][index], ...data }
      return this.db[tableName][index]
    }
    return {
      findUnique: async ({
        where: { id },
      }: {
        where: { id: string }
      }): Promise<DatabaseRowType> => {
        return this.db[tableName].find((row: any) => row.id === id)
      },
      findMany: async (): Promise<DatabaseRowType[]> => {
        return this.db[tableName]
      },
      create: createRow,
      createMany: async ({ data }: { data: DatabaseDataType[] }): Promise<DatabaseRowType[]> => {
        return Promise.all(data.map((row) => createRow({ data: row })))
      },
      update: updateRow,
      upsert: async ({
        where: { id },
        create,
        update,
      }: {
        where: { id: string }
        create: DatabaseDataType
        update: DatabaseDataType
      }): Promise<DatabaseRowType> => {
        const index = this.db[tableName].findIndex((row: any) => row.id === id)
        if (index === -1) {
          return createRow({ data: create })
        }
        return updateRow({ where: { id }, data: update })
      },
      delete: async ({ where: { id } }: { where: { id: string } }): Promise<DatabaseRowType> => {
        const row = this.db[tableName].find((row: any) => row.id === id)
        this.db[tableName] = this.db[tableName].filter((row: any) => row.id !== id)
        return row
      },
    }
  }
}

export default DatabaseProvider
