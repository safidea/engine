import * as t from 'io-ts'
import { BaseInputComponentParams } from '../base/BaseInputComponentParams'

export const TableInputComponentParams = t.intersection([
  BaseInputComponentParams,
  t.type({
    type: t.literal('table'),
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
])

export type TableInputComponentParams = t.TypeOf<typeof TableInputComponentParams>
