export type Field = {
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
