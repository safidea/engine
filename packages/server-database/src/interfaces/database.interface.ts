import type { DatabaseInterface, DatabaseDataType, DatabaseRowType } from 'shared-database'
import type { TableInterface } from 'shared-table'

export interface DatabaseProviderTableInterface {
  create: (params: { data: DatabaseDataType }) => Promise<DatabaseRowType>
  createMany: (params: { data: DatabaseDataType[] }) => Promise<DatabaseRowType[]>
  update: (params: { data: DatabaseDataType; where: DatabaseDataType }) => Promise<DatabaseRowType>
  upsert: (params: {
    create: DatabaseDataType
    update: DatabaseDataType
    where: DatabaseDataType
  }) => Promise<DatabaseRowType>
  findUnique: (params: { where: DatabaseDataType }) => Promise<DatabaseRowType>
  findMany: (params: { where?: DatabaseDataType }) => Promise<DatabaseRowType[]>
  delete: (params: { where: DatabaseDataType }) => Promise<DatabaseRowType>
}

export interface DatabaseProviderInterface {
  setConnectionSchema(database: DatabaseInterface): void
  addTableSchema(tableName: string, tableConfig: TableInterface): void
  generateClient(): Promise<void>
  testConnection(): Promise<void>
  testMigration(): Promise<void>
  table(tableName: string): DatabaseProviderTableInterface | undefined
  getTableEnumName(table: string, field: string): string
}

export interface DatabaseProviderConstructorInterface {
  new (params: { appVersion: string; appName: string }): DatabaseProviderInterface
}
