import type { DatabaseInterface, DatabaseDataType, DatabaseRowType } from 'shared-database'
import type { TableInterface } from 'shared-table'

export interface OrmProviderTablesInterface {
  [key: string]: OrmProviderTableInterface
}

export interface OrmProviderTableInterface {
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

export interface OrmProviderInterface {
  setConnectionSchema(database: DatabaseInterface): void
  addTableSchema(tableName: string, tableConfig: TableInterface): void
  generateClient(): Promise<void>
  prepareMigration(): Promise<void>
  applyMigration(): Promise<void>
  buildOrmFile(): Promise<void>
  getTable(name: string, orm: OrmProviderTablesInterface): OrmProviderTableInterface
  getTableEnumName(table: string, field: string): string
}

export interface OrmProviderConstructorInterface {
  new (): OrmProviderInterface
}
