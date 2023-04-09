export type ValueType = 'string' | 'number' | 'boolean' | 'array'

export type Value = {
  type: ValueType
  nullable?: boolean
  default?: ValueType
  items?: {
    type: string
    nullable: boolean
  }
}
