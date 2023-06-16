import type { DatabaseInterface, DatabaseDataType, DatabaseRowType } from 'shared-database'
import type { TableInterface } from 'shared-table'

export interface DatabaseProviderTableInterface {
  create: (params: { data: DatabaseDataType }) => Promise<DatabaseRowType>
  createMany: (params: { data: DatabaseDataType[] }) => Promise<DatabaseRowType[]>
  update: (params: { data: DatabaseDataType; where: { id: string } }) => Promise<DatabaseRowType>
  upsert: (params: {
    create: DatabaseDataType
    update: DatabaseDataType
    where: { id: string }
  }) => Promise<DatabaseRowType>
  findUnique: (params: { where: { id: string } }) => Promise<DatabaseRowType>
  findMany: (params: { where?: { id: string } }) => Promise<DatabaseRowType[]>
  delete: (params: { where: { id: string } }) => Promise<DatabaseRowType>
}

export interface DatabaseProviderInterface {
  setConnectionSchema(database: DatabaseInterface): void
  addTableSchema(tableName: string, tableConfig: TableInterface): void
  generateClient(): Promise<void>
  prepareMigration(): Promise<void>
  applyMigration(): Promise<void>
  table(tableName: string): DatabaseProviderTableInterface | undefined
  getTableEnumName(table: string, field: string): string
  loadCached(): Promise<void>
  cache(): Promise<void>
}

export interface DatabaseProviderConstructorInterface {
  new (params: { appVersion: string; appName: string }): DatabaseProviderInterface
}
