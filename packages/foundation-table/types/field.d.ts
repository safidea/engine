export type Field = {
  type: 'string' | 'integer' | 'float' | 'boolean' | 'datetime'
  primary?: boolean
  generated?: 'increment'
  nullable?: boolean
}
