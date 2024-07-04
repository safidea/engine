import type { Config as Database } from '@domain/services/Database'
import type { Field } from './Field'

export interface Table {
  name: string
  fields: Field[]
  database?: Database
}

export type TableSchema = Table
