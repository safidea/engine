import { Field } from './field.type'

export type Table = {
  model?: string
  unique?: string[]
  fields: {
    [key: string]: Field
  }
}
