import * as t from 'io-ts'
import { FieldParams } from './field/FieldParams'

export type TableParams = {
  readonly name: string
  readonly fields: FieldParams[]
}

export const TableParams: t.Type<TableParams> = t.type({
  name: t.string,
  fields: t.array(FieldParams),
})
