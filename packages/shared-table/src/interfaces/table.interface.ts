import type { ObjectInterface } from 'shared-common'

export interface TableFieldInterface extends ObjectInterface {
  type: 'String' | 'Int' | 'Boolean' | 'Float' | 'DateTime' | 'Json' | 'SingleSelect'
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

export interface TableFieldsInterface extends ObjectInterface {
  [key: string]: TableFieldInterface
}

export interface TableInterface extends ObjectInterface {
  model?: string
  unique?: string[]
  fields: TableFieldsInterface
}

export interface TablesInterface extends ObjectInterface {
  [key: string]: TableInterface
}
