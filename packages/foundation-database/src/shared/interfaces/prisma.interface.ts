import type { ObjectInterface } from '@common'
import type { DatabaseDataType, DatabaseRowType } from '@database'
import type { PrismaClientType } from '@database'

export interface PrismaClientInterface {
  create: (params: { data: DatabaseDataType }) => Promise<DatabaseRowType>
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

export interface PrismaClientsInterface {
  [key: string]: {
    PrismaClient: new () => PrismaClientType
  }
}

export interface PrismaModelFieldInterface extends ObjectInterface {
  type: string
  primary?: boolean
  optional?: boolean
  list?: boolean
  default?: string | number | boolean
  unique?: boolean
  relation?: {
    fields: string[]
    references: string[]
    onDelete: string
  }
}

export interface PrismaModelFieldsInterface {
  [key: string]: PrismaModelFieldInterface
}

export interface PrismaModelInterface {
  map?: string
  unique?: string[]
  fields: PrismaModelFieldsInterface
}
