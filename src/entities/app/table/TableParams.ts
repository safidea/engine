import * as t from 'io-ts'
import { FieldParams } from './field/FieldParams'

export const TableParams = t.type({
  name: t.string,
  fields: t.array(FieldParams),
})

export type TableParams = t.TypeOf<typeof TableParams>
