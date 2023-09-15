import * as t from 'io-ts'
import { BaseInputComponentParams } from '../base/BaseInputComponentParams'

export const TableInputComponentParams = t.intersection([
  BaseInputComponentParams,
  t.type({
    type: t.literal('table'),
    columns: t.array(
      t.type({
        label: t.string,
        field: t.string,
        placeholder: t.string,
      })
    ),
    addLabel: t.string,
  }),
])

export type TableInputComponentParams = t.TypeOf<typeof TableInputComponentParams>
