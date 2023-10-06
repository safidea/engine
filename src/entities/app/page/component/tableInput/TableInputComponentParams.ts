import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

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
    style: t.partial({
      container: UIStyle,
      menu: UIStyle,
      label: UIStyle,
      addLabel: UIStyle,
      table: UIStyle,
      header: UIStyle,
      headerColumn: UIStyle,
      rows: UIStyle,
      row: UIStyle,
      cell: UIStyle,
      remove: UIStyle,
    }),
  }),
])

export type TableInputComponentParams = t.TypeOf<typeof TableInputComponentParams>
