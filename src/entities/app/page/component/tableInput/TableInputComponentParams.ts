import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'

export const TableInputComponentParams = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('table_input'),
    field: t.string,
    columns: t.array(
      t.intersection([
        t.type({
          label: t.string,
          field: t.string,
        }),
        t.partial({ placeholder: t.string }),
      ])
    ),
    addLabel: t.string,
  }),
  t.partial({
    label: t.string,
    placeholder: t.string,
  }),
])

export type TableInputComponentParams = t.TypeOf<typeof TableInputComponentParams>
