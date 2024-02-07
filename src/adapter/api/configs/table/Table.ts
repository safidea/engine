import type { Field } from './field'

export interface Table {
  name: string
  fields: Field[]
}

export type TableSchema = Table
