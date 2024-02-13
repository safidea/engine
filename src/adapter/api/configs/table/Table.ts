import type { Database } from '../Database'
import type { Field } from './field'

export interface Table {
  name: string
  fields: Field[]
  database?: Database
}

export type TableSchema = Table
