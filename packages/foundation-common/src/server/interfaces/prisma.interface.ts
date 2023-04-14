import type { Row, Data } from '../'

export interface Base {
  create: (params: { data: Data }) => Promise<Row>
  update: (params: { data: Data; where: Data }) => Promise<Row>
  upsert: (params: { create: Data; update: Data; where: Data }) => Promise<Row>
  findUnique: (params: { where: Data }) => Promise<Row>
  findMany: (params: { where?: Data }) => Promise<Row[]>
  delete: (params: { where: Data }) => Promise<Row>
}

export interface Model {
  map?: string
  unique?: string[]
  fields: {
    [key: string]: {
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
  }
}
